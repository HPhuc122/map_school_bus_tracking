
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Route } from '../types';
import { routeService } from '../services/api/routeService';

interface RoutesContextType {
  routes: Route[];
  fetchRoutes: () => Promise<void>;
  addRoute: (route: Omit<Route, 'ma_tuyen'>) => Promise<void>;
  updateRoute: (ma_tuyen: number, route: Partial<Route>) => Promise<void>;
  deleteRoute: (ma_tuyen: number) => Promise<void>;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const fetchRoutes = useCallback(async () => {
    const data = await routeService.getRoutes();
    setRoutes(data);
  }, []);

  const addRoute = useCallback(async (route: Omit<Route, 'ma_tuyen'>) => {
    await routeService.createRoute(route);
    await fetchRoutes();
  }, [fetchRoutes]);

  const updateRoute = useCallback(async (ma_tuyen: number, route: Partial<Route>) => {
    await routeService.updateRoute(ma_tuyen, route);
    await fetchRoutes();
  }, [fetchRoutes]);

  const deleteRoute = useCallback(async (ma_tuyen: number) => {
    await routeService.deleteRoute(ma_tuyen);
    await fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return (
    <RoutesContext.Provider value={{ routes, fetchRoutes, addRoute, updateRoute, deleteRoute }}>
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = () => {
  const context = useContext(RoutesContext);
  if (!context) throw new Error('useRoutes must be used within a RoutesProvider');
  return context;
};
