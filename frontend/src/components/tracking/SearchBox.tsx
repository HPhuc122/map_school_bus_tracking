// SearchBox component for searching buses
import React from 'react';
import { Search, X, Bus } from 'lucide-react';
import type { BusLocation } from '../../types';

interface SearchBoxProps {
  searchQuery: string;
  searchResults: BusLocation[];
  showSearchResults: boolean;
  onSearchChange: (query: string) => void;
  onSearchSelect: (bus: BusLocation) => void;
  onClearSearch: () => void;
  onToggleSearchResults: (show: boolean) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  searchResults,
  showSearchResults,
  onSearchChange,
  onSearchSelect,
  onClearSearch,
  onToggleSearchResults,
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Tìm theo tuyến, xe, hoặc tài xế..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => onToggleSearchResults(true)}
          onBlur={() => setTimeout(() => onToggleSearchResults(false), 200)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search Dropdown */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((bus) => (
            <div
              key={bus.id}
              onClick={() => onSearchSelect(bus)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bus className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{bus.busNumber}</div>
                <div className="text-sm text-gray-600">{bus.route} • {bus.driver}</div>
              </div>
              <span className="text-xs text-gray-500">{bus.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};