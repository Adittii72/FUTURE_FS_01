// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

// console.log("🔌 Connecting to local PostgreSQL database...");
// console.log("📊 Database:", process.env.DB_NAME);
// console.log("🏠 Host:", process.env.DB_HOST);
// console.log("👤 User:", process.env.DB_USER);

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     dialect: "postgres",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 60000,
//       idle: 10000,
//     },
//     logging: false, // Set to console.log to see SQL queries
//   }
// );

// export default sequelize;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("🔌 Connecting to Supabase PostgreSQL...");
console.log("🌐 Database URL loaded:", !!process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export default sequelize;
