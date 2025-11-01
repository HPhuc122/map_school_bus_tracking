
import { apiClient } from './client';
import type { Schedule, ScheduleStatus } from '../../types';

export type CreateScheduleDto = Omit<Schedule, 'ma_lich'>;
export type UpdateScheduleDto = Partial<CreateScheduleDto>;

export const scheduleService = {
  // Get all schedules
  async getSchedules(params?: {
    page?: number;
    limit?: number;
    trang_thai_lich?: ScheduleStatus;
    ma_tuyen?: number;
    ma_xe?: number;
    ma_tai_xe?: number;
    ngay_chay?: string;
  }): Promise<Schedule[]> {
    return apiClient.get<Schedule[]>('/lichtrinh', { params });
  },

  // Get schedule by ID
  async getScheduleById(ma_lich: number): Promise<Schedule> {
    return apiClient.get<Schedule>(`/lichtrinh/${ma_lich}`);
  },

  // Create new schedule
  async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    return apiClient.post<Schedule>('/lichtrinh', data);
  },

  // Update schedule
  async updateSchedule(ma_lich: number, data: UpdateScheduleDto): Promise<Schedule> {
    return apiClient.put<Schedule>(`/lichtrinh/${ma_lich}`, data);
  },

  // Delete schedule
  async deleteSchedule(ma_lich: number): Promise<void> {
    return apiClient.delete<void>(`/lichtrinh/${ma_lich}`);
  }
};
