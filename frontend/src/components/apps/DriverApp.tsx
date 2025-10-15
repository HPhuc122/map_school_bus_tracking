// DriverApp component - Driver-specific interface
import React from 'react';
import DriverDashboard from '../dashboard/DriverDashboard';
import { useAppData } from '../../contexts/AppDataContext';
import type { User } from '../../types';

interface DriverAppProps {
  user: User;
  onLogout: () => void;
}

export const DriverApp: React.FC<DriverAppProps> = ({ user, onLogout }) => {
  const { busLocations, driversData } = useAppData();

  // Find driver data by matching user name with driver name
  // If not found, use first driver as fallback for demo
  const currentDriver = driversData.find(driver =>
    driver.name.toLowerCase().includes(user.name.toLowerCase()) ||
    user.name.toLowerCase().includes(driver.name.toLowerCase())
  ) || driversData[0]; // Use first driver as fallback

  // Find corresponding bus for this driver
  const currentBus = busLocations.find(bus => bus.driver === currentDriver?.name);

  // Create proper driverData object
  const driverData = {
    id: currentDriver?.id || 1,
    name: currentDriver?.name || user.name,
    busId: currentBus?.id || 1,
    route: currentBus?.route || 'Tuyến A1',
    license: currentDriver?.license,
    phone: currentDriver?.phone,
    experience: currentDriver?.experience
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
                Xe {currentBus?.busNumber || 'BS001'} - {driverData.route}
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