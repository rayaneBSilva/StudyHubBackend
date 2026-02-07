import { CardService } from "../services/CardService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class CardController extends BaseController<CardService> {
  constructor() {
    super(new CardService());
  }

  getCardsByDisciplina = async (req: Request, res: Response) => {
    try {
      const disciplinaParam = req.params.disciplina;

      if (!disciplinaParam || Array.isArray(disciplinaParam)) {
        return res.status(400).json({
          success: false,
          message: "Disciplina inválida",
        });
      }

      const cards = await this.service.getCardsByDisciplina(disciplinaParam);

      res.json({
        success: true,
        data: cards,
        message: `Cards da disciplina ${disciplinaParam} listados com sucesso`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Erro interno",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const titulo =
      typeof req.query.titulo === "string" ? req.query.titulo : undefined;

    const disciplina =
      typeof req.query.disciplina === "string"
        ? req.query.disciplina
        : undefined;

    const autor_id =
      typeof req.query.autor_id === "string"
        ? Number(req.query.autor_id)
        : undefined;

    const result = await this.service.getAllFiltered(
      {
        titulo,
        disciplina,
        autor_id,
      },
      page,
      limit,
    );

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  };
}
