import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

// Parse DATABASE_URL to extract connection details
const parseDatabaseUrl = (databaseUrl) => {
  const url = new URL(databaseUrl);
  return {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port || '5432',
    database: url.pathname.slice(1), // Remove leading /
  };
};

const restoreDatabase = async () => {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    
    if (!fs.existsSync(backupDir)) {
      console.error('❌ No backups directory found');
      process.exit(1);
    }

    // List available backups
    const backups = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.sql'))
      .sort()
      .reverse();

    if (backups.length === 0) {
      console.error('❌ No backup files found');
      process.exit(1);
    }

    console.log('📚 Available backups:');
    backups.forEach((backup, index) => {
      console.log(`  ${index + 1}. ${backup}`);
    });

    // Use the most recent backup
    const backupFile = path.join(backupDir, backups[0]);
    
    // Parse DATABASE_URL if available, otherwise use individual env vars
    let dbUser, dbPassword, dbHost, dbPort, dbName;
    
    if (process.env.DATABASE_URL) {
      const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
      dbUser = parsed.user;
      dbPassword = parsed.password;
      dbHost = parsed.host;
      dbPort = parsed.port;
      dbName = parsed.database;
    } else {
      dbName = process.env.DB_NAME || 'future_fs_01';
      dbUser = process.env.DB_USER || 'postgres';
      dbHost = process.env.DB_HOST || 'localhost';
      dbPort = process.env.DB_PORT || '5432';
      dbPassword = process.env.DB_PASS;
    }

    console.log(`\n🔄 Restoring from: ${backups[0]}`);
    console.log(`📊 Database: ${dbName}`);

    // Use psql to restore backup
    const command = `psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${backupFile}"`;
    
    await execAsync(command, {
      env: { ...process.env, PGPASSWORD: dbPassword }
    });

    console.log('✅ Database restored successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }
};

restoreDatabase();
