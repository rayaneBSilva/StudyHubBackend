import { UserService } from "../services/UserService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class UserController extends BaseController<UserService> {
  constructor() {
    super(new UserService());
  }

  create = async (req: Request, res: Response) => {
    try {
      const user = await this.service.createUser(req.body);
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.service.loginUser(email, password);
      res.json({
        success: true,
        data: user,
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: (error as Error).message || "Erro na autenticação",
      });
    }
  };

  getAll = async (
    req: Request & { user?: any },
    res: Response,
  ): Promise<void> => {
    if (req.user?.role !== "teacher") {
      res.status(403).json({
        message: "Apenas professores podem listar usuários",
      });
      return;
    }

    const { name, email, page = "1", limit = "10" } = req.query;

    const users = await this.service.filterUsers(
      {
        name: name as string,
        email: email as string,
      },
      Number(page),
      Number(limit),
    );

    res.json({
      success: true,
      ...users,
    });
  };
}
