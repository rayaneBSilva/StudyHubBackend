import {
  Folder,
  FolderAttributes,
  FolderCreationAttributes,
} from "../models/Folder";

export class FolderRepository {
  async findAll(): Promise<Folder[]> {
    return await Folder.findAll();
  }

  async findById(id: number): Promise<Folder | null> {
    return await Folder.findByPk(id);
  }

  async findByAutor(autor_id: number): Promise<Folder[]> {
    return await Folder.findAll({ where: { autor_id } });
  }

  async create(data: FolderCreationAttributes): Promise<Folder> {
    return await Folder.create(data);
  }

  async update(
    id: number,
    data: Partial<FolderAttributes>
  ): Promise<Folder | null> {
    const [updated] = await Folder.update(data, { where: { id } });

    if (updated === 0) return null;

    return await Folder.findByPk(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Folder.destroy({ where: { id } });
    return deleted > 0;
  }
}
