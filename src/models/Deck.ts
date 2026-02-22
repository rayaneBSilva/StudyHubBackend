import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface DeckAttributes {
  id: number;
  nome: string;
  descricao?: string;
  autor_id: number;
}

export interface DeckCreationAttributes extends Optional<
  DeckAttributes,
  "id" | "descricao"
> {}

export class Deck
  extends Model<DeckAttributes, DeckCreationAttributes>
  implements DeckAttributes
{
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public autor_id!: number;
}

Deck.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT },
    autor_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "decks",
    timestamps: true,
  },
);
