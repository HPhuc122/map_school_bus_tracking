import apiClient from './client';
import type { PickupDropoffLog, ApiResponse } from '../../types';

const pickupDropoffService = {
  // Lấy nhật ký đón trả theo mã lịch trình
  async getLogsBySchedule(ma_lich: number): Promise<ApiResponse<PickupDropoffLog[]>> {
    return apiClient.get(`/pickup-dropoff-logs?scheduleId=${ma_lich}`);
  },

  // Cập nhật trạng thái đón/trả học sinh
  async updateLogStatus(ma_nhat_ky: number, data: Partial<PickupDropoffLog>): Promise<ApiResponse<PickupDropoffLog>> {
    return apiClient.put(`/pickup-dropoff-logs/${ma_nhat_ky}`, data);
  }
};

export default pickupDropoffService;
