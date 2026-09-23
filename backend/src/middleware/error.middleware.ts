import { Request, Response, NextFunction } from "express";

// Custom application error class
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = "AppError";
  }
}

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};

// Global error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);
  res.status(status).json({ message: err.message || "Internal server error" });
};

// Async handler wrapper to avoid try/catch repetition
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
