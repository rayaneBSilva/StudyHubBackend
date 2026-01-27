import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token não informado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};
