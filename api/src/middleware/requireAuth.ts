import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import { ApiError, sendError } from "../lib/errors";

// Extend Express's Request type to carry the authenticated session
declare global {
  namespace Express {
    interface Request {
      session: {
        user: {
          id: string;
          name: string;
          email: string;
          emailVerified: boolean;
        };
        session: {
          id: string;
          token: string;
          expiresAt: Date;
          userId: string;
        };
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new ApiError(401, "You are Unauthorized");
    }

    req.session = session;
    next();
  } catch (error) {
    sendError(res, error);
  }
}
