import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import About from "../models/About.js";
import Resume from "../models/Resume.js";
import Admin from "../models/Admin.js";

dotenv.config();

const run = async () => {
  try {
    console.log("Initializing database...");
    await connectDatabase();

    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        name: "Your Name",
        headline: "Full Stack Developer",
        bio: "Passionate developer creating amazing web experiences.",
        profileImageUrl: "",
        coverImageUrl: "",
        linkedin: "",
        github: "",
        location: "",
      });
      console.log("About section created");
    } else {
      console.log("About section already exists");
    }

    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create({ fileUrl: "" });
      console.log("Resume section created");
    } else {
      console.log("Resume section already exists");
    }

    const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
    const pass = process.env.INIT_ADMIN_PASSWORD || "ChangeMe123!";

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (!existing) {
      const admin = new Admin({ name: "Admin", email });
      await admin.setPassword(pass);
      await admin.save();
      console.log("Admin created:", email);
    } else {
      console.log("Admin already exists:", email);
    }

    console.log("\nDatabase initialization complete.");
    console.log("You can now start adding content through the admin dashboard.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
