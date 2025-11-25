import { Card, CardAttributes, CardCreationAttributes } from "../models/Card";

export class CardRepository {
  async findAll(): Promise<Card[]> {
    return Card.findAll();
  }

  async findById(id: number): Promise<Card | null> {
    return Card.findByPk(id);
  }

  async findByDisciplina(disciplina: string): Promise<Card[]> {
    return Card.findAll({ where: { disciplina } });
  }

  async findByAutor(autor_id: number): Promise<Card[]> {
    return Card.findAll({ where: { autor_id } });
  }

  async create(data: CardCreationAttributes): Promise<Card> {
    return Card.create(data);
  }

  async update(
    id: number,
    data: Partial<CardAttributes>
  ): Promise<Card | null> {
    const [rows] = await Card.update(data, { where: { id } });
    return rows > 0 ? this.findById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await Card.destroy({ where: { id } });
    return rows > 0;
  }
}
