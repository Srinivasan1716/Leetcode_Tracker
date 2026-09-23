import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generate a signed JWT for a user
export const generateAccessToken = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, SECRET, { expiresIn: EXPIRES_IN });
};
