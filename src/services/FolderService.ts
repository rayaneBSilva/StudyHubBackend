import { BaseService } from "./BaseService";
import { FolderRepository } from "../repository/FolderRepository";
import { FolderAttributes, FolderCreationAttributes } from "../models/Folder";

export class FolderService extends BaseService<
  FolderRepository,
  FolderAttributes,
  FolderCreationAttributes
> {
  constructor() {
    super(new FolderRepository());
  }

  async createFolder(data: FolderCreationAttributes) {
    if (!data.nome?.trim()) throw new Error("Nome é obrigatório");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    return this.create(data);
  }

  async getFoldersByAutor(autor_id: number) {
    return this.repository.findByAutor(autor_id);
  }

  async getAllFiltered(filters: any, page: number, limit: number) {
    return this.repository.findPaginatedAndFiltered(filters, page, limit);
  }
}
