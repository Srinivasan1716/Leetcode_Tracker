import { Request, Response, NextFunction } from "express";

// Custom application error class
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = "AppError";
  }
}
