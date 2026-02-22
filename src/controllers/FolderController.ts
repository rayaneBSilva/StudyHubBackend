import { FolderService } from "../services/FolderService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class FolderController extends BaseController<FolderService> {
  constructor() {
    super(new FolderService());
  }

  create = async (req: any, res: Response) => {
    try {
      const folder = await this.service.createFolder({
        ...req.body,
        autor_id: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: folder,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };

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
