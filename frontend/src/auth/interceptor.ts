import axios from 'axios';
import {getCurrentUserToken} from './authService';

axios.interceptors.request.use((config) => {
  const token = getCurrentUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});