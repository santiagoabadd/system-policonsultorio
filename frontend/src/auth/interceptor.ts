import axios from 'axios';
import authService from './authService';

axios.interceptors.request.use((config) => {
  const token = authService.getCurrentUser();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});