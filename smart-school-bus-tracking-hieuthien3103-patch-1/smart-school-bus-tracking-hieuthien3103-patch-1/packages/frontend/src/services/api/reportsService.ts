import { apiClient } from './client';

// Report Types
export interface PerformanceData {
  month: string;
  trips: number;
  onTime: number;
  students: number;
  fuel: number;
  cost: number;
}

export interface RouteAnalysis {
  route: string;
  efficiency: number;
  cost: number;
  distance: number;
  students: number;
}

export interface MaintenanceData {
  type: string;
  count: number;
  cost: number;
  color: string;
}

export interface DriverPerformance {
  name: string;
  trips: number;
  onTime: number;
  rating: number;
  violations: number;
}

export interface ReportStats {
  totalTrips: number;
  activeStudents: number;
  totalRevenue: number;
  onTimePercentage: number;
  totalBuses: number;
  activeDrivers: number;
}

// Reports Service
export const reportsService = {
  // Get performance data
  async getPerformanceData(params?: {
    startDate?: string;
    endDate?: string;
    schoolId?: number;
  }): Promise<PerformanceData[]> {
    try {
      const response = await apiClient.get('/reports/performance', { params });
      return (response as any).data || [];
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // No fallback mock data - let error bubble up
      throw error;
    }
  },

  // Get route analysis
  async getRouteAnalysis(params?: {
    schoolId?: number;
    period?: string;
  }): Promise<RouteAnalysis[]> {
    try {
      const response = await apiClient.get('/reports/routes', { params });
      return (response as any).data || [];
    } catch (error) {
      console.error('Error fetching route analysis:', error);
      // No fallback mock data - let error bubble up
      throw error;
    }
  },

  // Get maintenance data
  async getMaintenanceData(params?: {
    schoolId?: number;
    period?: string;
  }): Promise<MaintenanceData[]> {
    try {
      const response = await apiClient.get('/reports/maintenance', { params });
      return (response as any).data || [];
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      // No fallback mock data - let error bubble up
      throw error;
    }
  },

  // Get driver performance
  async getDriverPerformance(params?: {
    schoolId?: number;
    period?: string;
  }): Promise<DriverPerformance[]> {
    try {
      const response = await apiClient.get('/reports/drivers', { params });
      return (response as any).data || [];
    } catch (error) {
      console.error('Error fetching driver performance:', error);
      // No fallback mock data - let error bubble up
      throw error;
    }
  },

  // Get report statistics
  async getReportStats(): Promise<ReportStats> {
    try {
      // Try to get real data from multiple endpoints
      const [busesResponse, driversResponse, studentsResponse] = await Promise.allSettled([
        apiClient.get('/buses'),
        apiClient.get('/drivers'), 
        apiClient.get('/students')
      ]);

      const buses = busesResponse.status === 'fulfilled' ? (busesResponse.value as any)?.data?.length || 0 : 0;
      const drivers = driversResponse.status === 'fulfilled' ? (driversResponse.value as any)?.data?.length || 0 : 0;
      const students = studentsResponse.status === 'fulfilled' ? (studentsResponse.value as any)?.data?.length || 0 : 0;

      return {
        totalTrips: 0, // TODO: Get from API if available
        activeStudents: students,
        totalRevenue: 0, // TODO: Get from API if available
        onTimePercentage: 0, // TODO: Get from API if available
        totalBuses: buses,
        activeDrivers: drivers
      };
    } catch (error) {
      console.error('Error fetching report stats:', error);
      // No fallback mock data - let error bubble up
      throw error;
    }
  }
};

export default reportsService;