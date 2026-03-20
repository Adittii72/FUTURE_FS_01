import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Uploads a file buffer to local storage
 * @param {Object} params
 * @param {string} params.bucket - The storage bucket name (used for directory organization)
 * @param {string} params.path - The path within the bucket (e.g., "achievements/1/image.jpg")
 * @param {Buffer} params.fileBuffer - The file buffer to upload
 * @param {string} params.contentType - MIME type (e.g., "image/jpeg", "video/mp4")
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadToSupabase = async ({ bucket, path: filePath, fileBuffer, contentType }) => {
  try {
    // Construct full path: public/uploads/{filePath}
    const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
    const fullPath = path.join(uploadsDir, filePath);
    
    // Create directories if they don't exist
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }

    // Write file to disk
    fs.writeFileSync(fullPath, fileBuffer);
    console.log(`✅ File uploaded to: ${fullPath}`);

    // Return public URL path (relative to backend domain)
    const publicUrl = `/uploads/${filePath}`;
    console.log(`🌐 Public URL: ${publicUrl}`);

    return publicUrl;
  } catch (err) {
    console.error('uploadToSupabase error:', err);
    throw err;
  }
};

export default uploadToSupabase;

