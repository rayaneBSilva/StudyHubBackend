import { FolderRepository } from "../repository/FolderRepository";
import { FolderAttributes, FolderCreationAttributes } from "../models/Folder";

export class FolderService {
  private folderRepository: FolderRepository;

  constructor() {
    this.folderRepository = new FolderRepository();
  }

  async getAllFolders() {
    return await this.folderRepository.findAll();
  }

  async getFolderById(id: number) {
    const folder = await this.folderRepository.findById(id);
    if (!folder) throw new Error("Pasta não encontrada");
    return folder;
  }

  async getFoldersByAutor(autor_id: number) {
    return await this.folderRepository.findByAutor(autor_id);
  }

  async createFolder(data: FolderCreationAttributes) {
    if (!data.nome) throw new Error("Nome é obrigatório");
    if (!data.autor_id) throw new Error("Autor é obrigatório");

    return await this.folderRepository.create(data);
  }

  async updateFolder(id: number, data: Partial<FolderAttributes>) {
    const folder = await this.folderRepository.update(id, data);
    if (!folder) throw new Error("Pasta não encontrada");
    return folder;
  }

  async deleteFolder(id: number) {
    const deleted = await this.folderRepository.delete(id);
    if (!deleted) throw new Error("Pasta não encontrada");
    return { message: "Pasta excluída com sucesso" };
  }
}
