import { Request, Response, NextFunction } from "express";

export const onlyTeacher = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  if (req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Acesso permitido apenas para professores" });
  }
  next();
};
