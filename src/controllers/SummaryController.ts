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
}
