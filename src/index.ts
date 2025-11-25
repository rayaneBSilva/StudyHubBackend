import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { UserController } from "./controllers/UserController";
import { CardController } from "./controllers/CardController";

dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();
const cardController = new CardController();

// ROTAS USERS
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.createUser);
app.put("/api/users/:id", userController.updateUser);
app.delete("/api/users/:id", userController.deleteUser);
app.post("/api/users/login", userController.loginUser);

// ROTAS CARDS
app.get("/api/cards", cardController.getAllCards);
app.get("/api/cards/:id", cardController.getCardById);
app.post("/api/cards", cardController.createCard);
app.put("/api/cards/:id", cardController.updateCard);
app.delete("/api/cards/:id", cardController.deleteCard);
app.get(
  "/api/cards/disciplina/:disciplina",
  cardController.getCardsByDisciplina
);

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
