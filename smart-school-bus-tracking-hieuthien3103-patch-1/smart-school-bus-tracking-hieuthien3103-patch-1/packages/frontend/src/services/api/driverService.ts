
import { apiClient } from './client';
import type { Driver } from '../../types';

// DTOs for create/update
export type CreateDriverDto = Omit<Driver, 'ma_tai_xe'>;
export type UpdateDriverDto = Partial<CreateDriverDto>;

export const driverService = {
  // Get all drivers
  async getDrivers(params?: {
    page?: number;
    limit?: number;
    trang_thai?: 'san_sang' | 'dang_chay' | 'nghi';
  }): Promise<Driver[]> {
    return apiClient.get<Driver[]>('/taixe', { params });
  },

  // Get driver by ID
  async getDriverById(ma_tai_xe: number): Promise<Driver> {
    return apiClient.get<Driver>(`/taixe/${ma_tai_xe}`);
  },

  // Create new driver
  async createDriver(data: CreateDriverDto): Promise<Driver> {
    return apiClient.post<Driver>('/taixe', data);
  },

  // Update driver
  async updateDriver(ma_tai_xe: number, data: UpdateDriverDto): Promise<Driver> {
    return apiClient.put<Driver>(`/taixe/${ma_tai_xe}`, data);
  },

  // Delete driver
  async deleteDriver(ma_tai_xe: number): Promise<void> {
    return apiClient.delete<void>(`/taixe/${ma_tai_xe}`);
  }
};

export default driverService;