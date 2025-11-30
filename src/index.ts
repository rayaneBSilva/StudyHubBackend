import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { UserController } from "./controllers/UserController";
import { CardController } from "./controllers/CardController";
import { FolderController } from "./controllers/FolderController";
import { SummaryController } from "./controllers/SummaryController";

dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();
const cardController = new CardController();
const folderController = new FolderController();
const summaryController = new SummaryController();

// ROTAS USERS
app.get("/api/users", userController.getAll);
app.get("/api/users/:id", userController.getById);
app.post("/api/users", userController.create);
app.put("/api/users/:id", userController.update);
app.delete("/api/users/:id", userController.delete);
app.post("/api/users/login", userController.loginUser);

// ROTAS CARDS
app.get("/api/cards", cardController.getAll);
app.get("/api/cards/:id", cardController.getById);
app.post("/api/cards", cardController.create);
app.put("/api/cards/:id", cardController.update);
app.delete("/api/cards/:id", cardController.delete);
app.get(
  "/api/cards/disciplina/:disciplina",
  cardController.getCardsByDisciplina
);

// ROTAS FOLDERS
app.get("/api/folders", folderController.getAll);
app.get("/api/folders/:id", folderController.getById);
app.post("/api/folders", folderController.create);
app.put("/api/folders/:id", folderController.update);
app.delete("/api/folders/:id", folderController.delete);

// ROTAS SUMMARIES
app.get("/api/summaries", summaryController.getAll);
app.get("/api/summaries/:id", summaryController.getById);
app.post("/api/summaries", summaryController.create);
app.put("/api/summaries/:id", summaryController.update);
app.delete("/api/summaries/:id", summaryController.delete);

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
