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

// Log slow requests that exceed 500ms
export const slowRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    if (ms > 500) console.warn(`[SLOW REQUEST] ${req.method} ${req.path} took ${ms}ms`);
  });
  next();
};

// Sanitize sensitive fields from logs
export const sanitizeLogFields = (body: Record<string, unknown>) => {
  const sensitive = ["password", "token", "apiKey", "secret"];
  const safe = { ...body };
  sensitive.forEach(f => { if (safe[f]) safe[f] = "***REDACTED***"; });
  return safe;
};

// Request body logger for debugging (dev only)
export const bodyLogger = (req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development" && req.body) {
    console.log(`[Body] ${req.method} ${req.path}`, sanitizeLogFields(req.body));
  }
  next();
};

// Export combined middleware logger chain
export const combinedLogger = [requestLogger, slowRequestLogger];
