import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CardAttributes {
  id: number;
  frente: string;
  verso: string;
  deck_id: number;
  autor_id: number;
  status: ReviewStatus;

  // spaced repetition
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: Date;

  reviewed_by?: number;
  review_reason?: string;
}

export interface CardCreationAttributes extends Optional<
  CardAttributes,
  | "id"
  | "status"
  | "ease_factor"
  | "interval"
  | "repetitions"
  | "next_review"
  | "reviewed_by"
  | "review_reason"
> {}

export class Card
  extends Model<CardAttributes, CardCreationAttributes>
  implements CardAttributes
{
  public id!: number;
  public frente!: string;
  public verso!: string;
  public deck_id!: number;
  public autor_id!: number;
  public status!: ReviewStatus;

  public ease_factor!: number;
  public interval!: number;
  public repetitions!: number;
  public next_review!: Date;

  public reviewed_by?: number;
  public review_reason?: string;
}

Card.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    frente: { type: DataTypes.TEXT, allowNull: false },
    verso: { type: DataTypes.TEXT, allowNull: false },
    deck_id: { type: DataTypes.INTEGER, allowNull: false },
    autor_id: { type: DataTypes.INTEGER, allowNull: false },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },

    ease_factor: {
      type: DataTypes.FLOAT,
      defaultValue: 2.5,
    },

    interval: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    repetitions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    next_review: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    reviewed_by: { type: DataTypes.INTEGER },
    review_reason: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "cards",
    timestamps: true,
  },
);
