import { BACKEND_URL } from '../config/backend';

/**
 * Wake up the backend server (useful for services that sleep on inactivity)
 * This should be called early in the app lifecycle
 */
export const wakeUpBackend = async () => {
  try {
    console.log('🔄 Waking up backend server...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('✅ Backend server is awake');
      return true;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏱️ Backend wake-up timeout (server may be starting)');
    } else {
      console.log('⚠️ Backend wake-up failed:', error.message);
    }
  }
  return false;
};

/**
 * Prefetch critical data to warm up the backend
 */
export const prefetchCriticalData = async () => {
  try {
    // Fetch about data (usually needed first)
    await fetch(`${BACKEND_URL}/api/about`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('✅ Critical data prefetched');
  } catch (error) {
    console.log('⚠️ Prefetch failed:', error.message);
  }
};
