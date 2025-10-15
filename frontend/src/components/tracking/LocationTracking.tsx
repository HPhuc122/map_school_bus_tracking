// Refactored LocationTracking component using modern architecture
import { useState, useCallback, memo } from 'react';
import { MapPin, RefreshCw, Filter, Bus, Navigation, Clock, Users, List, Map } from 'lucide-react';
import { useBusTracking } from '../../hooks';
import { BusCard } from './BusCard';
import { FilterButtons } from './FilterButtons';
import { SearchBox } from './SearchBox';
import { BusDetailPanel } from './BusDetailPanel';
import { useAppData } from '../../contexts/AppDataContext';

const LocationTracking = () => {
  // Use custom hook for all bus tracking logic
  const {
    busLocations,
    filteredBuses,
    filterStatus,
    selectedBus,
    autoRefresh,
    searchQuery,
    searchResults,
    showSearchResults,
    setFilterStatus,
    setSelectedBus,
    setAutoRefresh,
    setSearchQuery,
    setShowSearchResults,
    handleSearchSelect,
    clearSearch
  } = useBusTracking();

  // Get schedule data from context to calculate total students correctly
  const { scheduleData } = useAppData();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Helper function for status colors
  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'đang di chuyển':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'dừng đón khách':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'nghỉ trưa':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'sự cố':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  }, []);

  // Handle bus selection with toggle behavior
  const handleBusSelect = useCallback((busId: number) => {
    setSelectedBus(selectedBus === busId ? null : busId);
  }, [selectedBus, setSelectedBus]);

  // Map View Component
  const MapView = () => {
    // Debug log to check for duplicates in render
    console.log('MapView rendering with buses:', filteredBuses.map(b => ({ id: b.id, busNumber: b.busNumber })));

    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96 rounded-lg border-2 border-dashed border-gray-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Chế độ xem bản đồ</p>
            <p className="text-gray-400 text-sm">Sẽ tích hợp Google Maps/OpenStreetMap</p>
          </div>
        </div>

        {/* Simulate bus markers */}
        {filteredBuses.map((bus, index) => {
          const isSearched = searchResults.some(result => result.id === bus.id) && searchQuery.trim() !== '';
          return (
            <div
              key={`map-marker-${bus.id}`}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform transition-all hover:scale-110 ${bus.status === 'Đang di chuyển' ? 'bg-green-500' :
                  bus.status === 'Dừng đón khách' ? 'bg-blue-500' :
                    bus.status === 'Sự cố' ? 'bg-red-500' : 'bg-gray-500'
                } ${selectedBus === bus.id ? 'ring-4 ring-white ring-opacity-60 scale-125' : ''} 
            ${isSearched ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
              style={{ left: `${20 + index * 15}%`, top: `${30 + index * 20}%` }}
              onClick={() => handleBusSelect(bus.id)}
              title={`${bus.busNumber} - ${bus.route}`}
            >
              <Bus className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate real-time stats
  const totalBuses = busLocations.length;
  const activeBuses = busLocations.filter(bus => bus.status === 'Đang di chuyển').length;
  const pausedBuses = busLocations.filter(bus => bus.status === 'Dừng đón khách').length;

  // Calculate total students from ALL schedules (not just bus locations) 
  // because one bus can have multiple schedules
  const totalStudents = scheduleData.reduce((sum, schedule) => sum + schedule.students, 0);



  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Real-time Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số xe</p>
              <p className="text-2xl font-bold text-gray-900">{totalBuses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang di chuyển</p>
              <p className="text-2xl font-bold text-green-600">{activeBuses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Navigation className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dừng đón khách</p>
              <p className="text-2xl font-bold text-blue-600">{pausedBuses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng học sinh</p>
              <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi vị trí xe buýt</h1>
          <p className="text-gray-600">Giám sát thời gian thực vị trí và trạng thái các xe buýt</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${autoRefresh
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
          >
            {autoRefresh ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {autoRefresh ? 'Đang cập nhật' : 'Tạm dừng'}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBox
              searchQuery={searchQuery}
              searchResults={searchResults}
              showSearchResults={showSearchResults}
              onSearchChange={setSearchQuery}
              onSearchSelect={handleSearchSelect}
              onClearSearch={clearSearch}
              onToggleSearchResults={setShowSearchResults}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <FilterButtons
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng xe</p>
              <p className="text-xl font-semibold text-gray-900">{busLocations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Navigation className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang di chuyển</p>
              <p className="text-xl font-semibold text-gray-900">
                {busLocations.filter(b => b.status === 'Đang di chuyển').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dừng đón khách</p>
              <p className="text-xl font-semibold text-gray-900">
                {busLocations.filter(b => b.status === 'Dừng đón khách').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Học sinh</p>
              <p className="text-xl font-semibold text-gray-900">
                {busLocations.reduce((sum, bus) => sum + bus.students, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map/List View */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Toggle */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Vị trí xe buýt ({filteredBuses.length}/{busLocations.length})
              </h3>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Map className="w-4 h-4" />
                  Bản đồ
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <List className="w-4 h-4" />
                  Danh sách
                </button>
              </div>
            </div>

            <div className="p-4">
              {viewMode === 'map' ? (
                <MapView />
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredBuses.map((bus) => (
                    <BusCard
                      key={`bus-card-${bus.id}`}
                      bus={bus}
                      isSelected={selectedBus === bus.id}
                      onSelect={handleBusSelect}
                      getStatusColor={getStatusColor}
                    />
                  ))}

                  {filteredBuses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Bus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Không tìm thấy xe buýt phù hợp</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bus Details Panel */}
        <div>
          <BusDetailPanel
            selectedBusId={selectedBus}
            busLocations={busLocations}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(LocationTracking);