import { Router } from "express";

import {
  updateStatusController,
  getUserProblemsController,
  getUserProblemController,
} from "../controllers/userProblem.controller";

const router = Router();

router.post("/status", updateStatusController);

router.get("/:userId", getUserProblemsController);

router.get("/:userId/:problemId", getUserProblemController);

export default router;