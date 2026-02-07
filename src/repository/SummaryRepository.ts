import { BaseRepository } from "./BaseRepository";
import {
  Summary,
  SummaryAttributes,
  SummaryCreationAttributes,
} from "../models/Summary";
import { Op } from "sequelize";

export class SummaryRepository extends BaseRepository<
  Summary,
  SummaryAttributes,
  SummaryCreationAttributes
> {
  protected model = Summary;

  async findByDisciplina(disciplina: string) {
    return Summary.findAll({ where: { disciplina } });
  }

  async findPaginatedAndFiltered(
    filters: { titulo?: string; disciplina?: string },
    page: number,
    limit: number,
  ) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Summary.findAndCountAll({
      where: {
        ...(filters.titulo && {
          titulo: { [Op.like]: `%${filters.titulo}%` },
        }),
        ...(filters.disciplina && {
          disciplina: filters.disciplina,
        }),
      },
      limit,
      offset,
    });

    return { data: rows, total: count };
  }
}
