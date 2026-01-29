import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("Connecting to database URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 15000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 10000,
  },
  logging: false,
});

export default sequelize;
