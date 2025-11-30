import { BaseService } from "./BaseService";
import { CardRepository } from "../repository/CardRepository";
import { CardAttributes, CardCreationAttributes } from "../models/Card";

export class CardService extends BaseService<
  CardRepository,
  CardAttributes,
  CardCreationAttributes
> {
  constructor() {
    super(new CardRepository());
  }

  async createCard(data: CardCreationAttributes) {
    if (!data.titulo?.trim()) throw new Error("Título é obrigatório");
    if (!data.conteudo?.trim()) throw new Error("Conteúdo é obrigatório");
    if (!data.disciplina?.trim()) throw new Error("Disciplina é obrigatória");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    return this.create(data);
  }

  async getCardsByDisciplina(disciplina: string) {
    try {
      return await this.repository.findByDisciplina(disciplina);
    } catch {
      throw new Error("Erro ao buscar cards por disciplina");
    }
  }

  async getCardsByAutor(autor_id: number) {
    try {
      return await this.repository.findByAutor(autor_id);
    } catch {
      throw new Error("Erro ao buscar cards do autor");
    }
  }
}
