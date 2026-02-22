import { SummaryService } from "../services/SummaryService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class SummaryController extends BaseController<SummaryService> {
  constructor() {
    super(new SummaryService());
  }

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { titulo, disciplina } = req.query;

    const result = await this.service.getAllFiltered(
      { titulo, disciplina },
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

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "ID inválido" });
      return;
    }

    try {
      const summary = await this.service.getById(id);

      if (!summary) {
        res.status(404).json({
          success: false,
          message: "Resumo não encontrado",
        });
        return;
      }

      res.json({ success: true, data: summary });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await this.service.update(
        Number(req.params.id),
        req.body,
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          message: "Resumo não encontrado",
        });
        return;
      }

      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.service.delete(Number(req.params.id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Resumo não encontrado",
        });
        return;
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  };
}
