import { useRoutes } from '../../contexts/RoutesContext';
// DriverApp component - Driver-specific interface
import React from 'react';
import DriverDashboard from '../dashboard/DriverDashboard';
import { useDrivers } from '../../contexts/DriversContext';
import { useBuses } from '../../contexts/BusesContext';
import type { User } from '../../types';

interface DriverAppProps {
  user: User;
  onLogout: () => void;
}


export const DriverApp: React.FC<DriverAppProps> = ({ user, onLogout }) => {
  const { drivers } = useDrivers();
  const { buses } = useBuses();
  // const { routes } = useRoutes();

  // Find driver data by matching user.ten with driver.ho_ten
  const currentDriver = drivers.find((driver: any) =>
    driver.ho_ten && user.ten && (
      driver.ho_ten.toLowerCase().includes(user.ten.toLowerCase()) ||
      user.ten.toLowerCase().includes(driver.ho_ten.toLowerCase())
    )
  ) || drivers[0];

  // Find corresponding bus for this driver
  const currentBus = buses.find((bus: any) => bus.ma_tai_xe === currentDriver?.ma_tai_xe);

  // Get route name from bus (if available) - fallback to '-'
  let routeName = '-';
  // If bus has a related route (custom logic, e.g. via schedules or assignment), you can add here
  // For now, just fallback

  // Map backend fields to legacy driverData props for DriverDashboard compatibility
  const driverData = {
    id: currentDriver?.ma_tai_xe || 1,
    name: currentDriver?.ho_ten || user.ten,
    busId: currentBus?.ma_xe || 1,
    route: routeName,
    license: currentDriver?.so_gplx,
    phone: currentDriver?.so_dien_thoai,
    experience: undefined,
    avatar: undefined
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Smart School Bus - Tài xế</h1>
              <p className="text-sm text-gray-600">Xin chào, {driverData.name}</p>
              <p className="text-xs text-gray-500">
                Xe {currentBus?.bien_so || 'BS001'} - {driverData.route}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
  <DriverDashboard driverData={driverData} />
    </div>
  );
};