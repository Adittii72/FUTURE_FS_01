import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const backupDatabase = async () => {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log('✅ Created backups directory');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    const dbName = process.env.DB_NAME || 'future_fs_01';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';

    console.log('🔄 Creating database backup...');
    console.log(`📊 Database: ${dbName}`);
    console.log(`💾 Backup file: ${backupFile}`);

    // Use pg_dump to create backup
    const command = `pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${backupFile}"`;
    
    await execAsync(command, {
      env: { ...process.env, PGPASSWORD: process.env.DB_PASS }
    });

    console.log('✅ Database backup created successfully!');
    console.log(`📁 Location: ${backupFile}`);
    
    // List all backups
    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
    console.log(`\n📚 Total backups: ${backups.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
};

backupDatabase();
