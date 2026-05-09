import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { teamsRouter } from "./routes/teams.router";
import { meRouter } from "./routes/me.router";

const app = new Hono()
  .use(
    cors({
      origin: "http://localhost:3000",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  // Better Auth handles all /api/auth/* routes
  .on(["GET", "POST"], "/api/auth/**", (c) => auth.handler(c.req.raw))
  // App routes — must be chained so TypeScript captures the route types
  .route("/api/me", meRouter)
  .route("/api/teams", teamsRouter);

const port = Number(process.env.PORT) || 4000;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Export the app type for the Hono RPC client
export type AppType = typeof app;
