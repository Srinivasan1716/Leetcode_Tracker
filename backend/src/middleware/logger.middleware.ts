import { Request, Response, NextFunction } from "express";

// HTTP request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
};

// Log response size for performance monitoring
export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const size = JSON.stringify(body).length;
    console.log(`[ResponseSize] ${req.method} ${req.path} -> ${size} bytes`);
    return originalJson(body);
  };
  next();
};
