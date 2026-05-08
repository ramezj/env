import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";

const router = Router();

router.get("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

export default router;
