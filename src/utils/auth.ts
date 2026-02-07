import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

// Criptografar senha
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Comparar senha
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

// Gerar token
// src/utils/auth.ts
export const generateToken = (user: {
  id: number;
  email: string;
  role: string;
}) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" },
  );
};

// Validar token
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
