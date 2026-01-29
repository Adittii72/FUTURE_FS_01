import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import "./models/About.js";
import "./models/Admin.js";
import "./models/Achievement.js";
import "./models/ContactMessage.js";
import Project from "./models/Project.js"; 
import ProjectImage from "./models/ProjectImage.js";
import "./models/Resume.js";
import "./models/Skill.js";


Project.hasMany(ProjectImage, {
  foreignKey: "projectId",
  as: "images",
  onDelete: "CASCADE",
});
ProjectImage.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});


import adminRoutes from "./routes/adminRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";


dotenv.config();
const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use(
  express.static(path.join(__dirname, "..", "public"), {
    setHeaders: (res, filePath) => {
      const lowerPath = filePath.toLowerCase();
      if (lowerPath.endsWith(".mp4") || lowerPath.endsWith(".mov")) {
        res.set("Content-Type", "video/mp4");
      } else if (lowerPath.endsWith(".webm") || lowerPath.endsWith(".ogg")) {
        res.set("Content-Type", "video/webm");
      } else if (lowerPath.endsWith(".pdf")) {
        res.set("Content-Type", "application/pdf");
      }
    },
  })
);


app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Postgre connected successfully!");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synced successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection warning:", error.message);
    console.log("⚠️  Continuing without database...");
    // Continue running even if DB fails
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (without DB)`));
  });