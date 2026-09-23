import { Response } from "express";

// Standard success response wrapper
export const sendSuccess = (res: Response, data: unknown, message: string = "Success", status: number = 200) => {
  return res.status(status).json({ success: true, message, data });
};

// Standard error response wrapper
export const sendError = (res: Response, message: string, status: number = 500) => {
  return res.status(status).json({ success: false, message, data: null });
};
