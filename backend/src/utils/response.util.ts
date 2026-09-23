import { Response } from "express";

// Standard success response wrapper
export const sendSuccess = (res: Response, data: unknown, message: string = "Success", status: number = 200) => {
  return res.status(status).json({ success: true, message, data });
};

// Standard error response wrapper
export const sendError = (res: Response, message: string, status: number = 500) => {
  return res.status(status).json({ success: false, message, data: null });
};

// Paginated response wrapper with metadata
export const sendPaginated = (res: Response, data: unknown[], total: number, page: number, limit: number) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  });
};

// Created (201) response shorthand
export const sendCreated = (res: Response, data: unknown, message: string = "Created successfully") => {
  return res.status(201).json({ success: true, message, data });
};

// No content (204) response helper
export const sendNoContent = (res: Response) => res.status(204).send();
