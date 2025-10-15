import { apiClient } from './client';

// Route Types
export interface Route {
  id: number;
  name: string;
  description?: string;
  start_location: string;
  end_location: string;
  stops: RouteStop[];
  school_id?: number;
  created_at: string;
  updated_at: string;
}

export interface RouteStop {
  id: number;
  route_id: number;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  pickup_time?: string;
  dropoff_time?: string;
}

// Route Service
export const routeService = {
  // Get all routes
  async getRoutes(params?: {
    page?: number;
    limit?: number;
    schoolId?: number;
  }) {
    return apiClient.get('/routes', { params });
  },

  // Get route by ID
  async getRouteById(id: number) {
    return apiClient.get(`/routes/${id}`);
  },

  // Create new route
  async createRoute(data: Omit<Route, 'id' | 'created_at' | 'updated_at'>) {
    return apiClient.post('/routes', data);
  },

  // Update route
  async updateRoute(id: number, data: Partial<Route>) {
    return apiClient.put(`/routes/${id}`, data);
  },

  // Delete route
  async deleteRoute(id: number) {
    return apiClient.delete(`/routes/${id}`);
  },

  // Get route stops
  async getRouteStops(routeId: number) {
    return apiClient.get(`/routes/${routeId}/stops`);
  }
};

export default routeService;