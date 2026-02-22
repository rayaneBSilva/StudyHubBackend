import { Request, Response } from "express";
import { CardService } from "../services/CardService";

export class CardController {
  private service = new CardService();

  /* =========================
     CRIAR CARD
     Aluno → PENDING
     Professor → APPROVED
  ========================== */
  create = async (req: any, res: Response) => {
    try {
      const card = await this.service.createCard(
        {
          ...req.body,
          autor_id: req.user.id,
        },
        req.user.role,
      );

      res.status(201).json({
        success: true,
        data: card,
        message: "Card criado com sucesso",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };

  /* =========================
     PROFESSOR APROVA CARD
  ========================== */
  approve = async (req: any, res: Response) => {
    try {
      const card = await this.service.approveCard(
        Number(req.params.id),
        req.user.id,
      );

      res.json({
        success: true,
        data: card,
        message: "Card aprovado",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };

  /* =========================
     PROFESSOR REJEITA CARD
  ========================== */
  reject = async (req: any, res: Response) => {
    try {
      const { reason } = req.body;

      if (!reason)
        return res.status(400).json({
          success: false,
          message: "Motivo obrigatório",
        });

      const card = await this.service.rejectCard(
        Number(req.params.id),
        req.user.id,
        reason,
      );

      res.json({
        success: true,
        data: card,
        message: "Card rejeitado",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };

  /* =========================
     CARDS PARA ESTUDAR
  ========================== */
  getCardsToStudy = async (req: any, res: Response) => {
    try {
      const deckId = Number(req.params.deckId);

      const cards = await this.service.getCardsToStudy(req.user.id, deckId);

      res.json({
        success: true,
        data: cards,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };

  /* =========================
     REVISAR CARD
     quality: 0 a 5
  ========================== */
  review = async (req: Request, res: Response) => {
    try {
      const { quality } = req.body;

      if (quality === undefined)
        return res.status(400).json({
          success: false,
          message: "Quality obrigatório (0 a 5)",
        });

      const card = await this.service.reviewCard(
        Number(req.params.cardId),
        Number(quality),
      );

      res.json({
        success: true,
        data: card,
        message: "Revisão registrada",
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  };
}
