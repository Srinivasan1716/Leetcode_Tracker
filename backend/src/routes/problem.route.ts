import { Router } from "express";
import {
  createProblemController,
  getProblemsController,
  getProblemByIdController,
} from "../controllers/problem.controller";

const router = Router();

router.post("/", createProblemController);
router.get("/", getProblemsController);
router.get("/:id", getProblemByIdController);

export default router;