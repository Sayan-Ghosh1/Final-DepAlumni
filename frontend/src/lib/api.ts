/**
 * API Configuration and Fetch Handler for Taki Alumni Portal
 * 
 * Supports seamless deployment where Frontend is hosted on Vercel
 * and Backend is hosted on Render.
 * 
 * - When VITE_API_URL is set (e.g. in Vercel: https://taki-backend.onrender.com),
 *   all relative /api requests are automatically routed to the Render backend URL.
 * - When running locally or when VITE_API_URL is not set, requests use relative /api paths
 *   which are proxied by Vite dev server to http://localhost:5000.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

// Automatically patch window.fetch so all existing fetch('/api/...') calls
// seamlessly target the deployed Render backend with ZERO component changes.
if (typeof window !== 'undefined' && API_BASE_URL) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string') {
      if (input.startsWith('/api')) {
        input = `${API_BASE_URL}${input}`;
      }
    } else if (input instanceof URL) {
      if (input.pathname.startsWith('/api') && input.origin === window.location.origin) {
        input = new URL(`${API_BASE_URL}${input.pathname}${input.search}`);
      }
    } else if (typeof Request !== 'undefined' && input instanceof Request) {
      try {
        const parsed = new URL(input.url);
        if (parsed.pathname.startsWith('/api') && parsed.origin === window.location.origin) {
          input = new Request(`${API_BASE_URL}${parsed.pathname}${parsed.search}`, init || input);
        }
      } catch {
        // Fallback to original input
      }
    }
    return originalFetch(input, init);
  };
}
