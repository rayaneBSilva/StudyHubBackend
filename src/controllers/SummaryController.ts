import { SummaryService } from "../services/SummaryService";
import { BaseController } from "./BaseController";

export class SummaryController extends BaseController<SummaryService> {
  constructor() {
    super(new SummaryService());
  }
}
