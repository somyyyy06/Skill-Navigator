/**
 * Get the API base URL for backend calls
 * Uses VITE_API_URL environment variable, defaults to current origin
 */
export function getApiUrl(): string {
  // Check for Vite environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use localhost:5000
  if (import.meta.env.DEV) {
    return 'https://skill-navigator-r43j.onrender.com';
  }
  
  // In production, use current origin
  return window.location.origin;
}

/**
 * Build a full API URL from a path
 * @param path The API path (e.g., '/api/auth/login')
 * @returns Full URL with base API URL
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiUrl();
  return `${baseUrl}${path}`;
}
