import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface FolderAttributes {
  id: number;
  nome: string;
  descricao: string;
  autor_id: number;
}

export interface FolderCreationAttributes
  extends Optional<FolderAttributes, "id"> {}

export class Folder
  extends Model<FolderAttributes, FolderCreationAttributes>
  implements FolderAttributes
{
  public id!: number;
  public nome!: string;
  public descricao!: string;
  public autor_id!: number;
}

Folder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "folders",
    timestamps: false,
  }
);
