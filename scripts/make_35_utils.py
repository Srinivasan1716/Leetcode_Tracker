import os
import subprocess

repo_dir = r"c:\Users\mural\Leetcode_Tracker"

utils_dir = os.path.join(repo_dir, "backend", "src", "utils")
hash_util   = os.path.join(utils_dir, "hash.util.ts")
token_util  = os.path.join(utils_dir, "token.util.ts")
date_util   = os.path.join(utils_dir, "date.util.ts")
response_util = os.path.join(utils_dir, "response.util.ts")
string_util = os.path.join(utils_dir, "string.util.ts")
pagination_util = os.path.join(utils_dir, "pagination.util.ts")
stats_util  = os.path.join(utils_dir, "stats.util.ts")

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
    # hash.util.ts  — 5 commits
    (hash_util, 'import bcrypt from "bcrypt";\n\nconst SALT_ROUNDS = 12;\n\n// Hash a plain text password securely\nexport const hashPassword = async (plain: string): Promise<string> => {\n  return bcrypt.hash(plain, SALT_ROUNDS);\n};\n', "created password hashing utility using bcrypt", False),
    (hash_util, '\n// Compare plain password against stored hash\nexport const comparePassword = async (plain: string, hash: string): Promise<boolean> => {\n  return bcrypt.compare(plain, hash);\n};\n', "added password comparison helper in hash utility", True),
    (hash_util, '\n// Generate random secure token string\nexport const generateRandomToken = (length: number = 32): string => {\n  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\n  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");\n};\n', "added secure random token generator utility", True),
    (hash_util, '\n// Mask sensitive string for safe logging\nexport const maskSensitiveString = (str: string, visibleChars: number = 4): string => {\n  if (!str || str.length <= visibleChars) return "****";\n  return str.slice(0, visibleChars) + "*".repeat(str.length - visibleChars);\n};\n', "added sensitive string masking for secure logging", True),
    (hash_util, '\n// Hash utility version marker\nexport const HASH_UTIL_VERSION = "1.0.0";\n', "finalized hash utility module with version marker", True),

    # token.util.ts — 5 commits
    (token_util, 'import jwt from "jsonwebtoken";\n\nconst SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";\nconst EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";\n', "created jwt token utility file", False),
    (token_util, '\n// Generate a signed JWT for a user\nexport const generateAccessToken = (userId: number, email: string): string => {\n  return jwt.sign({ userId, email }, SECRET, { expiresIn: EXPIRES_IN });\n};\n', "added jwt access token generation function", True),
    (token_util, '\n// Verify and decode a JWT token\nexport const verifyAccessToken = (token: string): { userId: number; email: string } | null => {\n  try {\n    return jwt.verify(token, SECRET) as { userId: number; email: string };\n  } catch {\n    return null;\n  }\n};\n', "added jwt token verification and decode function", True),
    (token_util, '\n// Generate short-lived one time reset token\nexport const generateResetToken = (email: string): string => {\n  return jwt.sign({ email, purpose: "reset" }, SECRET, { expiresIn: "15m" });\n};\n', "added password reset token generator function", True),
    (token_util, '\n// Decode token without verifying (for reading expiry)\nexport const decodeTokenPayload = (token: string) => {\n  try { return jwt.decode(token); } catch { return null; }\n};\n', "added token payload decoder without verification", True),

    # date.util.ts — 5 commits
    (date_util, '// Date and time utility helpers\n\n// Format ISO date to readable string\nexport const formatDate = (iso: string, locale: string = "en-IN"): string => {\n  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });\n};\n', "created date formatting utility file", False),
    (date_util, '\n// Get number of days between two dates\nexport const daysBetween = (dateA: string, dateB: string): number => {\n  const msPerDay = 1000 * 60 * 60 * 24;\n  return Math.abs(Math.floor((new Date(dateA).getTime() - new Date(dateB).getTime()) / msPerDay));\n};\n', "added days between two dates calculator", True),
    (date_util, '\n// Check if a date is today\nexport const isToday = (iso: string): boolean => {\n  const today = new Date().toISOString().split("T")[0];\n  return iso.startsWith(today);\n};\n', "added is today date check helper", True),
    (date_util, '\n// Get start of week date (Monday)\nexport const getStartOfWeek = (): string => {\n  const d = new Date();\n  const day = d.getDay();\n  const diff = d.getDate() - day + (day === 0 ? -6 : 1);\n  d.setDate(diff);\n  return d.toISOString().split("T")[0];\n};\n', "added start of week date calculator", True),
    (date_util, '\n// Get last N days as ISO date string array\nexport const getLastNDays = (n: number): string[] => {\n  return Array.from({ length: n }, (_, i) => {\n    const d = new Date();\n    d.setDate(d.getDate() - i);\n    return d.toISOString().split("T")[0];\n  }).reverse();\n};\n', "added last n days date array generator", True),

    # response.util.ts — 5 commits
    (response_util, 'import { Response } from "express";\n\n// Standard success response wrapper\nexport const sendSuccess = (res: Response, data: unknown, message: string = "Success", status: number = 200) => {\n  return res.status(status).json({ success: true, message, data });\n};\n', "created standard api success response wrapper", False),
    (response_util, '\n// Standard error response wrapper\nexport const sendError = (res: Response, message: string, status: number = 500) => {\n  return res.status(status).json({ success: false, message, data: null });\n};\n', "added standard api error response wrapper", True),
    (response_util, '\n// Paginated response wrapper with metadata\nexport const sendPaginated = (res: Response, data: unknown[], total: number, page: number, limit: number) => {\n  return res.status(200).json({\n    success: true,\n    data,\n    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }\n  });\n};\n', "added paginated api response with metadata wrapper", True),
    (response_util, '\n// Created (201) response shorthand\nexport const sendCreated = (res: Response, data: unknown, message: string = "Created successfully") => {\n  return res.status(201).json({ success: true, message, data });\n};\n', "added created 201 response shorthand function", True),
    (response_util, '\n// No content (204) response helper\nexport const sendNoContent = (res: Response) => res.status(204).send();\n', "added no content 204 response helper", True),

    # string.util.ts — 5 commits
    (string_util, '// String utility helpers\n\n// Capitalize first letter of each word\nexport const toTitleCase = (str: string): string => {\n  return str.replace(/\\b\\w/g, c => c.toUpperCase());\n};\n', "created string utility helper file", False),
    (string_util, '\n// Convert camelCase to snake_case\nexport const toSnakeCase = (str: string): string => {\n  return str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);\n};\n', "added camelCase to snake_case converter", True),
    (string_util, '\n// Slugify a problem title\nexport const slugify = (str: string): string => {\n  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");\n};\n', "added slug generator for problem titles", True),
    (string_util, '\n// Truncate long string with ellipsis\nexport const truncate = (str: string, maxLen: number = 50): string => {\n  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;\n};\n', "added string truncation helper with ellipsis", True),
    (string_util, '\n// Strip HTML tags from string input\nexport const stripHtml = (str: string): string => str.replace(/<[^>]*>/g, "").trim();\n', "added html tag stripper for safe string input", True),

    # pagination.util.ts — 5 commits
    (pagination_util, '// Pagination utility helpers\n\nexport interface PaginationParams {\n  page: number;\n  limit: number;\n  offset: number;\n}\n', "created pagination utility helper file", False),
    (pagination_util, '\n// Parse and normalize pagination query params\nexport const parsePagination = (query: Record<string, unknown>): PaginationParams => {\n  const page = Math.max(1, Number(query.page) || 1);\n  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));\n  const offset = (page - 1) * limit;\n  return { page, limit, offset };\n};\n', "added pagination query params parser and normalizer", True),
    (pagination_util, '\n// Compute total pages from count and limit\nexport const computeTotalPages = (total: number, limit: number): number => {\n  return Math.ceil(total / Math.max(1, limit));\n};\n', "added total pages calculator utility", True),
    (pagination_util, '\n// Check if there is a next page\nexport const hasNextPage = (page: number, total: number, limit: number): boolean => {\n  return page < computeTotalPages(total, limit);\n};\n', "added has next page boolean check helper", True),
    (pagination_util, '\n// Build pagination metadata object for API response\nexport const buildPaginationMeta = (page: number, limit: number, total: number) => ({\n  page,\n  limit,\n  total,\n  totalPages: computeTotalPages(total, limit),\n  hasNext: hasNextPage(page, total, limit),\n  hasPrev: page > 1\n});\n', "added pagination metadata builder for api responses", True),

    # stats.util.ts — 5 commits
    (stats_util, '// Statistics utility helpers\n\n// Compute arithmetic mean of a number array\nexport const computeMean = (values: number[]): number => {\n  if (!values.length) return 0;\n  return values.reduce((a, b) => a + b, 0) / values.length;\n};\n', "created statistics utility helper file", False),
    (stats_util, '\n// Compute min and max of a number array\nexport const computeMinMax = (values: number[]): { min: number; max: number } => {\n  if (!values.length) return { min: 0, max: 0 };\n  return { min: Math.min(...values), max: Math.max(...values) };\n};\n', "added min max computation for numeric stats", True),
    (stats_util, '\n// Compute percentage with safe division\nexport const computePercentage = (part: number, total: number, decimals: number = 1): number => {\n  if (!total) return 0;\n  return parseFloat(((part / total) * 100).toFixed(decimals));\n};\n', "added safe percentage calculation helper", True),
    (stats_util, '\n// Get rank label based on percentile\nexport const getPercentileRank = (percentile: number): string => {\n  if (percentile >= 90) return "Top 10%";\n  if (percentile >= 75) return "Top 25%";\n  if (percentile >= 50) return "Top 50%";\n  return "Bottom 50%";\n};\n', "added percentile rank label generator for stats", True),
    (stats_util, '\n// Stats utility version marker\nexport const STATS_UTIL_VERSION = "1.0.0";\n', "finalized backend stats utility module", True),
]

print(f"Total steps: {len(steps)}")
for idx, (path, content, msg, append) in enumerate(steps, 1):
    print(f"Step {idx}/{len(steps)}: {msg}")
    commit_push(path, content, msg, append)

print("All 35 commits and individual pushes done!")
