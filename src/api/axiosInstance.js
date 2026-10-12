import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

// Admin Token එකක් localStorage එකේ තිබුණොත් auto-attach වෙනවා
// GET requests වලට cache-buster timestamp එකක් attach කර browser stale caching වළක්වයි
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (req.method === 'get') {
    req.params = {
      ...req.params,
      _t: Date.now(),
    };
  }

  return req;
});

export default API;