import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SummaryAttributes {
  id: number;
  titulo: string;
  conteudo: string;
  disciplina: string;
  autor_id: number;
  pdf_path?: string;
}

export interface SummaryCreationAttributes extends Optional<
  SummaryAttributes,
  "id" | "pdf_path"
> {}

export class Summary
  extends Model<SummaryAttributes, SummaryCreationAttributes>
  implements SummaryAttributes
{
  public id!: number;
  public titulo!: string;
  public conteudo!: string;
  public disciplina!: string;
  public autor_id!: number;
}

Summary.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    disciplina: { type: DataTypes.STRING, allowNull: false },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    pdf_path: { type: DataTypes.STRING, allowNull: true },
  },

  { sequelize, tableName: "summaries", timestamps: false },
);
