
import { apiClient } from './client';
import type { Route, RouteDetail } from '../../types';

export type CreateRouteDto = Omit<Route, 'ma_tuyen'>;
export type UpdateRouteDto = Partial<CreateRouteDto>;

export const routeService = {
  // Get all routes
  async getRoutes(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Route[]> {
    return apiClient.get<Route[]>('/tuyenduong', { params });
  },

  // Get route by ID
  async getRouteById(ma_tuyen: number): Promise<Route> {
    return apiClient.get<Route>(`/tuyenduong/${ma_tuyen}`);
  },

  // Create new route
  async createRoute(data: CreateRouteDto): Promise<Route> {
    return apiClient.post<Route>('/tuyenduong', data);
  },

  // Update route
  async updateRoute(ma_tuyen: number, data: UpdateRouteDto): Promise<Route> {
    return apiClient.put<Route>(`/tuyenduong/${ma_tuyen}`, data);
  },

  // Delete route
  async deleteRoute(ma_tuyen: number): Promise<void> {
    return apiClient.delete<void>(`/tuyenduong/${ma_tuyen}`);
  },

  // Get route details (stops in route)
  async getRouteDetails(ma_tuyen: number): Promise<RouteDetail[]> {
    return apiClient.get<RouteDetail[]>(`/chitiettuyenduong?ma_tuyen=${ma_tuyen}`);
  }
};

export default routeService;