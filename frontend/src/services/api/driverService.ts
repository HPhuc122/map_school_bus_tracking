import { apiClient } from './client';

// Driver Types
export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  status: 'active' | 'inactive';
  bus_id?: number;
  created_at: string;
  updated_at: string;
}

// Driver Service
export const driverService = {
  // Get all drivers
  async getDrivers(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    return apiClient.get('/drivers', { params });
  },

  // Get driver by ID
  async getDriverById(id: number) {
    return apiClient.get(`/drivers/${id}`);
  },

  // Create new driver
  async createDriver(data: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) {
    return apiClient.post('/drivers', data);
  },

  // Update driver
  async updateDriver(id: number, data: Partial<Driver>) {
    return apiClient.put(`/drivers/${id}`, data);
  },

  // Delete driver
  async deleteDriver(id: number) {
    return apiClient.delete(`/drivers/${id}`);
  }
};

export default driverService;