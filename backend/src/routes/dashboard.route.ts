import { Router } from "express";
import { getDashboardController } from "../controllers/dashboard.controller";

const router = Router();

router.get("/:userId", getDashboardController);

export default router;