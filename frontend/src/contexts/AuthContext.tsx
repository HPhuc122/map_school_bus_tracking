import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { apiClient } from '../services/api/client';
import { ENDPOINTS } from '../services/api/config';

// Auth types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  
  // Permissions
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          apiClient.setToken(storedToken);
          
          // Verify token is still valid
          await verifyToken();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Verify token validity
  const verifyToken = async () => {
    try {
      const userProfile = await apiClient.get<User>(ENDPOINTS.AUTH.PROFILE);
      setUser(userProfile);
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuth();
    }
  };

  // Clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    apiClient.clearToken();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      const { user: authUser, token: authToken, refreshToken } = response;
      
      // Update state
      setUser(authUser);
      setToken(authToken);
      
      // Update API client
      apiClient.setToken(authToken);
      
      // Store in localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      localStorage.setItem('refresh_token', refreshToken);
      
      console.log('Login successful:', authUser.name);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [clearAuth]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH.REFRESH,
        { refreshToken: storedRefreshToken }
      );
      
      const { user: authUser, token: newToken, refreshToken: newRefreshToken } = response;
      
      // Update state and storage
      setUser(authUser);
      setToken(newToken);
      apiClient.setToken(newToken);
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      localStorage.setItem('refresh_token', newRefreshToken);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      throw error;
    }
  }, [clearAuth]);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const updatedUser = await apiClient.put<User>(
        ENDPOINTS.AUTH.PROFILE,
        updates
      );
      
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }, []);

  // Permission checks
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  // Auto token refresh
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        logout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, [token, refreshToken, logout]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    logout,
    refreshToken,
    updateProfile,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};