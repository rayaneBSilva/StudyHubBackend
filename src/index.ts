import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import { UserController } from "./controllers/UserController";

dotenv.config();

const app = express();
app.use(express.json());

const userController = new UserController();

// ROTAS
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.createUser);
app.put("/api/users/:id", userController.updateUser);
app.delete("/api/users/:id", userController.deleteUser);
app.post("/api/users/login", userController.loginUser);

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
