import { CardService } from "../services/CardService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class CardController extends BaseController<CardService> {
  constructor() {
    super(new CardService());
  }

  create = async (req: Request & { user?: any }, res: Response) => {
    try {
      const card = await this.service.createCard(
        { ...req.body, autor_id: req.user.id },
        req.user.role,
      );

      res.status(201).json({
        success: true,
        data: card,
        message: "Card criado com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };

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

  listPending = async (_: Request, res: Response) => {
    const cards = await this.service.listPending();
    res.json({ success: true, data: cards });
  };

  approve = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const { comment } = req.body;

    const card = await this.service.approveCard(
      Number(id),
      req.user.id,
      comment,
    );

    res.json({ success: true, data: card });
  };

  reject = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Motivo obrigatório" });
    }

    const card = await this.service.rejectCard(Number(id), req.user.id, reason);

    res.json({ success: true, data: card });
  };
}
