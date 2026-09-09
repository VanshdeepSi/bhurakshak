// Centralized Environment-Aware API Configuration
// In local development: defaults to http://localhost:8000/api
// In production on Vercel: reads VITE_API_URL or relative /api

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
  return '/api';
};

export const API_BASE = getApiBase();
