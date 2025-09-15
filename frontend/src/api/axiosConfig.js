import axios from 'axios';

// Create a new instance of axios with a custom configuration
const api = axios.create({
  // Use the environment variable for the live URL, or localhost for development
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// This 'interceptor' adds the auth token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
