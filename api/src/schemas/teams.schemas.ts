import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string({ error: "Team name is required" })
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be at most 50 characters")
    .trim(),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be at most 50 characters")
    .trim()
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Must be a valid email address"),
  role: z.enum(["admin", "member"] as const),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"] as const),
});


