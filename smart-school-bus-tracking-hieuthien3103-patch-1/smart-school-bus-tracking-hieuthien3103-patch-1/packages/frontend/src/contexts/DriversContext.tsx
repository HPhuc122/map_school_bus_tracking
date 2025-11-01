
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Driver } from '../types';
import driverService from '../services/api/driverService';

interface DriversContextType {
  drivers: Driver[];
  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'ma_tai_xe'>) => Promise<void>;
  updateDriver: (ma_tai_xe: number, driver: Partial<Driver>) => Promise<void>;
  deleteDriver: (ma_tai_xe: number) => Promise<void>;
}

const DriversContext = createContext<DriversContextType | undefined>(undefined);

export const DriversProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const fetchDrivers = useCallback(async () => {
  const data = await driverService.getDrivers();
  setDrivers(data);
  }, []);

  const addDriver = useCallback(async (driver: Omit<Driver, 'ma_tai_xe'>) => {
    await driverService.createDriver(driver);
    await fetchDrivers();
  }, [fetchDrivers]);

  const updateDriver = useCallback(async (ma_tai_xe: number, driver: Partial<Driver>) => {
    await driverService.updateDriver(ma_tai_xe, driver);
    await fetchDrivers();
  }, [fetchDrivers]);

  const deleteDriver = useCallback(async (ma_tai_xe: number) => {
    await driverService.deleteDriver(ma_tai_xe);
    await fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return (
    <DriversContext.Provider value={{ drivers, fetchDrivers, addDriver, updateDriver, deleteDriver }}>
      {children}
    </DriversContext.Provider>
  );
};

export const useDrivers = () => {
  const context = useContext(DriversContext);
  if (!context) throw new Error('useDrivers must be used within a DriversProvider');
  return context;
};
