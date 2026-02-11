import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { ReviewStatus } from "./ReviewStatus";

export interface CardAttributes {
  id: number;
  titulo: string;
  conteudo: string;
  disciplina: string;
  tags: string[];
  autor_id: number;
  status: ReviewStatus;
  reviewed_by?: number;
  review_reason?: string | null;
}

export interface CardCreationAttributes extends Optional<
  CardAttributes,
  "id" | "status" | "reviewed_by" | "review_reason"
> {}

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
  public status!: ReviewStatus;
  public reviewed_by?: number;
  public review_reason?: string;
}

Card.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    disciplina: { type: DataTypes.STRING, allowNull: false },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    autor_id: { type: DataTypes.INTEGER, allowNull: false },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
    reviewed_by: { type: DataTypes.INTEGER, allowNull: true },
    review_reason: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "cards", timestamps: false },
);
