// frontend/src/services/api/reportsService.ts
import axios from "axios";

// ✅ Các kiểu dữ liệu
export type PerformanceData = {
    month: string;        // Tháng, ví dụ "2025-11"
    trips: number;        // Số chuyến
    onTime: number;       // % đúng giờ
    fuel: number;         // Nhiên liệu (L)
    cost: number;         // Chi phí (VNĐ)
};

export type RouteAnalysis = {
    route: string;
    efficiency: number;   // % hiệu quả
    students: number;     // số học sinh
    distance: number;     // km
    cost: number;         // VNĐ
};

export type MaintenanceData = {
    type: string;         // loại bảo trì
    count: number;        // số lần bảo trì
    cost: number;         // chi phí tổng
    color: string;        // màu cho chart
};

export type DriverPerformance = {
    name: string;
    trips: number;
    onTime: number;
    rating: number;       // 1-5
    violations: number;
};

export type ReportStats = {
    totalTrips: number;
    activeStudents: number;
    totalRevenue: number;
    onTimePercentage: number;
    totalBuses: number;
    activeDrivers: number;
};

// ✅ Hàm helper xử lý response
const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
    promise.then(res => res.data)
        .catch(err => {
            console.error("❌ reportsService error:", err);
            throw err;
        });

// ✅ Export các API
export const reportsService = {
    getPerformanceData: (): Promise<PerformanceData[]> =>
        handleResponse<PerformanceData[]>(axios.get("/api/reports/performance")),

    getRouteAnalysis: (): Promise<RouteAnalysis[]> =>
        handleResponse<RouteAnalysis[]>(axios.get("/api/reports/routes")),

    getMaintenanceData: (): Promise<MaintenanceData[]> =>
        handleResponse<MaintenanceData[]>(axios.get("/api/reports/maintenance")),

    getDriverPerformance: (): Promise<DriverPerformance[]> =>
        handleResponse<DriverPerformance[]>(axios.get("/api/reports/drivers")),

    getReportStats: (): Promise<ReportStats> =>
        handleResponse<ReportStats>(axios.get("/api/reports/stats")),
};
