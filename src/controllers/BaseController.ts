import { Request, Response } from "express";

export abstract class BaseController<S, CreateDto = any, UpdateDto = any> {
  protected service: S;

  constructor(service: S) {
    this.service = service;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const data = await this.service.getAll();
      res.json({
        success: true,
        data,
        message: "Listagem realizada com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Erro interno",
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const data = await this.service.getById(Number(id));
      res.json({
        success: true,
        data,
        message: "Registro encontrado com sucesso",
      });
    } catch (error) {
      const statusCode = (error as Error).message.includes("não encontrado")
        ? 404
        : 500;
      res
        .status(statusCode)
        .json({ success: false, message: (error as Error).message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const dto: CreateDto = req.body;
      // @ts-ignore
      const data = await this.service.create(dto);
      res
        .status(201)
        .json({ success: true, data, message: "Registro criado com sucesso" });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto: UpdateDto = req.body;
      // @ts-ignore
      const data = await this.service.update(Number(id), dto);
      res.json({
        success: true,
        data,
        message: "Registro atualizado com sucesso",
      });
    } catch (error) {
      const statusCode = (error as Error).message.includes("não encontrado")
        ? 404
        : 400;
      res
        .status(statusCode)
        .json({ success: false, message: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore
      const data = await this.service.delete(Number(id));
      res.json({
        success: true,
        data,
        message: "Registro excluído com sucesso",
      });
    } catch (error) {
      const statusCode = (error as Error).message.includes("não encontrado")
        ? 404
        : 500;
      res
        .status(statusCode)
        .json({ success: false, message: (error as Error).message });
    }
  };
}
