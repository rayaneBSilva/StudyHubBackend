import { BaseRepository } from "./BaseRepository";
import { Card, CardAttributes, CardCreationAttributes } from "../models/Card";
import { Op } from "sequelize";

export class CardRepository extends BaseRepository<
  Card,
  CardAttributes,
  CardCreationAttributes
> {
  protected model = Card;

  async findByAutor(autor_id: number): Promise<Card[]> {
    return this.model.findAll({ where: { autor_id } });
  }

  async findByDeck(deck_id: number): Promise<Card[]> {
    return this.model.findAll({ where: { deck_id } });
  }

  async findPending(): Promise<Card[]> {
    return this.model.findAll({
      where: { status: "PENDING" },
    });
  }

  async findApprovedByDeck(deck_id: number): Promise<Card[]> {
    return this.model.findAll({
      where: {
        deck_id,
        status: "APPROVED",
      },
    });
  }

  async findCardsToStudy(userId: number, deckId: number) {
    return this.model.findAll({
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

  async findPaginatedByDeck(deck_id: number, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.model.findAndCountAll({
      where: { deck_id },
      limit,
      offset,
    });

    return { data: rows, total: count };
  }
}
