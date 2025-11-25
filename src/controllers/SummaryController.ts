import { Request, Response } from "express";
import { SummaryService } from "../services/SummaryService";

export class SummaryController {
  private summaryService = new SummaryService();

  getAllSummaries = async (req: Request, res: Response) => {
    try {
      const data = await this.summaryService.getAllSummaries();
      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ success: false, message: "Erro interno" });
    }
  };

  getSummaryById = async (req: Request, res: Response) => {
    try {
      const data = await this.summaryService.getSummaryById(
        Number(req.params.id)
      );
      res.json({ success: true, data });
    } catch (e) {
      res
        .status(404)
        .json({ success: false, message: "Resumo não encontrado" });
    }
  };

  createSummary = async (req: Request, res: Response) => {
    try {
      const data = await this.summaryService.createSummary(req.body);
      res.status(201).json({ success: true, data });
    } catch (e) {
      res
        .status(400)
        .json({
          success: false,
          message: e instanceof Error ? e.message : "Erro interno",
        });
    }
  };

  updateSummary = async (req: Request, res: Response) => {
    try {
      const data = await this.summaryService.updateSummary(
        Number(req.params.id),
        req.body
      );
      res.json({ success: true, data });
    } catch (e) {
      res
        .status(400)
        .json({
          success: false,
          message: e instanceof Error ? e.message : "Erro interno",
        });
    }
  };

  deleteSummary = async (req: Request, res: Response) => {
    try {
      const data = await this.summaryService.deleteSummary(
        Number(req.params.id)
      );
      res.json({ success: true, data });
    } catch (e) {
      res.status(500).json({ success: false, message: "Erro interno" });
    }
  };
}
