import { Request, Response } from "express";
import { getUserDashboard } from "../services/dashboard.service";

export const getDashboardController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const dashboard = await getUserDashboard(userId);

    return res.status(200).json({
      dashboard,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard",
    });
  }
};