import { BaseRepository } from "./BaseRepository";
import {
  Folder,
  FolderAttributes,
  FolderCreationAttributes,
} from "../models/Folder";
import { Op } from "sequelize";

export class FolderRepository extends BaseRepository<
  Folder,
  FolderAttributes,
  FolderCreationAttributes
> {
  protected model = Folder;

  async findByAutor(autor_id: number): Promise<Folder[]> {
    return Folder.findAll({ where: { autor_id } });
  }

  async findPaginatedAndFiltered(
    filters: { nome?: string; autor_id?: number },
    page: number,
    limit: number,
  ) {
    const offset = (page - 1) * limit;

    const { rows, count } = await Folder.findAndCountAll({
      where: {
        ...(filters.nome && {
          nome: { [Op.like]: `%${filters.nome}%` },
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

  async exists(nome: string) {
    const folder = await Folder.findOne({ where: { nome } });
    return !!folder;
  }
}
