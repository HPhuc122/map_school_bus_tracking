// frontend/src/services/api/scheduleService.ts
import axios from "axios";

export type Schedule = {
    ma_chuyen: number;
    ma_tuyen: number;
    startTime: string;
    endTime: string;
};

const scheduleService = {
    getScheduleByBus: (busId: string): Promise<Schedule> =>
        axios.get(`/api/buses/${busId}/schedule`).then(res => res.data),

    getAllSchedules: (): Promise<Schedule[]> =>
        axios.get("/api/schedules").then(res => res.data),
};

export default scheduleService;
