import { Deck } from "../models/Deck";

export class DeckRepository {
  async create(data: any) {
    return Deck.create(data);
  }

  async findById(id: number) {
    return Deck.findByPk(id);
  }

  async findAll() {
    return Deck.findAll();
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
