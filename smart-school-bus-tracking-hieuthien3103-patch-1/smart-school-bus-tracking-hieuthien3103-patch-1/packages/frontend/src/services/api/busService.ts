import { apiClient } from "./client";
import type {
  Bus,
  BusLocation,
  BusStatus,
  BusTrackingData,
} from "../../types";

export type CreateBusDto = Omit<Bus, "ma_xe">;
export type UpdateBusDto = Partial<CreateBusDto>;

const busService = {
  // Get all buses
  async getBuses(params?: {
    page?: number;
    limit?: number;
    trang_thai?: BusStatus;
    ma_tai_xe?: number;
  }): Promise<Bus[]> {
    const res = await apiClient.get("/xebuyt", { params });
    return res.data;
  },

  // Get bus by ID
  async getBusById(ma_xe: number): Promise<Bus> {
    const res = await apiClient.get(`/xebuyt/${ma_xe}`);
    return res.data;
  },

  // Create new bus
  async createBus(data: CreateBusDto): Promise<Bus> {
    const res = await apiClient.post("/xebuyt", data);
    return res.data;
  },

  // Update bus
  async updateBus(ma_xe: number, data: UpdateBusDto): Promise<Bus> {
    const res = await apiClient.put(`/xebuyt/${ma_xe}`, data);
    return res.data;
  },

  // Delete bus
  async deleteBus(ma_xe: number): Promise<void> {
    await apiClient.delete(`/xebuyt/${ma_xe}`);
  },

  // Get bus location history / latest positions for a bus
  async getBusLocation(ma_xe: number): Promise<BusLocation[]> {
    const res = await apiClient.get(`/vitrixe`, { params: { ma_xe } });
    return res.data;
  },

  // If backend provides tracking data endpoint (optional)
  async getRealtimeTracking(params?: { schoolId?: number }): Promise<BusTrackingData[]> {
    const res = await apiClient.get("/tracking", { params });
    return res.data;
  },
};

export default busService;
export { busService };