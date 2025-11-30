import { CardService } from "../services/CardService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";

export class CardController extends BaseController<CardService> {
  constructor() {
    super(new CardService());
  }

  getCardsByDisciplina = async (req: Request, res: Response) => {
    try {
      const { disciplina } = req.params;
      const cards = await this.service.getCardsByDisciplina(disciplina);
      res.json({
        success: true,
        data: cards,
        message: `Cards da disciplina ${disciplina} listados com sucesso`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Erro interno",
      });
    }
  };
}
