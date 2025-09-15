import axios from 'axios';

//forproduction
// const api = axios.create({
//   baseURL: 'http://localhost:5001/api', 
// });


//development
const api = axios.create({
  baseURL: '/api',
});

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
