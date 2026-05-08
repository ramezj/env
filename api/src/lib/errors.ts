import type { Response } from "express";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function sendError(res: Response, error: unknown) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

export function sendResponse(
  res: Response,
  data: unknown,
  statusCode: number = 200,
) {
  return res.status(statusCode).json({ data });
}
