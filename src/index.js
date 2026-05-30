import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

import adminRoutes from "./routes/adminRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import connectDatabase from "./config/database.js";
import autoBackupMiddleware from "./middleware/autoBackupMiddleware.js";
import startScheduledBackups from "./scripts/scheduledBackup.js";

dotenv.config();
const app = express();

// ============================================
// CORS Configuration - Properly configured
// ============================================
const defaultOrigins = [
  "https://aditishrimankar.com",
  "https://www.aditishrimankar.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    
    // Block in production
    console.warn(`CORS blocked for origin: ${origin}`);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly - skip DB connection
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Database connection middleware - skip for OPTIONS
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ============================================
// AUTO-BACKUP MIDDLEWARE
// Automatically backs up data after modifications
// ============================================
app.use(autoBackupMiddleware);

// ============================================
// API ROUTES
// ============================================
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Health check endpoint (lightweight, no DB required)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start scheduled backups
    startScheduledBackups();
  });
}

export default app;
