import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

/* =========================
   ENV & PATH SETUP
========================= */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   MODELS
========================= */
import "./models/About.js";
import "./models/Admin.js";
import "./models/Achievement.js";
import "./models/ContactMessage.js";
import Project from "./models/Project.js";
import ProjectImage from "./models/ProjectImage.js";
import "./models/Resume.js";
import "./models/Skill.js";

/* =========================
   MODEL RELATIONS
========================= */
Project.hasMany(ProjectImage, {
  foreignKey: "projectId",
  as: "images",
  onDelete: "CASCADE",
});

ProjectImage.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

/* =========================
   ROUTES
========================= */
import adminRoutes from "./routes/adminRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: [
      "https://aditishrimankar.com",
      "https://www.aditishrimankar.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* =========================
   STATIC MEDIA (CRITICAL)
========================= */
// Serve uploaded images / videos / pdfs
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public/uploads"), {
    setHeaders: (res, filePath) => {
      const lower = filePath.toLowerCase();

      if (lower.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Accept-Ranges", "bytes");
      }

      if (lower.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
    },
  })
);

// Serve other public assets if any
app.use(express.static(path.join(__dirname, "..", "public")));

/* =========================
   API ROUTES
========================= */
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully");
});

/* =========================
   START SERVER FIRST
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API listening on port ${PORT}`);
});

/* =========================
   CONNECT DATABASE (NON-BLOCKING)
========================= */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database connected successfully!");

    if (process.env.DATABASE_URL) {
      console.log(
        "📊 Database Host:",
        process.env.DATABASE_URL.split("@")[1]?.split("/")[0]
      );
    }

    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("⚠️ Server is running WITHOUT database connection");
  }
})();
