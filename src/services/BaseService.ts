export class BaseService<
  R extends { findAllPaginated: Function },
  Attr,
  CreateAttr = Attr,
> {
  protected repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async getAllPaginated(page = 1, limit = 10) {
    return this.repository.findAllPaginated(page, limit);
  }

  async getById(id: number): Promise<Attr> {
    // @ts-ignore
    const entity = await this.repository.findById(id);
    if (!entity) throw new Error("Registro não encontrado");
    return entity;
  }

  async create(data: CreateAttr): Promise<Attr> {
    // @ts-ignore
    return await this.repository.create(data);
  }

  async update(id: number, data: Partial<Attr>): Promise<Attr> {
    // @ts-ignore
    const updated = await this.repository.update(id, data);
    if (!updated) throw new Error("Registro não encontrado para atualização");
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    // @ts-ignore
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error("Registro não encontrado para exclusão");
    return { message: "Registro excluído com sucesso" };
  }
}
