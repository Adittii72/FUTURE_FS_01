import cron from "node-cron";
import { createBackup } from "./autoBackup.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Scheduled Backup Service
 * Runs automatic backups at specified intervals
 */

// Schedule backup every 6 hours
// Cron format: minute hour day month weekday
// "0 */6 * * *" = Every 6 hours at minute 0
const BACKUP_SCHEDULE = "0 */6 * * *"; // Every 6 hours

export const startScheduledBackups = () => {
  console.log("🕐 Scheduled backup service started");
  console.log(`📅 Backup schedule: Every 6 hours`);

  // Schedule the backup
  cron.schedule(BACKUP_SCHEDULE, async () => {
    console.log("⏰ Scheduled backup triggered");
    try {
      const backupPath = await createBackup();
      console.log(`✅ Scheduled backup completed: ${backupPath}`);
    } catch (error) {
      console.error("❌ Scheduled backup failed:", error.message);
    }
  });

  // Also create an initial backup on startup
  setTimeout(async () => {
    console.log("🚀 Creating initial backup on startup...");
    try {
      await createBackup();
      console.log("✅ Initial backup completed");
    } catch (error) {
      console.error("❌ Initial backup failed:", error.message);
    }
  }, 10000); // Wait 10 seconds after startup
};

export default startScheduledBackups;
