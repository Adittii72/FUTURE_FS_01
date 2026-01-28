import dotenv from "dotenv";
dotenv.config();
import sequelize from "./src/config/database.js";
import Admin from "./src/models/Admin.js";

const testLogin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    const email = "info@aditi.com";
    const password = "infoaboutaditi";

    console.log("\n🔍 Looking for admin with email:", email);
    const admin = await Admin.findOne({ where: { email: email.trim().toLowerCase() } });
    
    if (!admin) {
      console.log("❌ Admin not found");
      process.exit(1);
    }

    console.log("✅ Admin found:", {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive
    });

    console.log("\n🔐 Testing password validation...");
    const match = await admin.validatePassword(password);
    console.log("Password match:", match);

    if (match) {
      console.log("✅ Login would succeed!");
    } else {
      console.log("❌ Password does not match");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

testLogin();
