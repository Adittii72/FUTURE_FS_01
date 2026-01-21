import dotenv from "dotenv";
dotenv.config();
import sequelize from "../config/database.js";
import About from "../models/About.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

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
      console.log("About section created successfully!");
    } else {
      // Update existing about if needed
      console.log("About section already exists");
    }

    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    process.exit(1);
  }
};

run();
