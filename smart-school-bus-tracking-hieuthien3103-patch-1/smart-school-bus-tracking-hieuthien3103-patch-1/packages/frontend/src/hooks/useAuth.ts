// Authentication hook for Smart School Bus System
import { useState, useCallback } from 'react';
import type { User } from '../types';
import { DEMO_ACCOUNTS } from '../constants';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Find matching account
      const account = Object.entries(DEMO_ACCOUNTS).find(
        ([, creds]) => creds.username === username && creds.password === password
      );

      if (account) {
        const [role] = account;
        const userData: User = {
          id: 1, // or use a demo numeric id
          username: DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS].displayName,
          role: role as 'admin' | 'parent' | 'driver',
          ten: ''
        };
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
};