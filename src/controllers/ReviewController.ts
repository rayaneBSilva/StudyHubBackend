import { Request, Response } from "express";
import { CardService } from "../services/CardService";

export class ReviewController {
  private service = new CardService();

  listPending = async (_req: Request, res: Response) => {
    const cards = await this.service.listPending();
    res.json({ success: true, data: cards });
  };

  approve = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const { comment = null } = req.body || {};

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

    if (!reason)
      return res.status(400).json({ message: "Motivo é obrigatório" });

    const card = await this.service.rejectCard(Number(id), req.user.id, reason);

    res.json({ success: true, data: card });
  };
}
