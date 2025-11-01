// src/services/api/notificationService.ts
import client from './client';
import type { Notification } from '../../types';

const base = '/thongbao'; // hoặc '/notifications' tùy API backend

const getNotifications = async (): Promise<Notification[]> => {
  const res = await client.get(base);
    return res.data as Notification[];
};

const getNotificationsByDriver = async (ma_tai_xe: number): Promise<Notification[]> => {
  const res = await client.get(`${base}?ma_tai_xe=${ma_tai_xe}`);
    return res.data as Notification[];
};

const createNotification = async (payload: Partial<Notification>) => {
  const res = await client.post(base, payload);
  return res.data;
};

export default {
  getNotifications,
  getNotificationsByDriver,
  createNotification
};
