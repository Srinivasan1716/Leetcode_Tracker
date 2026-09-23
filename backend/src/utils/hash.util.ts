import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Hash a plain text password securely
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};
