import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { UserController } from "./controllers/UserController";
import { CardController } from "./controllers/CardController";
import { FolderController } from "./controllers/FolderController";
import { SummaryController } from "./controllers/SummaryController";
import { authenticate } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();
const cardController = new CardController();
const folderController = new FolderController();
const summaryController = new SummaryController();

// ROTAS USERS
app.post("/api/users", userController.create);

// Login
app.post("/api/users/login", userController.loginUser);

// USERS
app.get("/api/users", authenticate, userController.getAll);
app.get("/api/users/:id", authenticate, userController.getById);
app.put("/api/users/:id", authenticate, userController.update);
app.delete("/api/users/:id", authenticate, userController.delete);

// ROTAS CARDS
app.get("/api/cards", authenticate, cardController.getAll);
app.get("/api/cards/:id", authenticate, cardController.getById);
app.post("/api/cards", authenticate, cardController.create);
app.put("/api/cards/:id", authenticate, cardController.update);
app.delete("/api/cards/:id", authenticate, cardController.delete);
app.get(
  "/api/cards/disciplina/:disciplina",
  authenticate,
  cardController.getCardsByDisciplina,
);

// ROTAS FOLDERS
app.get("/api/folders", authenticate, folderController.getAll);
app.get("/api/folders/:id", authenticate, folderController.getById);
app.post("/api/folders", authenticate, folderController.create);
app.put("/api/folders/:id", authenticate, folderController.update);
app.delete("/api/folders/:id", authenticate, folderController.delete);

// ROTAS SUMMARIES
app.get("/api/summaries", authenticate, summaryController.getAll);
app.get("/api/summaries/:id", authenticate, summaryController.getById);
app.post("/api/summaries", authenticate, summaryController.create);
app.put("/api/summaries/:id", authenticate, summaryController.update);
app.delete("/api/summaries/:id", authenticate, summaryController.delete);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: true }) // CUIDADO: apaga a tabela toda vez que sobe!
  .then(() => {
    console.log("Banco de dados conectado!");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
