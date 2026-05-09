import { createMiddleware } from "hono/factory";
import { auth } from "../auth";

// Typed Hono variable — accessible via c.get("session") in any route
type SessionVar = {
  Variables: {
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
  };
};

export type { SessionVar };

export const requireAuth = createMiddleware<SessionVar>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("session", session);
  await next();
});
