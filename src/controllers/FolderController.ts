import { FolderService } from "../services/FolderService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class FolderController extends BaseController<FolderService> {
  constructor() {
    super(new FolderService());
  }

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { nome, autor_id } = req.query;

    const result = await this.service.getAllFiltered(
      {
        nome,
        autor_id: autor_id ? Number(autor_id) : undefined,
      },
      page,
      limit,
    );

    res.json({
      success: true,
      ...result,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  };
}
