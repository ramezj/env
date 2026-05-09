import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { requireAuth, type SessionVar } from "../middleware/requireAuth";
import { db } from "../db";
import { project, member } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { createProjectSchema, updateProjectSchema } from "../schemas/projects.schemas";

export const projectsRouter = new Hono<SessionVar>()
  .use(requireAuth)

  // POST /api/projects
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const { organizationId, name, description } = c.req.valid("json");
    const { user } = c.var.session;

    // Verify user is a member of the organization
    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, user.id),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!membership) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const id = crypto.randomUUID();
    const newProject = await db
      .insert(project)
      .values({
        id,
        organizationId,
        name,
        description,
      })
      .returning()
      .get();

    return c.json({ data: newProject }, 201);
  })

  // GET /api/projects?organizationId=xyz
  .get("/", async (c) => {
    const organizationId = c.req.query("organizationId");
    const { user } = c.var.session;

    if (!organizationId) {
      return c.json({ error: "organizationId is required" }, 400);
    }

    // Verify user is a member of the organization
    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, user.id),
        eq(member.organizationId, organizationId)
      ),
    });

    if (!membership) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const data = await db.query.project.findMany({
      where: eq(project.organizationId, organizationId),
      orderBy: (project, { desc }) => [desc(project.createdAt)],
    });

    return c.json({ data });
  })

  // GET /api/projects/:projectId
  .get("/:projectId", async (c) => {
    const projectId = c.req.param("projectId");
    const { user } = c.var.session;

    const data = await db.query.project.findFirst({
      where: eq(project.id, projectId),
    });

    if (!data) return c.json({ error: "Project not found" }, 404);

    // Verify membership
    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, user.id),
        eq(member.organizationId, data.organizationId)
      ),
    });

    if (!membership) return c.json({ error: "Forbidden" }, 403);

    return c.json({ data });
  })

  // PATCH /api/projects/:projectId
  .patch("/:projectId", zValidator("json", updateProjectSchema), async (c) => {
    const projectId = c.req.param("projectId");
    const { name, description } = c.req.valid("json");
    const { user } = c.var.session;

    const existing = await db.query.project.findFirst({
      where: eq(project.id, projectId),
    });

    if (!existing) return c.json({ error: "Project not found" }, 404);

    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, user.id),
        eq(member.organizationId, existing.organizationId)
      ),
    });

    // Typically, only admins should edit a project, but we'll allow any member for now
    if (!membership) return c.json({ error: "Forbidden" }, 403);

    const updated = await db
      .update(project)
      .set({
        name,
        description,
      })
      .where(eq(project.id, projectId))
      .returning()
      .get();

    return c.json({ data: updated });
  })

  // DELETE /api/projects/:projectId
  .delete("/:projectId", async (c) => {
    const projectId = c.req.param("projectId");
    const { user } = c.var.session;

    const existing = await db.query.project.findFirst({
      where: eq(project.id, projectId),
    });

    if (!existing) return c.json({ error: "Project not found" }, 404);

    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, user.id),
        eq(member.organizationId, existing.organizationId)
      ),
    });

    // Need to be at least admin to delete a project
    if (!membership || membership.role !== "admin" && membership.role !== "owner") {
      return c.json({ error: "Forbidden: Admins only" }, 403);
    }

    await db.delete(project).where(eq(project.id, projectId));
    return new Response(null, { status: 204 });
  });
