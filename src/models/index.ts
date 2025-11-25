// Arquivo de índice para gerenciar todos os modelos e relacionamentos
import { User } from "./User";
import { Card } from "./Card";
import sequelize from "../config/database";

// Definindo relacionamentos entre modelos
// Um usuário pode ter vários cards
User.hasMany(Card, {
  foreignKey: "autor_id",
  as: "cards"
});

// Cada card pertence a um usuário
Card.belongsTo(User, {
  foreignKey: "autor_id",
  as: "autor"
});

// Exportar todos os modelos e a instância do sequelize
export {
  User,
  Card,
  sequelize
};

// Função para sincronizar modelos com o banco (usar apenas em desenvolvimento)
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("✅ Modelos sincronizados com o banco de dados");
  } catch (error) {
    console.error("❌ Erro ao sincronizar modelos:", error);
  }
};