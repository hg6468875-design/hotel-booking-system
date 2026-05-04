import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stayluxe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => {
    const ct = r.headers?.['content-type'] || '';
    if (typeof r.data === 'string' && !ct.includes('application/json')) {
      return Promise.reject(new Error('API returned non-JSON response — check VITE_API_URL'));
    }
    return r;
  },
  (err) => Promise.reject(err)
);

export default api;
