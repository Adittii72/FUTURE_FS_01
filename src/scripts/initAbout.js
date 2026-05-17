import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import About from "../models/About.js";

dotenv.config();

const run = async () => {
  try {
    await connectDatabase();

    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        name: "Your Name",
        headline: "UI/UX Designer And Graphic Designer",
        bio: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs",
        profileImageUrl: "",
        coverImageUrl: "",
        linkedin: "",
        github: "",
        location: "",
      });
      console.log("About section created successfully.");
    } else {
      console.log("About section already exists.");
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
