import axios from 'axios';

const API_URL = 'http://localhost:8080';

interface UserData {
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  role: string;
}

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_URL
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 501) {
      console.error('Service not implemented:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export const login = async (userData: UserData): Promise<string> => {
  try {
    const response = await axios.post<string>(`${API_URL}/api/user/token`, userData);
    const token = response.data;
    localStorage.setItem('token', token); 
    
    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Login failed' };
    }
    throw { message: 'Login failed' };
  }
};

export const register = async (userData: UserData): Promise<User> => {
  try {
    const response = await api.post<User>('/api/user/register', userData);
  
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Registration failed' };
    }
    throw { message: 'Registration failed' };
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem('token');
};

export const validateToken = async (): Promise<boolean> => {
  const token = getCurrentUser();
  if (!token) return false;

  try {
    const response = await api.get(`/api/user/validate`, {
      params: { token }, // Agrega el token como parámetro de consulta
    });
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 501) {
      console.warn('Token validation service not implemented - proceeding with token');
      return true; // O false dependiendo de tus requisitos
    }
    return false;
  }
};

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/api/user/user');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  validateToken,
  fetchCurrentUser
};