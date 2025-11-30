import { BaseRepository } from "./BaseRepository";
import {
  Summary,
  SummaryAttributes,
  SummaryCreationAttributes,
} from "../models/Summary";

export class SummaryRepository extends BaseRepository<
  Summary,
  SummaryAttributes,
  SummaryCreationAttributes
> {
  protected model = Summary;

  async findByDisciplina(disciplina: string) {
    return Summary.findAll({ where: { disciplina } });
  }
}
