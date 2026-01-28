import dotenv from "dotenv";
dotenv.config();
import sequelize from "../config/database.js";
import About from "../models/About.js";
import Resume from "../models/Resume.js";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    console.log("🔄 Initializing database...");
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    await sequelize.sync();
    console.log("✅ Tables synced");

    // Initialize About
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
      console.log("✅ About section created");
    } else {
      console.log("ℹ️  About section already exists");
    }

    // Initialize Resume
    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create({
        fileUrl: "",
      });
      console.log("✅ Resume section created");
    } else {
      console.log("ℹ️  Resume section already exists");
    }

    // Initialize Admin
    const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
    const pass = process.env.INIT_ADMIN_PASSWORD || "ChangeMe123!";
    
    const existing = await Admin.findOne({ where: { email: email.toLowerCase() } });
    if (!existing) {
      const admin = Admin.build({ name: "Admin", email });
      await admin.setPassword(pass);
      await admin.save();
      console.log("✅ Admin created:", email);
    } else {
      console.log("ℹ️  Admin already exists:", email);
    }

    console.log("\n🎉 Database initialization complete!");
    console.log("📝 You can now start adding content through the admin dashboard");
    process.exit(0);
  } catch (err) {
    console.error("❌ Initialization error:", err);
    process.exit(1);
  }
};

run();
