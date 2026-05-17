import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  try {
    await connectDatabase();

    const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
    const pass = process.env.INIT_ADMIN_PASSWORD || "ChangeMe123!";

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = new Admin({ name: "Admin", email });
    await admin.setPassword(pass);
    await admin.save();

    console.log("Created admin:", email);
    console.log("Please change the password after first login.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
