import { BaseRepository } from "./BaseRepository";
import { Card, CardAttributes, CardCreationAttributes } from "../models/Card";
import { Op } from "sequelize";

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

  async findPaginatedAndFiltered(
    filters: {
      titulo?: string;
      disciplina?: string;
      autor_id?: number;
    },
    page: number,
    limit: number,
  ) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Card.findAndCountAll({
      where: {
        ...(filters.titulo && {
          titulo: { [Op.like]: `%${filters.titulo}%` },
        }),
        ...(filters.disciplina && {
          disciplina: filters.disciplina,
        }),
        ...(filters.autor_id && {
          autor_id: filters.autor_id,
        }),
      },
      limit,
      offset,
    });

    return { data: rows, total: count };
  }

  findPending() {
    return Card.findAll({ where: { status: "PENDING" } });
  }

  findApproved(filters: any) {
    return Card.findAll({
      where: {
        status: "APPROVED",
        ...(filters.disciplina && { disciplina: filters.disciplina }),
      },
    });
  }
}
