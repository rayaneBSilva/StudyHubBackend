import { DeckRepository } from "../repository/DeckRepository";

export class DeckService {
  private repository = new DeckRepository();

  async createDeck(data: any) {
    if (!data.nome?.trim()) throw new Error("Nome obrigatório");
    if (!data.autor_id) throw new Error("Autor obrigatório");

    return this.repository.create(data);
  }

  async getDeckById(id: number) {
    const deck = await this.repository.findById(id);
    if (!deck) throw new Error("Deck não encontrado");
    return deck;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async updateDeck(id: number, data: any) {
    return this.repository.update(id, data);
  }

  async deleteDeck(id: number) {
    return this.repository.delete(id);
  }
}
