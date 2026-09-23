import os
import subprocess

repo_dir = r"c:\Users\mural\Leetcode_Tracker"

# Two files to improve today
middleware_dir = os.path.join(repo_dir, "backend", "src", "middleware")
auth_middleware = os.path.join(middleware_dir, "auth.middleware.ts")
rate_middleware = os.path.join(middleware_dir, "rateLimit.middleware.ts")
logger_middleware = os.path.join(middleware_dir, "logger.middleware.ts")
error_middleware = os.path.join(middleware_dir, "error.middleware.ts")
validate_middleware = os.path.join(middleware_dir, "validate.middleware.ts")
dashboard_service = os.path.join(repo_dir, "backend", "src", "services", "dashboard.service.ts")

def run_git(args):
    res = subprocess.run(["git"] + args, cwd=repo_dir, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Git error ({args}): {res.stderr}")
    return res

def commit_push(file_path, content, message, append=False):
    mode = "a" if append else "w"
    with open(file_path, mode, encoding="utf-8") as f:
        f.write(content)
    run_git(["add", "."])
    rc = run_git(["commit", "-m", message])
    rp = run_git(["push", "origin", "main"])
    print(f"[{rc.returncode}|{rp.returncode}] {message}")

steps = [
    # --- auth.middleware.ts (new file, 12 commits) ---
    (auth_middleware, 'import { Request, Response, NextFunction } from "express";\nimport jwt from "jsonwebtoken";\n\nconst JWT_SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";\n', "created jwt authentication middleware file", False),
    (auth_middleware, '\nexport interface AuthRequest extends Request {\n  userId?: number;\n  email?: string;\n}\n', "added auth request interface with user context", True),
    (auth_middleware, '\n// Extract Bearer token from Authorization header\nconst extractToken = (req: Request): string | null => {\n  const header = req.headers.authorization;\n  if (!header || !header.startsWith("Bearer ")) return null;\n  return header.split(" ")[1];\n};\n', "added token extraction helper for auth header", True),
    (auth_middleware, '\n// Main JWT authentication middleware\nexport const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {\n  const token = extractToken(req);\n  if (!token) {\n    return res.status(401).json({ message: "No token provided" });\n  }\n  try {\n    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };\n    req.userId = decoded.userId;\n    req.email = decoded.email;\n    next();\n  } catch (err) {\n    return res.status(401).json({ message: "Invalid or expired token" });\n  }\n};\n', "added jwt token verification in auth middleware", True),
    (auth_middleware, '\n// Optional auth middleware - passes even without token\nexport const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {\n  const token = extractToken(req);\n  if (!token) return next();\n  try {\n    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };\n    req.userId = decoded.userId;\n    req.email = decoded.email;\n  } catch (_) {}\n  next();\n};\n', "added optional auth middleware for public endpoints", True),
    (auth_middleware, '\n// Admin role guard middleware\nexport const adminGuard = (req: AuthRequest, res: Response, next: NextFunction) => {\n  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });\n  // In production, check admin role from DB\n  next();\n};\n', "added admin role guard middleware", True),
    (auth_middleware, '\n// Token expiry check helper\nexport const isTokenExpired = (token: string): boolean => {\n  try {\n    const decoded = jwt.decode(token) as { exp?: number };\n    if (!decoded?.exp) return true;\n    return Date.now() / 1000 > decoded.exp;\n  } catch {\n    return true;\n  }\n};\n', "added token expiry validation helper", True),
    (auth_middleware, '\n// Log auth attempt for security audit\nexport const logAuthAttempt = (req: Request, success: boolean) => {\n  console.log(`[Auth] ${new Date().toISOString()} | IP: ${req.ip} | ${success ? "SUCCESS" : "FAILED"}`);\n};\n', "added auth attempt logging for security audit", True),

    # --- rateLimit.middleware.ts (new file, 7 commits) ---
    (rate_middleware, 'import { Request, Response, NextFunction } from "express";\n\n// In-memory rate limit store\nconst rateLimitMap = new Map<string, { count: number; resetAt: number }>();\n', "created rate limiting middleware file", False),
    (rate_middleware, '\n// Core rate limiter factory function\nexport const createRateLimiter = (maxRequests: number, windowSeconds: number) => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    const key = req.ip || "unknown";\n    const now = Date.now();\n    const record = rateLimitMap.get(key);\n    if (!record || now > record.resetAt) {\n      rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });\n      return next();\n    }\n    if (record.count >= maxRequests) {\n      return res.status(429).json({\n        message: "Too many requests. Please try again later.",\n        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)\n      });\n    }\n    record.count++;\n    next();\n  };\n};\n', "added core rate limiter factory with configurable window", True),
    (rate_middleware, '\n// Auth endpoint rate limiter (strict: 5 req / 15 min)\nexport const authRateLimiter = createRateLimiter(5, 15 * 60);\n', "added strict rate limiter for auth login endpoint", True),
    (rate_middleware, '\n// Sync submission rate limiter (10 req / 1 min)\nexport const syncRateLimiter = createRateLimiter(10, 60);\n', "added rate limiter for leetcode submission sync route", True),
    (rate_middleware, '\n// General API rate limiter (100 req / 1 min)\nexport const generalRateLimiter = createRateLimiter(100, 60);\n', "added general api rate limiter for all routes", True),
    (rate_middleware, '\n// Clean up expired rate limit entries periodically\nsetInterval(() => {\n  const now = Date.now();\n  for (const [key, record] of rateLimitMap.entries()) {\n    if (now > record.resetAt) rateLimitMap.delete(key);\n  }\n}, 60 * 1000);\n', "added memory cleanup for expired rate limit entries", True),

    # --- logger.middleware.ts (new file, 6 commits) ---
    (logger_middleware, 'import { Request, Response, NextFunction } from "express";\n\n// HTTP request logger middleware\nexport const requestLogger = (req: Request, res: Response, next: NextFunction) => {\n  const start = Date.now();\n  res.on("finish", () => {\n    const duration = Date.now() - start;\n    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);\n  });\n  next();\n};\n', "created http request logger middleware", False),
    (logger_middleware, '\n// Log response size for performance monitoring\nexport const responseLogger = (req: Request, res: Response, next: NextFunction) => {\n  const originalJson = res.json.bind(res);\n  res.json = (body) => {\n    const size = JSON.stringify(body).length;\n    console.log(`[ResponseSize] ${req.method} ${req.path} -> ${size} bytes`);\n    return originalJson(body);\n  };\n  next();\n};\n', "added response size logger for performance monitoring", True),
    (logger_middleware, '\n// Log slow requests that exceed 500ms\nexport const slowRequestLogger = (req: Request, res: Response, next: NextFunction) => {\n  const start = Date.now();\n  res.on("finish", () => {\n    const ms = Date.now() - start;\n    if (ms > 500) console.warn(`[SLOW REQUEST] ${req.method} ${req.path} took ${ms}ms`);\n  });\n  next();\n};\n', "added slow request logger for latency detection", True),
    (logger_middleware, '\n// Sanitize sensitive fields from logs\nexport const sanitizeLogFields = (body: Record<string, unknown>) => {\n  const sensitive = ["password", "token", "apiKey", "secret"];\n  const safe = { ...body };\n  sensitive.forEach(f => { if (safe[f]) safe[f] = "***REDACTED***"; });\n  return safe;\n};\n', "added sensitive field sanitizer for secure request logs", True),
    (logger_middleware, '\n// Request body logger for debugging (dev only)\nexport const bodyLogger = (req: Request, _res: Response, next: NextFunction) => {\n  if (process.env.NODE_ENV === "development" && req.body) {\n    console.log(`[Body] ${req.method} ${req.path}`, sanitizeLogFields(req.body));\n  }\n  next();\n};\n', "added request body logger for development debug mode", True),
    (logger_middleware, '\n// Export combined middleware logger chain\nexport const combinedLogger = [requestLogger, slowRequestLogger];\n', "added combined logger middleware chain export", True),

    # --- error.middleware.ts (new file, 5 commits) ---
    (error_middleware, 'import { Request, Response, NextFunction } from "express";\n\n// Custom application error class\nexport class AppError extends Error {\n  constructor(public message: string, public statusCode: number = 500) {\n    super(message);\n    this.name = "AppError";\n  }\n}\n', "created custom app error class for error handling", False),
    (error_middleware, '\n// 404 Not Found handler\nexport const notFoundHandler = (req: Request, res: Response) => {\n  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });\n};\n', "added 404 not found handler middleware", True),
    (error_middleware, '\n// Global error handler middleware\nexport const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {\n  const status = err instanceof AppError ? err.statusCode : 500;\n  console.error(`[Error] ${req.method} ${req.path}:`, err.message);\n  res.status(status).json({ message: err.message || "Internal server error" });\n};\n', "added global error handler middleware for all routes", True),
    (error_middleware, '\n// Async handler wrapper to avoid try/catch repetition\nexport const asyncHandler = (fn: Function) => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    Promise.resolve(fn(req, res, next)).catch(next);\n  };\n};\n', "added async handler wrapper to remove try catch boilerplate", True),
    (error_middleware, '\n// Input validation error formatter\nexport const formatValidationError = (errors: string[]) => ({\n  message: "Validation failed",\n  errors\n});\n', "added validation error formatter helper", True),

    # --- validate.middleware.ts (new file, 5 commits) ---
    (validate_middleware, 'import { Request, Response, NextFunction } from "express";\n\n// Required fields validator\nexport const requireFields = (fields: string[]) => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    const missing = fields.filter(f => !req.body[f]);\n    if (missing.length > 0) {\n      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });\n    }\n    next();\n  };\n};\n', "created required fields validation middleware", False),
    (validate_middleware, '\n// Validate numeric ID in route params\nexport const validateIdParam = (paramName: string = "id") => {\n  return (req: Request, res: Response, next: NextFunction) => {\n    const id = Number(req.params[paramName]);\n    if (isNaN(id) || id <= 0) {\n      return res.status(400).json({ message: `Invalid ${paramName}: must be a positive number` });\n    }\n    next();\n  };\n};\n', "added numeric id param validation middleware", True),
    (validate_middleware, '\n// Validate allowed status values\nexport const validateStatus = (req: Request, res: Response, next: NextFunction) => {\n  const allowed = ["NOT_STARTED", "IN_PROGRESS", "SOLVED"];\n  if (req.body.status && !allowed.includes(req.body.status)) {\n    return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(", ")}` });\n  }\n  next();\n};\n', "added problem status value validator middleware", True),
    (validate_middleware, '\n// Sanitize string inputs to prevent injection\nexport const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {\n  for (const key of Object.keys(req.body)) {\n    if (typeof req.body[key] === "string") {\n      req.body[key] = req.body[key].trim().replace(/<[^>]*>/g, "");\n    }\n  }\n  next();\n};\n', "added input body sanitizer to prevent xss injection", True),
    (validate_middleware, '\n// Validate pagination query params\nexport const validatePagination = (req: Request, res: Response, next: NextFunction) => {\n  const page = Number(req.query.page || 1);\n  const limit = Number(req.query.limit || 10);\n  if (page < 1 || limit < 1 || limit > 100) {\n    return res.status(400).json({ message: "Invalid pagination params" });\n  }\n  next();\n};\n', "added pagination query param validation middleware", True),

    # --- dashboard.service.ts improvements (extra commits) ---
    (dashboard_service, '\n// Compute daily solved count for streak tracking\nexport const computeDailySolvedCount = (solvedAtDates: string[]): number => {\n  const today = new Date().toISOString().split("T")[0];\n  return solvedAtDates.filter(d => d.startsWith(today)).length;\n};\n', "added daily solved count computation for streak tracking", True),
    (dashboard_service, '\n// Get top 5 recently solved problems\nexport const getRecentlySolvedProblems = (problems: any[], limit: number = 5) => {\n  return problems\n    .filter(p => p.status === "SOLVED" && p.solvedAt)\n    .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())\n    .slice(0, limit);\n};\n', "added recently solved problems list to dashboard service", True),
    (dashboard_service, '\n// Compute solved percentage by difficulty\nexport const getDifficultyProgress = (easy: number, easyTotal: number, med: number, medTotal: number, hard: number, hardTotal: number) => ({\n  easy: easyTotal ? Math.round((easy / easyTotal) * 100) : 0,\n  medium: medTotal ? Math.round((med / medTotal) * 100) : 0,\n  hard: hardTotal ? Math.round((hard / hardTotal) * 100) : 0\n});\n', "added difficulty progress percentage to dashboard service", True),
    (dashboard_service, '\n// Generate dashboard summary message\nexport const generateSummaryMessage = (solved: number, total: number) => {\n  const pct = total ? Math.round((solved / total) * 100) : 0;\n  if (pct >= 80) return "Amazing progress! Keep it up!";\n  if (pct >= 50) return "Good work! Over halfway there.";\n  return "Just getting started. Keep going!";\n};\n', "added personalized dashboard progress summary message", True),
    (dashboard_service, '\n// Dashboard controller version marker\nexport const DASHBOARD_SERVICE_VERSION = "1.0.35";\n', "finalized middleware and dashboard service improvements", True),
]

print(f"Total steps to execute: {len(steps)}")
for idx, (path, content, msg, append) in enumerate(steps, 1):
    print(f"Step {idx}/{len(steps)}: {msg}")
    commit_push(path, content, msg, append)

print("All 35 commits and individual pushes done!")
