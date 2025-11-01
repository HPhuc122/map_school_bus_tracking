
import { apiClient } from './client';
import type { Stop, StopType } from '../../types';

export type CreateStopDto = Omit<Stop, 'ma_tram'>;
export type UpdateStopDto = Partial<CreateStopDto>;

export const stopService = {
    // Get all stops
    async getStops(params?: {
        page?: number;
        limit?: number;
        loai_tram?: StopType;
        search?: string;
    }): Promise<Stop[]> {
        return apiClient.get<Stop[]>('/tramxe', { params });
    },

    // Get stop by ID
    async getStopById(ma_tram: number): Promise<Stop> {
        return apiClient.get<Stop>(`/tramxe/${ma_tram}`);
    },

    // Create new stop
    async createStop(data: CreateStopDto): Promise<Stop> {
        return apiClient.post<Stop>('/tramxe', data);
    },

    // Update stop
    async updateStop(ma_tram: number, data: UpdateStopDto): Promise<Stop> {
        return apiClient.put<Stop>(`/tramxe/${ma_tram}`, data);
    },

    // Delete stop
    async deleteStop(ma_tram: number): Promise<void> {
        return apiClient.delete<void>(`/tramxe/${ma_tram}`);
    }
};