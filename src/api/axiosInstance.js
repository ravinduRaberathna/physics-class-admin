import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Admin Token auto-attach
// GET requests use a unique timestamp parameter to guarantee 100% live data without CORS preflight issues
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (req.method && req.method.toLowerCase() === 'get') {
    req.params = req.params || {};
    req.params._t = Date.now();
  }

  return req;
});

export default API;