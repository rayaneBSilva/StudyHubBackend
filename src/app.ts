import express from "express";
import { UserController } from "./controllers/UserController";
import { CardController } from "./controllers/CardController";
import { FolderController } from "./controllers/FolderController";
import { SummaryController } from "./controllers/SummaryController";
import { authenticate } from "./middlewares/authMiddleware";
import { onlyTeacher } from "./middlewares/roleMiddleware";

const app = express();
app.use(express.json());

const userController = new UserController();
const cardController = new CardController();
const folderController = new FolderController();
const summaryController = new SummaryController();

// USERS
app.post("/api/users", userController.create);
app.post("/api/users/login", userController.loginUser);

app.get("/api/users", authenticate, userController.getAll);
app.get("/api/users/:id", authenticate, userController.getById);
app.put("/api/users/:id", authenticate, userController.update);
app.delete("/api/users/:id", authenticate, userController.delete);

// CARDS
app.post("/api/cards", authenticate, onlyTeacher, cardController.create);
app.get("/api/cards/:id", authenticate, cardController.getById);
app.put("/api/cards/:id", authenticate, cardController.update);
app.delete("/api/cards/:id", authenticate, cardController.delete);
app.get(
  "/api/cards/disciplina/:disciplina",
  authenticate,
  cardController.getCardsByDisciplina,
);
app.get("/api/cards", authenticate, cardController.getAll);

// FOLDERS
app.get("/api/folders", authenticate, folderController.getAll);
app.get("/api/folders/:id", authenticate, folderController.getById);
app.post("/api/folders", authenticate, folderController.create);
app.put("/api/folders/:id", authenticate, folderController.update);
app.delete("/api/folders/:id", authenticate, folderController.delete);

// SUMMARIES
app.get("/api/summaries", authenticate, summaryController.getAll);
app.get("/api/summaries/:id", authenticate, summaryController.getById);
app.post("/api/summaries", authenticate, summaryController.create);
app.put("/api/summaries/:id", authenticate, summaryController.update);
app.delete("/api/summaries/:id", authenticate, summaryController.delete);

export default app;
