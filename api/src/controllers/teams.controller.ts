import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { ApiError, sendError, sendResponse } from "../lib/errors";
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

export async function createTeam(req: Request, res: Response) {
  try {
    const result = createTeamSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ error: "Validation failed" });
    }

    const { name } = result.data;
    const data = await auth.api.createOrganization({
      body: { name, slug: slugify(name) },
      headers: fromNodeHeaders(req.headers),
    });

    return sendResponse(res, data, 201);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function listTeams(req: Request, res: Response) {
  try {
    const data = await auth.api.listOrganizations({
      headers: fromNodeHeaders(req.headers),
    });

    return sendResponse(res, data);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getTeam(req: Request, res: Response) {
  try {
    const { teamId } = req.params;

    const data = await auth.api.getFullOrganization({
      query: { organizationId: teamId as string },
      headers: fromNodeHeaders(req.headers),
    });

    if (!data) throw new ApiError(404, "Team not found");

    return sendResponse(res, data);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateTeam(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const result = updateTeamSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({ error: "Validation failed" });
    }

    const { name } = result.data;
    const data = await auth.api.updateOrganization({
      body: { organizationId: teamId as string, data: { name } },
      headers: fromNodeHeaders(req.headers),
    });

    return sendResponse(res, data);
  } catch (error) {
    return sendError(res, error);
  }
}

export async function deleteTeam(req: Request, res: Response) {
  try {
    const { teamId } = req.params;

    await auth.api.deleteOrganization({
      body: { organizationId: teamId as string },
      headers: fromNodeHeaders(req.headers),
    });

    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}
