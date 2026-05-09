import { z } from "zod";

export const createProjectSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
  description: z.string().optional(),
});
