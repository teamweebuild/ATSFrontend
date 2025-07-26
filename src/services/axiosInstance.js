import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ats-final-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
