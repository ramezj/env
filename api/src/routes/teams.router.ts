import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teams.controller";

const router = Router();

router.use(requireAuth);

// Team CRUD
router.post("/", createTeam);
router.get("/", listTeams);
router.get("/:teamId", getTeam);
router.patch("/:teamId", updateTeam);
router.delete("/:teamId", deleteTeam);

// Member management
// router.delete("/:teamId/members/:memberId", removeMember);
// router.patch("/:teamId/members/:memberId/role", updateMemberRole);

export default router;
