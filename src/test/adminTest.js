import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    await connectDatabase();
    console.log("MongoDB connected.");

    const adminCount = await Admin.countDocuments();
    console.log(`Admins found: ${adminCount}`);
  } catch (error) {
    console.error("Admin test failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
