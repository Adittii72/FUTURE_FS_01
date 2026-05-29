import { createBackup } from "../scripts/autoBackup.js";

/**
 * Middleware to trigger automatic backups on data changes
 * Backs up after successful POST, PUT, PATCH, DELETE operations
 */

let lastBackupTime = 0;
const BACKUP_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown between backups

export const autoBackupMiddleware = (req, res, next) => {
  // Store original res.json
  const originalJson = res.json.bind(res);

  // Override res.json to trigger backup after successful response
  res.json = function (data) {
    // Only backup on successful data modifications
    const isDataModification = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

    if (isDataModification && isSuccess) {
      const now = Date.now();
      
      // Only backup if cooldown period has passed
      if (now - lastBackupTime > BACKUP_COOLDOWN) {
        lastBackupTime = now;
        
        // Trigger backup asynchronously (don't wait for it)
        createBackup()
          .then((backupPath) => {
            console.log(`🔄 Auto-backup created: ${backupPath}`);
          })
          .catch((error) => {
            console.error("⚠️  Auto-backup failed:", error.message);
          });
      }
    }

    // Call original res.json
    return originalJson(data);
  };

  next();
};

export default autoBackupMiddleware;
