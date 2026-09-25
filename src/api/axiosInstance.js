import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Admin Token එකක් localStorage එකේ තිබුණොත් auto-attach වෙනවා
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;