import { SummaryRepository } from "../repository/SummaryRepository";

export class SummaryService {
  private summaryRepository = new SummaryRepository();

  async getAllSummaries() {
    return await this.summaryRepository.findAll();
  }

  async getSummaryById(id: number) {
    const summary = await this.summaryRepository.findById(id);
    if (!summary) throw new Error("Resumo não encontrado");
    return summary;
  }

  async getSummariesByDisciplina(disciplina: string) {
    return await this.summaryRepository.findByDisciplina(disciplina);
  }

  async createSummary(data: any) {
    if (!data.titulo) throw new Error("Título é obrigatório");
    if (!data.conteudo) throw new Error("Conteúdo é obrigatório");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    return await this.summaryRepository.create(data);
  }

  async updateSummary(id: number, data: any) {
    const updated = await this.summaryRepository.update(id, data);
    if (!updated) throw new Error("Resumo não encontrado");
    return updated;
  }

  async deleteSummary(id: number) {
    const deleted = await this.summaryRepository.delete(id);
    if (!deleted) throw new Error("Resumo não encontrado");
    return { message: "Resumo excluído com sucesso" };
  }
}
