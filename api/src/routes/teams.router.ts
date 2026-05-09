import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../auth";
import { requireAuth, type SessionVar } from "../middleware/requireAuth";
import {
  createTeamSchema,
  updateTeamSchema,
} from "../schemas/teams.schemas";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const teamsRouter = new Hono<SessionVar>()
  .use(requireAuth)

  // POST /api/teams
  .post("/", zValidator("json", createTeamSchema), async (c) => {
    const { name } = c.req.valid("json");
    const data = await auth.api.createOrganization({
      body: { name, slug: slugify(name) },
      headers: c.req.raw.headers,
    });
    return c.json({ data }, 201);
  })

  // GET /api/teams
  .get("/", async (c) => {
    const data = await auth.api.listOrganizations({
      headers: c.req.raw.headers,
    });
    return c.json({ data: data ?? [] });
  })

  // GET /api/teams/:teamId
  .get("/:teamId", async (c) => {
    const teamId = c.req.param("teamId");
    const data = await auth.api.getFullOrganization({
      query: { organizationId: teamId },
      headers: c.req.raw.headers,
    });
    if (!data) return c.json({ error: "Team not found" }, 404);
    return c.json({ data });
  })

  // PATCH /api/teams/:teamId
  .patch("/:teamId", zValidator("json", updateTeamSchema), async (c) => {
    const teamId = c.req.param("teamId");
    const { name } = c.req.valid("json");
    const data = await auth.api.updateOrganization({
      body: { organizationId: teamId, data: { name } },
      headers: c.req.raw.headers,
    });
    return c.json({ data });
  })

  // DELETE /api/teams/:teamId
  .delete("/:teamId", async (c) => {
    const teamId = c.req.param("teamId");
    await auth.api.deleteOrganization({
      body: { organizationId: teamId },
      headers: c.req.raw.headers,
    });
    return new Response(null, { status: 204 });
  });
