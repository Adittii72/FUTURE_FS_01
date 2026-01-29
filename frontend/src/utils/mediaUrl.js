/**
 * Converts a relative media URL to a full backend URL
 * @param {string} url - The URL (can be relative like /uploads/file.jpg or already full URL)
 * @returns {string} - Full URL pointing to backend server
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path (starts with /), prepend backend URL
  if (url.startsWith('/')) {
    const backendUrl = 'https://future-fs-01-backend-7jvt.onrender.com';
    return `${backendUrl}${url}`;
  }
  
  // If it doesn't start with /, assume it's relative and add /
  const backendUrl = 'https://future-fs-01-backend-7jvt.onrender.com';
  return `${backendUrl}/${url}`;
};

export default getMediaUrl;

