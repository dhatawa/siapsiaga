const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const developmentFallback = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : '';

if (!configuredBaseUrl && !developmentFallback) {
  throw new Error(
    'Set VITE_API_BASE_URL to the published backend URL, including /api.'
  );
}

export const API_BASE_URL = (configuredBaseUrl || developmentFallback)
  .replace(/\/+$/, '');
