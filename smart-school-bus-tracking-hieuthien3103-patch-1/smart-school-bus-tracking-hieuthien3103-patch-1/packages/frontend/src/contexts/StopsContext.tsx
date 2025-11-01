
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Stop } from '../types';
import { stopService } from '../services/api/stopService';

interface StopsContextType {
    stops: Stop[];
    fetchStops: () => Promise<void>;
    addStop: (stop: Omit<Stop, 'ma_diem_don'>) => Promise<void>;
    updateStop: (ma_diem_don: number, stop: Partial<Stop>) => Promise<void>;
    deleteStop: (ma_diem_don: number) => Promise<void>;
}

const StopsContext = createContext<StopsContextType | undefined>(undefined);

export const StopsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stops, setStops] = useState<Stop[]>([]);

    const fetchStops = useCallback(async () => {
        const data = await stopService.getStops();
        setStops(data);
    }, []);

    const addStop = useCallback(async (stop: Omit<Stop, 'ma_diem_don'>) => {
        await stopService.createStop(stop);
        await fetchStops();
    }, [fetchStops]);

    const updateStop = useCallback(async (ma_diem_don: number, stop: Partial<Stop>) => {
        await stopService.updateStop(ma_diem_don, stop);
        await fetchStops();
    }, [fetchStops]);

    const deleteStop = useCallback(async (ma_diem_don: number) => {
        await stopService.deleteStop(ma_diem_don);
        await fetchStops();
    }, [fetchStops]);

    useEffect(() => {
        fetchStops();
    }, [fetchStops]);

    return (
        <StopsContext.Provider value={{ stops, fetchStops, addStop, updateStop, deleteStop }}>
            {children}
        </StopsContext.Provider>
    );
};

export const useStops = () => {
    const context = useContext(StopsContext);
    if (!context) throw new Error('useStops must be used within a StopsProvider');
    return context;
};