import { Request, Response, NextFunction } from "express";

// In-memory rate limit store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Core rate limiter factory function
export const createRateLimiter = (maxRequests: number, windowSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(key);
    if (!record || now > record.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return next();
    }
    if (record.count >= maxRequests) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)
      });
    }
    record.count++;
    next();
  };
};

// Auth endpoint rate limiter (strict: 5 req / 15 min)
export const authRateLimiter = createRateLimiter(5, 15 * 60);

// Sync submission rate limiter (10 req / 1 min)
export const syncRateLimiter = createRateLimiter(10, 60);

// General API rate limiter (100 req / 1 min)
export const generalRateLimiter = createRateLimiter(100, 60);

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) rateLimitMap.delete(key);
  }
}, 60 * 1000);
