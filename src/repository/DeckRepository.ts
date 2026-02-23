import { Deck } from "../models/Deck";
import { Op } from "sequelize";

export class DeckRepository {
  async create(data: any) {
    return Deck.create(data);
  }

  async findById(id: number) {
    return Deck.findByPk(id);
  }

  async findAll({
    page = 1,
    limit = 10,
    nome,
  }: {
    page?: number;
    limit?: number;
    nome?: string;
  }) {
    const offset = (page - 1) * limit;

    const where: any = {};
    if (nome) {
      where.nome = { [Op.like]: `%${nome}%` };
    }

    return Deck.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });
  }

  async update(id: number, data: any) {
    const deck = await this.findById(id);
    if (!deck) throw new Error("Deck não encontrado");
    return deck.update(data);
  }

  async delete(id: number) {
    const deck = await this.findById(id);
    if (!deck) throw new Error("Deck não encontrado");
    return deck.destroy();
  }
}
