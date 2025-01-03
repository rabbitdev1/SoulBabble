import { Sequelize, TEXT } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const trackingMoodModel = db.define(
  "tracking_mood", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apiKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    emotionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    resultedEmotion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default trackingMoodModel;
