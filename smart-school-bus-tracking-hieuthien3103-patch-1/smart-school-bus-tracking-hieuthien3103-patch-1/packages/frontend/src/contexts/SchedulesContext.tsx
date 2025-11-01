
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Schedule } from '../types';
import { scheduleService } from '../services/api/scheduleService';

interface SchedulesContextType {
  schedules: Schedule[];
  fetchSchedules: () => Promise<void>;
  addSchedule: (schedule: Omit<Schedule, 'ma_lich_trinh'>) => Promise<void>;
  updateSchedule: (ma_lich_trinh: number, schedule: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (ma_lich_trinh: number) => Promise<void>;
}

const SchedulesContext = createContext<SchedulesContextType | undefined>(undefined);

export const SchedulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchSchedules = useCallback(async () => {
    const data = await scheduleService.getSchedules();
    setSchedules(data);
  }, []);

  const addSchedule = useCallback(async (schedule: Omit<Schedule, 'ma_lich_trinh'>) => {
    await scheduleService.createSchedule(schedule);
    await fetchSchedules();
  }, [fetchSchedules]);

  const updateSchedule = useCallback(async (ma_lich_trinh: number, schedule: Partial<Schedule>) => {
    await scheduleService.updateSchedule(ma_lich_trinh, schedule);
    await fetchSchedules();
  }, [fetchSchedules]);

  const deleteSchedule = useCallback(async (ma_lich_trinh: number) => {
    await scheduleService.deleteSchedule(ma_lich_trinh);
    await fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return (
    <SchedulesContext.Provider value={{ schedules, fetchSchedules, addSchedule, updateSchedule, deleteSchedule }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => {
  const context = useContext(SchedulesContext);
  if (!context) throw new Error('useSchedules must be used within a SchedulesProvider');
  return context;
};
