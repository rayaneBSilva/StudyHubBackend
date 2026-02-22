import { Card } from "../models/Card";
import { DeckRepository } from "../repository/DeckRepository";
import { Op } from "sequelize";

export class CardService {
  private deckRepository = new DeckRepository();

  /* =========================
     CRIAR CARD
  ========================== */
  async createCard(data: any, role: string) {
    if (!data.frente?.trim()) throw new Error("Frente obrigatória");
    if (!data.verso?.trim()) throw new Error("Verso obrigatório");
    if (!data.deck_id) throw new Error("Deck obrigatório");

    const deck = await this.deckRepository.findById(data.deck_id);
    if (!deck) throw new Error("Deck não existe");

    const status = role === "teacher" ? "APPROVED" : "PENDING";

    return Card.create({
      ...data,
      status,

      repetitions: 0,
      interval: 1,
      ease_factor: 2.5,
      next_review: new Date(), // 👈 ISSO AQUI É O MAIS IMPORTANTE
    });
  }

  /* =========================
     APROVAR CARD
  ========================== */
  async approveCard(cardId: number, teacherId: number) {
    const card = await Card.findByPk(cardId);
    if (!card) throw new Error("Card não encontrado");

    card.status = "APPROVED";
    card.reviewed_by = teacherId;
    card.review_reason = null as any;

    if (!card.next_review) {
      card.repetitions = 0;
      card.interval = 1;
      card.ease_factor = 2.5;
      card.next_review = new Date();
    }

    await card.save();
    return card;
  }

  /* =========================
     REJEITAR CARD
  ========================== */
  async rejectCard(cardId: number, teacherId: number, reason: string) {
    if (!reason?.trim()) throw new Error("Motivo obrigatório");

    const card = await Card.findByPk(cardId);
    if (!card) throw new Error("Card não encontrado");

    card.status = "REJECTED";
    card.reviewed_by = teacherId;
    card.review_reason = reason;

    await card.save();
    return card;
  }

  /* =========================
     CARDS PARA ESTUDAR
  ========================== */
  async getCardsToStudy(userId: number, deckId: number) {
    return Card.findAll({
      where: {
        autor_id: userId,
        deck_id: deckId,
        status: "APPROVED",
        next_review: {
          [Op.lte]: new Date(),
        },
      },
      order: [["next_review", "ASC"]],
    });
  }

  /* =========================
     REVISAR CARD (SM-2)
  ========================== */
  async reviewCard(cardId: number, quality: number) {
    const card = await Card.findByPk(cardId);
    if (!card) throw new Error("Card não encontrado");

    if (quality < 0 || quality > 5)
      throw new Error("Qualidade deve ser entre 0 e 5");

    this.calculateSM2(card, quality);

    await card.save();
    return card;
  }

  /* =========================
     SM-2
  ========================== */
  private calculateSM2(card: any, quality: number) {
    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
    } else {
      card.repetitions += 1;

      if (card.repetitions === 1) card.interval = 1;
      else if (card.repetitions === 2) card.interval = 6;
      else card.interval = Math.round(card.interval * card.ease_factor);
    }

    card.ease_factor =
      card.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    if (card.ease_factor < 1.3) card.ease_factor = 1.3;

    card.next_review = new Date(
      Date.now() + card.interval * 24 * 60 * 60 * 1000,
    );
  }
}
