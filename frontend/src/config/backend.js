/**
 * Central backend URL configuration
 * Automatically remaps retired backend hosts to the current one
 */

const RETIRED_HOSTS = {
  'https://future-fs-01-backend-7jyt.onrender.com': 'https://future-fs-01-backend-7jvt.onrender.com'
};

const CURRENT_BACKEND = 'https://future-fs-01-backend-7jvt.onrender.com';

/**
 * Get the correct backend URL, remapping any retired hosts
 */
export function getBackendUrl() {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL || CURRENT_BACKEND;
  
  // Check if the configured URL is a retired host
  if (RETIRED_HOSTS[configuredUrl]) {
    console.warn(`Backend URL ${configuredUrl} is retired, using ${RETIRED_HOSTS[configuredUrl]}`);
    return RETIRED_HOSTS[configuredUrl];
  }
  
  return configuredUrl;
}

/**
 * Get the correct API base URL
 */
export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (configuredUrl) {
    // Check if it contains a retired host
    for (const [retired, current] of Object.entries(RETIRED_HOSTS)) {
      if (configuredUrl.includes(retired)) {
        const corrected = configuredUrl.replace(retired, current);
        console.warn(`API URL ${configuredUrl} contains retired host, using ${corrected}`);
        return corrected;
      }
    }
    return configuredUrl;
  }
  
  return `${getBackendUrl()}/api`;
}

/**
 * Fix any URLs that contain retired backend hosts
 */
export function fixBackendHost(url) {
  if (!url) return url;
  
  for (const [retired, current] of Object.entries(RETIRED_HOSTS)) {
    if (url.includes(retired)) {
      return url.replace(retired, current);
    }
  }
  
  return url;
}

export const BACKEND_URL = getBackendUrl();
export const API_BASE_URL = getApiBaseUrl();
