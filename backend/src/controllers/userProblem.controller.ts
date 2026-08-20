import { Request, Response } from "express";
import {
  updateProblemStatus,
  getUserProblems,
  getUserProblem,
} from "../services/userProblem.service";

export const updateStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, problemId, status } = req.body;

    if (!userId || !problemId || !status) {
      return res.status(400).json({
        message: "userId, problemId and status are required",
      });
    }

    const validStatuses = [
      "NOT_STARTED",
      "IN_PROGRESS",
      "SOLVED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const userProblem = await updateProblemStatus(
      Number(userId),
      Number(problemId),
      status
    );

    return res.status(200).json({
      message: "Problem status updated successfully",
      userProblem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update problem status",
    });
  }
};

export const getUserProblemsController = async (
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

    const problems = await getUserProblems(userId);

    return res.status(200).json({
      problems,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch user problems",
    });
  }
};

export const getUserProblemController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);
    const problemId = Number(req.params.problemId);

    if (isNaN(userId) || isNaN(problemId)) {
      return res.status(400).json({
        message: "Invalid user ID or problem ID",
      });
    }

    const userProblem = await getUserProblem(
      userId,
      problemId
    );

    if (!userProblem) {
      return res.status(404).json({
        message: "Problem tracking record not found",
      });
    }

    return res.status(200).json({
      userProblem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch problem status",
    });
  }
};