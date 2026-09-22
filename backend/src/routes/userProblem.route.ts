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
// Sync Submission Endpoint
router.post('/sync', updateStatusController);

// Request validation helper
const validateSyncRequest = (req: any, res: any, next: any) => next();

// Bookmark Toggle Route
router.post('/bookmark', updateStatusController);

// Problem Notes Update Route
router.put('/notes', updateStatusController);

// User Problem History Fetch Route
router.get('/history/:userId', getUserProblemsController);

// Export configured user problem routes module
export const USER_PROBLEM_ROUTES_VERSION = '1.0.31';
