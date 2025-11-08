import sequelize from "../config/database.js";
import Admin from "../models/Admin.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB ready");

    // Create admin
    const admin = Admin.build({ name: "Aditi", email: "aditi@example.com" });
    await admin.setPassword("StrongP@ssw0rd");
    await admin.save();
    console.log("Admin created:", admin.toJSON());

    // Test login check
    const found = await Admin.findOne({ where: { email: "aditi@example.com" } });
    const isMatch = await found.validatePassword("StrongP@ssw0rd");
    console.log("Password match:", isMatch);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
};

run();
