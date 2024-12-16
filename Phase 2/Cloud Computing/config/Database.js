import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

// Using camelCase for the variable name `db` (already fine), and ensuring clarity with constant naming
const databaseConnection = new Sequelize({
  host: process.env.DEV_DB_HOST,
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  port: process.env.DEV_DB_PORT,
  dialect: "mysql",
});

export default databaseConnection;
