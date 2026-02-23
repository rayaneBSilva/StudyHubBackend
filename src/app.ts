import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

import { UserController } from "./controllers/UserController";
import { CardController } from "./controllers/CardController";
import { FolderController } from "./controllers/FolderController";
import { SummaryController } from "./controllers/SummaryController";
import { authenticate } from "./middlewares/authMiddleware";
import { onlyTeacher } from "./middlewares/roleMiddleware";
import { AuthenticatedRequest } from "../types/express";
import { SummaryService } from "./services/SummaryService";
import { DeckController } from "./controllers/DeckController";

const app = express();
app.use(express.json());

// ------------------ MULTER CONFIG ------------------

// Cria a pasta uploads/ na raiz do projeto se ainda não existir
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do storage do multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({ storage });

// ------------------ CONTROLLERS ------------------
const userController = new UserController();
const cardController = new CardController();
const folderController = new FolderController();
const summaryController = new SummaryController();
const summaryService = new SummaryService();
const deckController = new DeckController();

// ------------------ USERS ------------------
app.post("/api/users", userController.create);
app.post("/api/users/login", userController.loginUser);

app.get("/api/users", authenticate, userController.getAll);
app.get("/api/users/:id", authenticate, userController.getById);
app.put("/api/users/:id", authenticate, userController.update);
app.delete("/api/users/:id", authenticate, userController.delete);

// ------------------ CARDS ------------------
app.post("/api/cards", authenticate, cardController.create);
app.get("/api/cards", authenticate, cardController.list);
app.put("/api/cards/:id", authenticate, cardController.update);
app.delete("/api/cards/:id", authenticate, cardController.delete);

/* ------------------ DECKS ------------------ */
app.post("/api/decks", authenticate, deckController.create);
app.get("/api/decks", authenticate, deckController.getAll);
app.get("/api/decks/:id", authenticate, deckController.getById);
app.put("/api/decks/:id", authenticate, deckController.update);
app.delete("/api/decks/:id", authenticate, deckController.delete);

/* ------------------ STUDY ------------------ */
app.get(
  "/api/cards/study/:deckId",
  authenticate,
  cardController.getCardsToStudy,
);

app.patch("/api/cards/review/:cardId", authenticate, cardController.review);
// ------------------ FOLDERS ------------------
app.get("/api/folders", authenticate, folderController.getAll);
app.get("/api/folders/:id", authenticate, folderController.getById);
app.post("/api/folders", authenticate, folderController.create);
app.put("/api/folders/:id", authenticate, folderController.update);
app.delete("/api/folders/:id", authenticate, folderController.delete);

// ------------------ SUMMARIES ------------------
app.get("/api/summaries", authenticate, summaryController.getAll);
app.get("/api/summaries/:id", authenticate, summaryController.getById);
app.post(
  "/api/summaries",
  authenticate,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { titulo, disciplina } = authReq.body;
      const autor_id = authReq.user.id;

      if (!authReq.file) {
        return res.status(400).json({
          success: false,
          message: "PDF obrigatório",
        });
      }

      const resumo = await summaryService.createSummary({
        titulo,
        disciplina,
        conteudo: authReq.file.filename,
        autor_id,
      });

      res.status(201).json({
        success: true,
        data: resumo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  },
);

app.put("/api/summaries/:id", authenticate, summaryController.update);
app.delete("/api/summaries/:id", authenticate, summaryController.delete);

// ------------------ REVISÃO (SOMENTE PROFESSOR) ------------------
app.patch(
  "/api/cards/:id/approve",
  authenticate,
  onlyTeacher,
  cardController.approve,
);

app.patch(
  "/api/cards/:id/reject",
  authenticate,
  onlyTeacher,
  cardController.reject,
);

export default app;
