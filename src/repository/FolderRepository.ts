import { BaseRepository } from "./BaseRepository";
import {
  Folder,
  FolderAttributes,
  FolderCreationAttributes,
} from "../models/Folder";

export class FolderRepository extends BaseRepository<
  Folder,
  FolderAttributes,
  FolderCreationAttributes
> {
  protected model = Folder;

  async findByAutor(autor_id: number): Promise<Folder[]> {
    return Folder.findAll({ where: { autor_id } });
  }
}
