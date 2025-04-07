import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from './authService';

const API_URL = 'http://localhost:8080';

interface UserData {
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
}

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: { userName: string; password: string }) => Promise<void>;
  register: (userData: UserData) => Promise<AuthResponse>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getCurrentUser();
      if (token) {
        try {
          const isValid = await authService.validateToken();
          if (isValid) {
            const userData = await authService.fetchCurrentUser();
            setUser(userData);
            setToken(token);
          } else {
            authService.logout();
          }
        } catch (error) {
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData: { userName: string; password: string }) => {
    try {
      const { token, user } = await authService.login(userData);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: UserData) => {
    try {
      const response = await authService.register(userData);
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const validateToken = async () => {
    try {
      return await authService.validateToken();
    } catch (error) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        validateToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


