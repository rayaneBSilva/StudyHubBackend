import { Request, Response } from "express";
import { DeckService } from "../services/DeckService";

export class DeckController {
  private service = new DeckService();

  create = async (req: any, res: Response) => {
    try {
      const deck = await this.service.createDeck({
        ...req.body,
        autor_id: req.user.id,
      });

      res.status(201).json({ success: true, data: deck });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    const { page, limit, nome } = req.query;
    const decks = await this.service.getAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      nome: nome ? String(nome) : undefined,
    });

    res.json({
      success: true,
      data: decks.rows,
      total: decks.count,
      page: page ? Number(page) : 1,
      totalPages: Math.ceil(decks.count / (limit ? Number(limit) : 10)),
    });
  };

  getById = async (req: Request, res: Response) => {
    try {
      const deck = await this.service.getDeckById(Number(req.params.id));
      res.json({ success: true, data: deck });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const deck = await this.service.updateDeck(
        Number(req.params.id),
        req.body,
      );
      res.json({ success: true, data: deck });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteDeck(Number(req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  };
}
