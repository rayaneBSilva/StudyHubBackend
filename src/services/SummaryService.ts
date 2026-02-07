import { BaseService } from "./BaseService";
import { SummaryRepository } from "../repository/SummaryRepository";
import {
  SummaryAttributes,
  SummaryCreationAttributes,
} from "../models/Summary";

export class SummaryService extends BaseService<
  SummaryRepository,
  SummaryAttributes,
  SummaryCreationAttributes
> {
  constructor() {
    super(new SummaryRepository());
  }

  async createSummary(data: SummaryCreationAttributes) {
    if (!data.titulo?.trim()) throw new Error("Título é obrigatório");
    if (!data.conteudo?.trim()) throw new Error("Conteúdo é obrigatório");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    return this.create(data);
  }

  async getSummariesByDisciplina(disciplina: string) {
    return this.repository.findByDisciplina(disciplina);
  }

  async getAllFiltered(filters: any, page: number, limit: number) {
    return this.repository.findPaginatedAndFiltered(filters, page, limit);
  }
}
