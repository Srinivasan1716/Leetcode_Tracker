import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";

export interface AuthRequest extends Request {
  userId?: number;
  email?: string;
}

// Extract Bearer token from Authorization header
const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};
