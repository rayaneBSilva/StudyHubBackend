import { Model, ModelStatic } from "sequelize";

export abstract class BaseRepository<M extends Model, Attr, CreateAttr> {
  protected abstract model: ModelStatic<M>;

  async findAll(): Promise<M[]> {
    return this.model.findAll();
  }

  async findAllPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.model.findAndCountAll({
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
    };
  }

  async findById(id: number): Promise<M | null> {
    return this.model.findByPk(id);
  }

  async create(data: CreateAttr): Promise<M> {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<Attr>): Promise<M | null> {
    const [rows] = await this.model.update(data as any, {
      where: { id } as any,
    });
    return rows > 0 ? this.findById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await this.model.destroy({
      where: { id } as any,
    });
    return rows > 0;
  }
}
