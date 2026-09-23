import { Response } from "express";

// Standard success response wrapper
export const sendSuccess = (res: Response, data: unknown, message: string = "Success", status: number = 200) => {
  return res.status(status).json({ success: true, message, data });
};
