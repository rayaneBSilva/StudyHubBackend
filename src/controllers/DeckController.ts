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

  getAll = async (_: Request, res: Response) => {
    const decks = await this.service.getAll();
    res.json({ success: true, data: decks });
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
    const deck = await this.service.updateDeck(Number(req.params.id), req.body);
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
