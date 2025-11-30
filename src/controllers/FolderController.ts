import { FolderService } from "../services/FolderService";
import { BaseController } from "./BaseController";

export class FolderController extends BaseController<FolderService> {
  constructor() {
    super(new FolderService());
  }
}
