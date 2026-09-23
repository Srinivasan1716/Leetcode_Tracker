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
