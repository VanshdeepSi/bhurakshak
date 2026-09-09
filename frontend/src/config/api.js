// Centralized Environment-Aware API Configuration
// Automatically connects to live Render backend in production and localhost:8000 in dev

const RENDER_BACKEND_URL = 'https://bhurakshak-vjq5.onrender.com';

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
  }
  // Production fallback directly to live Render backend
  return `${RENDER_BACKEND_URL}/api`;
};

export const API_BASE = getApiBase();
