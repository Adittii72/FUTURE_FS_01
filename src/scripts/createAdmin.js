import dotenv from "dotenv";
dotenv.config();
import sequelize from "../config/database.js";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
    const pass = process.env.INIT_ADMIN_PASSWORD || "ChangeMe123!";

    const existing = await Admin.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const admin = Admin.build({ name: "Admin", email });
    await admin.setPassword(pass);
    await admin.save();
    console.log("Created admin:", email);
    console.log("Please change the password after first login.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();
