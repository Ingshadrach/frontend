let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Robustness: ensure it ends with /api
if (baseUrl && !baseUrl.endsWith('/api') && !baseUrl.endsWith('/api/')) {
    baseUrl = baseUrl.replace(/\/$/, '') + '/api';
}

const API_BASE_URL = baseUrl;
export default API_BASE_URL;
