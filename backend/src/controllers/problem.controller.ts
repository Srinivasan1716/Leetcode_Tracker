import { Request, Response } from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
} from "../services/problem.service";

export const createProblemController = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, description, difficulty, topic, link } = req.body;

    if (!title || !difficulty) {
      return res.status(400).json({
        message: "Title and difficulty are required",
      });
    }

    const problem = await createProblem(
      title,
      description,
      difficulty,
      topic,
      link
    );

    return res.status(201).json({
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create problem",
    });
  }
};

export const getProblemsController = async (
  req: Request,
  res: Response
) => {
  try {
    const problems = await getAllProblems();

    return res.status(200).json({
      problems,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch problems",
    });
  }
};

export const getProblemByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid problem ID",
      });
    }

    const problem = await getProblemById(id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      problem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch problem",
    });
  }
};