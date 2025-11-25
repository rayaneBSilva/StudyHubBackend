import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

// 1. Atributos que existem na tabela
export interface CardAttributes {
  id: number;
  titulo: string;
  conteudo: string;
  disciplina: string;
  tags: string[];
  autor_id: number;
}

// 2. Atributos necessários para criar (id é auto incremento)
export interface CardCreationAttributes
  extends Optional<CardAttributes, "id"> {}

// 3. Classe do modelo
export class Card
  extends Model<CardAttributes, CardCreationAttributes>
  implements CardAttributes
{
  public id!: number;
  public titulo!: string;
  public conteudo!: string;
  public disciplina!: string;
  public tags!: string[];
  public autor_id!: number;
}

// 4. Inicialização do modelo (mapeia pra tabela)
Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    disciplina: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "cards",
    timestamps: false,
  }
);
