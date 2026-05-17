import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const execFileAsync = promisify(execFile);

const backupDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    const backupDir = path.join(process.cwd(), "backups");
    fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `mongodb-backup-${timestamp}`);

    console.log("Creating MongoDB backup...");
    console.log(`Backup folder: ${backupPath}`);

    await execFileAsync("mongodump", [
      "--uri",
      process.env.MONGODB_URI,
      "--out",
      backupPath,
    ]);

    console.log("MongoDB backup created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Backup failed:", error.message);
    console.error("Install MongoDB Database Tools if mongodump is not available.");
    process.exit(1);
  }
};

backupDatabase();
