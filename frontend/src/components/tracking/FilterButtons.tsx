// FilterButtons component for filtering buses by status
import React from 'react';
import { FILTER_OPTIONS } from '../../constants';

interface FilterButtonsProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  filterStatus, 
  onFilterChange 
}) => {
  return (
    <div className="flex gap-2">
      {FILTER_OPTIONS.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterStatus === filter.key
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};