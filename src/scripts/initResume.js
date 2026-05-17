import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import Resume from "../models/Resume.js";

dotenv.config();

const run = async () => {
  try {
    await connectDatabase();

    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create({ fileUrl: "" });
      console.log("Resume section created successfully.");
    } else {
      console.log("Resume section already exists.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
