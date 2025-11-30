import { BaseRepository } from "./BaseRepository";
import { Card, CardAttributes, CardCreationAttributes } from "../models/Card";

export class CardRepository extends BaseRepository<
  Card,
  CardAttributes,
  CardCreationAttributes
> {
  protected model = Card;

  async findByDisciplina(disciplina: string): Promise<Card[]> {
    return Card.findAll({ where: { disciplina } });
  }

  async findByAutor(autor_id: number): Promise<Card[]> {
    return Card.findAll({ where: { autor_id } });
  }
}
