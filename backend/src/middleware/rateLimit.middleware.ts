import { Request, Response, NextFunction } from "express";

// In-memory rate limit store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
