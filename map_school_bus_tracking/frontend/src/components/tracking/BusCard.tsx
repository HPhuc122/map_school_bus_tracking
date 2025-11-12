// BusCard component for displaying individual bus information
import React from 'react';
import { Bus } from 'lucide-react';
import type { BusLocation } from '../../types';

interface BusCardProps {
  bus: BusLocation;
  isSelected: boolean;
  onSelect: (busId: number) => void;
  getStatusColor: (status: string) => string;
}

export const BusCard: React.FC<BusCardProps> = ({ 
  bus, 
  isSelected, 
  onSelect, 
  getStatusColor 
}) => {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}
      onClick={() => onSelect(bus.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{bus.busNumber}</h4>
            <p className="text-sm text-gray-600">{bus.route}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bus.status)}`}>
          {bus.status}
        </span>
      </div>
    </div>
  );
};