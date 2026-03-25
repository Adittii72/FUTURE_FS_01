import supabase from './supabaseClient.js';

/**
 * Uploads a file buffer to Supabase Storage
 * @param {Object} params
 * @param {string} params.bucket - The storage bucket name (e.g., "media")
 * @param {string} params.path - The path within the bucket (e.g., "achievements/1/image.jpg")
 * @param {Buffer} params.fileBuffer - The file buffer to upload
 * @param {string} params.contentType - MIME type (e.g., "image/jpeg", "video/mp4")
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadToSupabase = async ({ bucket, path: filePath, fileBuffer, contentType }) => {
  try {
    if (!supabase) {
      throw new Error('Supabase is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true, // Replace if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;
    console.log(`✅ File uploaded to Supabase: ${filePath}`);
    console.log(`🌐 Public URL: ${publicUrl}`);

    return publicUrl;
  } catch (err) {
    console.error('uploadToSupabase error:', err);
    throw err;
  }
};

export default uploadToSupabase;

