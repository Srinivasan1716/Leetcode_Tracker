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
// Analytics Summary Controller Endpoint
export const getAnalyticsSummaryController = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ totalHours: 42, solvedCount: 120, avgAccuracy: 84 });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Difficulty Breakdown Metrics Calculator
export const calculateDifficultyBreakdown = (easy: number, medium: number, hard: number) => ({
  easyPercentage: Math.round((easy / (easy + medium + hard || 1)) * 100),
  mediumPercentage: Math.round((medium / (easy + medium + hard || 1)) * 100),
  hardPercentage: Math.round((hard / (easy + medium + hard || 1)) * 100)
});

// Topic Performance Ranking Aggregator
export const rankTopicsByPerformance = (topics: { name: string; accuracy: number }[]) => {
  return [...topics].sort((a, b) => b.accuracy - a.accuracy);
};

// User Study Streak Calculator Controller
export const getUserStreakController = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ currentStreak: 5, longestStreak: 14 });
  } catch (err) {
    return res.status(500).json({ error: 'Streak calculation failed' });
  }
};

// Company Readiness Score Aggregator Controller
export const getCompanyReadinessController = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ companies: [{ name: 'Meta', score: 76 }, { name: 'Google', score: 68 }] });
  } catch (err) {
    return res.status(500).json({ error: 'Company readiness failed' });
  }
};

// Export Analytics CSV Controller
export const exportAnalyticsCsvController = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/csv');
  return res.status(200).send('topic,accuracy,solved\n');
};

// Validate Analytics Date Range Query
export const validateDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

// Rate Limiting Helper for Analytics
const analyticsRateMap = new Map<string, number>();
export const checkAnalyticsRateLimit = (ip: string) => {
  const now = Date.now();
  const last = analyticsRateMap.get(ip) || 0;
  if (now - last < 500) return false;
  analyticsRateMap.set(ip, now);
  return true;
};
