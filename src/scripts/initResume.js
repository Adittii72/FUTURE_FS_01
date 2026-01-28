import dotenv from "dotenv";
dotenv.config();
import sequelize from "../config/database.js";
import Resume from "../models/Resume.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    let resume = await Resume.findOne();

    if (!resume) {
      resume = await Resume.create({
        fileUrl: "",
      });
      console.log("Resume section created successfully!");
    } else {
      console.log("Resume section already exists");
    }

    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    process.exit(1);
  }
};

run();
