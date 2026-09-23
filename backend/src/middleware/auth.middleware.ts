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

// Main JWT authentication middleware
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Optional auth middleware - passes even without token
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.userId = decoded.userId;
    req.email = decoded.email;
  } catch (_) {}
  next();
};
