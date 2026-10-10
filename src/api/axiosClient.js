import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://employee-management-backend-rj6x.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token if present
axiosClient.interceptors.request.use((config) => {
  const user = localStorage.getItem('emply_user');
  if (user) {
    config.headers['X-User'] = user;
  }
  return config;
});

// Response interceptor - handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('emply_user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
