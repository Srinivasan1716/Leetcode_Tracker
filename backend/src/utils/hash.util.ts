import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Hash a plain text password securely
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

// Compare plain password against stored hash
export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

// Generate random secure token string
export const generateRandomToken = (length: number = 32): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Mask sensitive string for safe logging
export const maskSensitiveString = (str: string, visibleChars: number = 4): string => {
  if (!str || str.length <= visibleChars) return "****";
  return str.slice(0, visibleChars) + "*".repeat(str.length - visibleChars);
};

// Hash utility version marker
export const HASH_UTIL_VERSION = "1.0.0";
