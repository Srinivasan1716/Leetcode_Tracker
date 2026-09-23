import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";

export interface AuthRequest extends Request {
  userId?: number;
  email?: string;
}
