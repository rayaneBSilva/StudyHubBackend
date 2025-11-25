import {
  Summary,
  SummaryAttributes,
  SummaryCreationAttributes,
} from "../models/Summary";

export class SummaryRepository {
  async findAll() {
    return await Summary.findAll();
  }

  async findById(id: number) {
    return await Summary.findByPk(id);
  }

  async findByDisciplina(disciplina: string) {
    return await Summary.findAll({ where: { disciplina } });
  }

  async create(data: SummaryCreationAttributes) {
    return await Summary.create(data);
  }

  async update(id: number, data: Partial<SummaryAttributes>) {
    const [updated] = await Summary.update(data, { where: { id } });
    if (updated === 0) return null;
    return await this.findById(id);
  }

  async delete(id: number) {
    const deleted = await Summary.destroy({ where: { id } });
    return deleted > 0;
  }
}
