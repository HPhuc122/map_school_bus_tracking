// src/contexts/NotificationsContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Notification } from '../types';
import notificationService from '../services/api/notificationService';

interface NotificationsContextType {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotifications([]);
    }
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  useEffect(() => {
    // initial fetch
    fetchNotifications();

    // polling every 15s (or use socket for realtime)
    const id = setInterval(fetchNotifications, 15000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, fetchNotifications, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};
