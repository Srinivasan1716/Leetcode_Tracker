import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "leetcode_tracker_secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
