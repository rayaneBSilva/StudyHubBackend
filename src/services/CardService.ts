import { BaseService } from "./BaseService";
import { CardRepository } from "../repository/CardRepository";
import { FolderRepository } from "../repository/FolderRepository";
import { CardAttributes, CardCreationAttributes } from "../models/Card";

export class CardService extends BaseService<
  CardRepository,
  CardAttributes,
  CardCreationAttributes
> {
  private folderRepository: FolderRepository;

  constructor() {
    super(new CardRepository());
    this.folderRepository = new FolderRepository(); // para validar disciplinas
  }

  async createCard(data: CardCreationAttributes, userRole: string) {
    if (!data.titulo?.trim()) throw new Error("Título é obrigatório");
    if (!data.conteudo?.trim()) throw new Error("Conteúdo é obrigatório");
    if (!data.disciplina?.trim()) throw new Error("Disciplina é obrigatória");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    const status = userRole === "teacher" ? "APPROVED" : "PENDING";

    return this.create({ ...data, status });
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

  async getAllFiltered(filters: any, page: number, limit: number) {
    return this.repository.findPaginatedAndFiltered(filters, page, limit);
  }

  async listPending() {
    try {
      return await this.repository.findPending();
    } catch {
      throw new Error("Erro ao buscar cards pendentes");
    }
  }

  async approveCard(id: number, teacherId: number, comment?: string) {
    try {
      return await this.repository.update(id, {
        status: "APPROVED",
        reviewed_by: teacherId,
        review_reason: comment || undefined, // undefined em vez de null para evitar TS
      });
    } catch {
      throw new Error("Erro ao aprovar card");
    }
  }

  async rejectCard(id: number, teacherId: number, reason: string) {
    if (!reason?.trim()) throw new Error("Motivo de rejeição é obrigatório");

    try {
      return await this.repository.update(id, {
        status: "REJECTED",
        reviewed_by: teacherId,
        review_reason: reason,
      });
    } catch {
      throw new Error("Erro ao rejeitar card");
    }
  }

  async listApproved(filters?: any) {
    try {
      return await this.repository.findApproved(filters || {});
    } catch {
      throw new Error("Erro ao buscar cards aprovados");
    }
  }
}
