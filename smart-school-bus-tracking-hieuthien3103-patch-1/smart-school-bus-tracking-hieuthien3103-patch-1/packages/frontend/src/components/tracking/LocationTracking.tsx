// Refactored LocationTracking component using new useBusTracking hook + socket integration
import { useState, useCallback, memo, useEffect } from "react";import {
  MapPin,
  RefreshCw,
  Filter,
  Bus as BusIcon,
  Navigation,
  Users,
  List,
  Map,
} from "lucide-react";
import { useBusTracking } from "../../hooks";
import BusCard from "./BusCard";
import { FilterButtons } from "./FilterButtons";
import SearchBox from "./SearchBox";
import BusDetailPanel from "./BusDetailPanel";
// removed useSchedules import because SchedulesContext doesn't expose schedulesData
import { useSocket } from "../../contexts/SocketContext";

const LocationTracking = () => {
  // Use custom hook for all bus tracking logic
  const {
    buses,
    busLocations,
    filteredBuses,
    searchResults,
    selectedBus,
    setSelectedBus,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    setSearchResults,
    autoRefresh,
    setAutoRefresh,
    getMarkers,
    handleLocationUpdate,
  } = useBusTracking();

  // Socket
  const { onLocationUpdate, offLocationUpdate, joinRoom } = useSocket();

  // Local UI state
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // status color helper
  const getStatusColor = useCallback((status: string) => {
    const s = (status ?? "").toLowerCase();
    if (s.includes("đang") || s.includes("di chuyển") || s.includes("moving")) {
      return "text-green-600 bg-green-100 border-green-200";
    }
    if (s.includes("dừng") || s.includes("đón")) {
      return "text-blue-600 bg-blue-100 border-blue-200";
    }
    if (s.includes("bảo")) {
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    }
    return "text-gray-600 bg-gray-100 border-gray-200";
  }, []);

  // socket handler: map server payload to hook's handleLocationUpdate
  const socketHandler = useCallback(
    (payload: any) => {
      // optional: debug
      // console.debug("Socket payload:", payload);
      handleLocationUpdate(payload);
    },
    [handleLocationUpdate]
  );

  useEffect(() => {
    // join generic room if needed (e.g., school context) - optional
    try {
      joinRoom && joinRoom({ role: "parent" });
    } catch (e) {
      // ignore
    }
    // subscribe
    onLocationUpdate && onLocationUpdate(socketHandler);
    return () => {
      offLocationUpdate && offLocationUpdate(socketHandler);
    };
  }, [onLocationUpdate, offLocationUpdate, socketHandler, joinRoom]);

  // Search handlers
  const handleSearchSelect = (bus: any) => {
    setSearchQuery(String(bus.busNumber ?? bus.id ?? ""));
    setShowSearchResults(false);
    // bus passed in searchResults is a normalized bus, so setSelectedBus directly
    setSelectedBus(bus ?? null);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // bus selection toggle: setSelectedBus expects a NormalizedBus | null
  const handleBusSelect = useCallback(
    (busId: number) => {
      setSelectedBus((prev: any) => {
        if (prev && prev.id === busId) return null;
        const found = (buses ?? []).find((b: any) => b.id === busId) ?? null;
        return found;
      });
    },
    [buses, setSelectedBus]
  );

  // Markers used by map (if you integrate map lib)
  const markers = getMarkers ? getMarkers() : [];

  // Stats
  const totalBuses = Array.isArray(buses) ? buses.length : 0;
  const activeBuses = Array.isArray(buses)
    ? buses.filter((b: any) => (b.status ?? "").toLowerCase().includes("đang")).length
    : 0;
  const pausedBuses = Array.isArray(buses)
    ? buses.filter((b: any) => (b.status ?? "").toLowerCase().includes("dừng")).length
    : 0;
  // derive total students from buses (backend may provide students count in normalized bus)
  const totalStudents = Array.isArray(buses) ? buses.reduce((sum: number, bus: any) => sum + (bus.students ?? 0), 0) : 0;

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
              <BusIcon className="h-6 w-6 text-blue-600" />
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              autoRefresh
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {autoRefresh ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {autoRefresh ? "Đang cập nhật" : "Tạm dừng"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBox
              searchQuery={searchQuery}
              searchResults={searchResults ?? []}
              showSearchResults={showSearchResults}
              onSearchChange={setSearchQuery}
              onSearchSelect={handleSearchSelect}
              onClearSearch={clearSearch}
              onToggleSearchResults={setShowSearchResults}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <FilterButtons filterStatus={filterStatus} onFilterChange={setFilterStatus} />
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
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Bản đồ
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Danh sách
                </button>
              </div>
            </div>

            <div className="p-4">
              {viewMode === "map" ? (
                // Placeholder map view (integrate real map library as needed)
                <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-96 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">Chế độ xem bản đồ</p>
                      <p className="text-gray-400 text-sm">Tích hợp Google Maps/OpenStreetMap</p>
                    </div>
                  </div>

                  {/* Simulated markers based on normalized buses */}
                  {markers.map((m, idx) => (
                    <div
                      key={`marker-${m.id}`}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transform transition-all hover:scale-110 bg-blue-500 ${
                        selectedBus?.id === m.id ? "ring-4 ring-white ring-opacity-60 scale-125" : ""
                      }`}
                      style={{ left: `${10 + (idx % 10) * 8}%`, top: `${20 + ((idx % 5) * 12)}%` }}
                      onClick={() => handleBusSelect(m.id)}
                      title={`${m.label}`}
                    >
                      <BusIcon className="w-3 h-3 text-white" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                      <BusCard
                        key={`bus-card-${bus.id}`}
                        bus={bus}
                        isSelected={selectedBus?.id === bus.id}
                        onSelect={handleBusSelect}
                        getStatusColor={getStatusColor}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BusIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
          <BusDetailPanel selectedBusId={selectedBus?.id ?? null} busLocations={buses} getStatusColor={getStatusColor} />
        </div>
      </div>
    </div>
  );
};

export default memo(LocationTracking);