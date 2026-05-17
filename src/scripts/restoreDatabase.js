import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const execFileAsync = promisify(execFile);

const restoreDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      throw new Error("No backups directory found");
    }

    const backups = fs
      .readdirSync(backupDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("mongodb-backup-"))
      .map((entry) => entry.name)
      .sort()
      .reverse();

    if (backups.length === 0) {
      throw new Error("No MongoDB backup folders found");
    }

    const backupPath = path.join(backupDir, backups[0]);

    console.log(`Restoring from: ${backupPath}`);
    await execFileAsync("mongorestore", [
      "--uri",
      process.env.MONGODB_URI,
      "--drop",
      backupPath,
    ]);

    console.log("MongoDB restored successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Restore failed:", error.message);
    console.error("Install MongoDB Database Tools if mongorestore is not available.");
    process.exit(1);
  }
};

restoreDatabase();
