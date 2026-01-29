import supabase from './supabaseClient.js';

/**
 * Uploads a file buffer to Supabase Storage
 * @param {Object} params
 * @param {string} params.bucket - The storage bucket name
 * @param {string} params.path - The path within the bucket (e.g., "achievements/1/image.jpg")
 * @param {Buffer} params.fileBuffer - The file buffer to upload
 * @param {string} params.contentType - MIME type (e.g., "image/jpeg", "video/mp4")
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadToSupabase = async ({ bucket, path, fileBuffer, contentType }) => {
  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true, // Overwrite if file already exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data: publicData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);

    if (!publicData?.publicUrl) {
      throw new Error('Failed to get public URL from Supabase');
    }

    return publicData.publicUrl;
  } catch (err) {
    console.error('uploadToSupabase error:', err);
    throw err;
  }
};

export default uploadToSupabase;

