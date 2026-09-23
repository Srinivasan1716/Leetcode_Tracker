import { Request, Response, NextFunction } from "express";

// Required fields validator
export const requireFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(f => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }
    next();
  };
};

// Validate numeric ID in route params
export const validateIdParam = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params[paramName]);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `Invalid ${paramName}: must be a positive number` });
    }
    next();
  };
};

// Validate allowed status values
export const validateStatus = (req: Request, res: Response, next: NextFunction) => {
  const allowed = ["NOT_STARTED", "IN_PROGRESS", "SOLVED"];
  if (req.body.status && !allowed.includes(req.body.status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });
  }
  next();
};

// Sanitize string inputs to prevent injection
export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim().replace(/<[^>]*>/g, "");
    }
  }
  next();
};

// Validate pagination query params
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ message: "Invalid pagination params" });
  }
  next();
};
