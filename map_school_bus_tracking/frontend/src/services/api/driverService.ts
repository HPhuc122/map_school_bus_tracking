// frontend/src/services/api/driverService.ts
import axios from "axios";

export type Driver = {
    ma_tai_xe: number;
    name: string;
    trips: number;
    onTime: number;
    rating: number;
    violations: number;
};

export const driverService = {
    getDriverById: (id: string): Promise<Driver> =>
        axios.get(`/api/drivers/${id}`).then(res => res.data),

    getAllDrivers: (): Promise<Driver[]> =>
        axios.get("/api/drivers").then(res => res.data),
};
