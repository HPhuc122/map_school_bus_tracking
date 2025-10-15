import { apiClient } from './client';

// Bus Types
export interface Bus {
  id: number;
  license_plate: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance' | 'emergency';
  driver_id?: number;
  route_id?: number;
  school_id?: number;
  created_at: string;
  updated_at: string;
}

export interface BusLocation {
  id: number;
  bus_id: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

// Bus Service
export const busService = {
  // Get all buses
  async getBuses(params?: {
    page?: number;
    limit?: number;
    status?: string;
    schoolId?: number;
  }) {
    return apiClient.get('/buses', { params });
  },

  // Get bus by ID
  async getBusById(id: number) {
    return apiClient.get(`/buses/${id}`);
  },

  // Create new bus
  async createBus(data: Omit<Bus, 'id' | 'created_at' | 'updated_at'>) {
    return apiClient.post('/buses', data);
  },

  // Update bus
  async updateBus(id: number, data: Partial<Bus>) {
    return apiClient.put(`/buses/${id}`, data);
  },

  // Delete bus
  async deleteBus(id: number) {
    return apiClient.delete(`/buses/${id}`);
  },

  // Get bus location
  async getBusLocation(busId: number) {
    return apiClient.get(`/tracking/bus/${busId}`);
  },

  // Update bus location (for real-time tracking)
  async updateBusLocation(data: {
    busId: number;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    driverId?: number;
  }) {
    return apiClient.post('/tracking/location', data);
  },

  // Update bus status
  async updateBusStatus(data: {
    busId: number;
    status: string;
    message?: string;
    driverId?: number;
  }) {
    return apiClient.post('/tracking/status', data);
  },

  // Send emergency alert
  async sendEmergencyAlert(data: {
    busId: number;
    message: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    latitude?: number;
    longitude?: number;
    driverId?: number;
  }) {
    return apiClient.post('/tracking/emergency', data);
  }
};

export default busService;