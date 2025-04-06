import axios from 'axios';

const API_URL = 'http://localhost:8080';


interface UserData {
    userName: string;
    firstName?:string;
    lastName?:string;
    email?: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user?: {
    id: string;
    userName: string;
    firstName:string;
    lastName:string;
    email: string;
  };
}


const register = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/api/user/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Registration failed' };
    }
    throw { message: 'Registration failed' };
  }
};


const login = async (userData: UserData): Promise<string> => {
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


const logout = (): void => {
  localStorage.removeItem('token');
};


const getCurrentUser = (): string | null => {
  return localStorage.getItem('token');
};


const isAuthenticated = (): boolean => {
  const token = getCurrentUser();
  return !!token;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};