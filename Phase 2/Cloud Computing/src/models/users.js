import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const userModel = db.define(
  "users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    UID: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

userModel.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default userModel;
