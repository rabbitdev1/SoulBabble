import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const annModel = db.define(
  "ann_model", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trainingDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modelName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    modelData: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: true,
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

export default annModel;
