import { Router } from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../auth";

const router = Router();

// Better Auth handles all /api/auth/* routes
router.all("/*splat", toNodeHandler(auth));

export default router;
