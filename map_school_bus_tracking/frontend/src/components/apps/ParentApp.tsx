// ParentApp component - Simplified parent view for tracking children
import React from 'react';
import ParentDashboard from '../dashboard/ParentDashboard';
import type { User } from '../../types';

interface ParentAppProps {
  user: User;
  onLogout: () => void;
}

export const ParentApp: React.FC<ParentAppProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Smart School Bus - Phụ huynh</h1>
              <p className="text-sm text-gray-600">Xin chào, {user?.name}</p>
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
      <ParentDashboard />
    </div>
  );
};