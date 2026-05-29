import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/**
 * Automated Backup System
 * Creates JSON backups of all MongoDB collections
 */

const BACKUP_DIR = path.join(process.cwd(), "backups", "auto-backups");

// Ensure backup directory exists
fs.mkdirSync(BACKUP_DIR, { recursive: true });

/**
 * Create a backup of all collections
 */
export const createBackup = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(backupFolder, { recursive: true });

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();

    console.log(`📦 Creating backup at: ${backupFolder}`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = mongoose.connection.db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      // Save to JSON file
      const filePath = path.join(backupFolder, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

      console.log(`✅ Backed up: ${collectionName} (${documents.length} documents)`);
    }

    // Create metadata file
    const metadata = {
      timestamp: new Date().toISOString(),
      collections: collections.map((c) => c.name),
      totalCollections: collections.length,
      backupPath: backupFolder,
    };

    fs.writeFileSync(
      path.join(backupFolder, "_metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`✅ Backup completed successfully!`);
    console.log(`📁 Location: ${backupFolder}`);

    // Clean old backups (keep last 10)
    await cleanOldBackups();

    return backupFolder;
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    throw error;
  }
};

/**
 * Clean old backups, keep only the last 10
 */
const cleanOldBackups = async () => {
  try {
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((name) => name.startsWith("backup-"))
      .map((name) => ({
        name,
        path: path.join(BACKUP_DIR, name),
        time: fs.statSync(path.join(BACKUP_DIR, name)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    // Keep only last 10 backups
    const toDelete = backups.slice(10);

    for (const backup of toDelete) {
      fs.rmSync(backup.path, { recursive: true, force: true });
      console.log(`🗑️  Deleted old backup: ${backup.name}`);
    }
  } catch (error) {
    console.error("Warning: Could not clean old backups:", error.message);
  }
};

/**
 * Restore from a backup
 */
export const restoreBackup = async (backupPath) => {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupPath}`);
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const files = fs.readdirSync(backupPath).filter((f) => f.endsWith(".json") && f !== "_metadata.json");

    console.log(`📥 Restoring backup from: ${backupPath}`);

    for (const file of files) {
      const collectionName = file.replace(".json", "");
      const filePath = path.join(backupPath, file);
      const documents = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const collection = mongoose.connection.db.collection(collectionName);

      // Clear existing data
      await collection.deleteMany({});

      // Insert backup data
      if (documents.length > 0) {
        await collection.insertMany(documents);
      }

      console.log(`✅ Restored: ${collectionName} (${documents.length} documents)`);
    }

    console.log(`✅ Restore completed successfully!`);
  } catch (error) {
    console.error("❌ Restore failed:", error.message);
    throw error;
  }
};

/**
 * List all available backups
 */
export const listBackups = () => {
  try {
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((name) => name.startsWith("backup-"))
      .map((name) => {
        const backupPath = path.join(BACKUP_DIR, name);
        const metadataPath = path.join(backupPath, "_metadata.json");
        
        let metadata = null;
        if (fs.existsSync(metadataPath)) {
          metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
        }

        return {
          name,
          path: backupPath,
          created: fs.statSync(backupPath).mtime,
          metadata,
        };
      })
      .sort((a, b) => b.created - a.created);

    return backups;
  } catch (error) {
    console.error("Error listing backups:", error.message);
    return [];
  }
};

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createBackup()
    .then(() => {
      console.log("✅ Manual backup completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Manual backup failed:", error);
      process.exit(1);
    });
}
