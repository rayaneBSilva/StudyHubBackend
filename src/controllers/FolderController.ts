import { Request, Response } from "express";
import { FolderService } from "../services/FolderService";

export class FolderController {
  private folderService: FolderService;

  constructor() {
    this.folderService = new FolderService();
  }

  getAllFolders = async (req: Request, res: Response) => {
    try {
      const folders = await this.folderService.getAllFolders();
      res.json({ success: true, data: folders });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Erro interno",
        });
    }
  };

  getFolderById = async (req: Request, res: Response) => {
    try {
      const folder = await this.folderService.getFolderById(
        Number(req.params.id)
      );
      res.json({ success: true, data: folder });
    } catch (error) {
      res
        .status(404)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Erro interno",
        });
    }
  };

  createFolder = async (req: Request, res: Response) => {
    try {
      const newFolder = await this.folderService.createFolder(req.body);
      res.status(201).json({ success: true, data: newFolder });
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Erro interno",
        });
    }
  };

  updateFolder = async (req: Request, res: Response) => {
    try {
      const updated = await this.folderService.updateFolder(
        Number(req.params.id),
        req.body
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Erro interno",
        });
    }
  };

  deleteFolder = async (req: Request, res: Response) => {
    try {
      const result = await this.folderService.deleteFolder(
        Number(req.params.id)
      );
      res.json({ success: true, data: result });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error instanceof Error ? error.message : "Erro interno",
        });
    }
  };
}
