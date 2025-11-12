import { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  Phone,
  Route,
  Fuel,
  Activity
} from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import MapViews from '../map/MapViews';

interface DriverDashboardProps {
  driverData: {
    id: number;
    name: string;
    busId: number;
    route: string;
    license?: string;
    phone?: string;
    experience?: string;
    avatar?: string;
  };
}

const DriverDashboard = ({ driverData }: DriverDashboardProps) => {
  // Get real-time data from global context
  const { busLocations, scheduleData, getStudentsByDriver, updateStudentStatus } = useAppData();

  // Find current bus data for this driver
  const currentBus = busLocations.find(bus => bus.driver === driverData.name);
  // Find current schedule for additional route info
  const currentSchedule = scheduleData.find(schedule => schedule.driver === driverData.name);

  // Get students for this driver from global context and convert to DriverDashboard format
  const contextStudents = getStudentsByDriver(driverData.name);

  // Convert context students to DriverDashboard format
  const convertedStudents = contextStudents.map(student => ({
    id: student.id,
    name: student.name,
    pickup: student.pickupTime,
    dropoff: student.dropoffTime,
    pickupAddress: student.pickup,
    dropoffAddress: student.dropoff,
    status: student.status === 'Đã lên xe' ? 'picked' :
      student.status === 'Đã xuống xe' ? 'dropped' :
        student.status === 'Vắng mặt' ? 'absent' : 'waiting',
    phone: student.phone
  }));

  const [currentLocation, setCurrentLocation] = useState({
    lat: currentBus?.lat || 21.0285,
    lng: currentBus?.lng || 105.8542,
    address: 'Đường Láng, Đống Đa, Hà Nội'
  });

  const [busStatus, setBusStatus] = useState({
    speed: currentBus?.speed || 0,
    fuel: 85,
    engine: 'normal',
    temperature: 92
  });

  // Trip mode: 'pickup' (đón học sinh) hoặc 'dropoff' (trả học sinh)
  const [tripMode, setTripMode] = useState<'pickup' | 'dropoff'>('pickup');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'picked' | 'dropped' | 'absent'>('all');
  const [compactView, setCompactView] = useState(false);
  const [showMap, setShowMap] = useState(false); // ✅ ADD STATE TO TOGGLE MAP

  // Use converted students from context
  const [students, setStudents] = useState(convertedStudents);

  // Route info from real data
  const [routeInfo] = useState({
    totalStops: currentBus?.routeStops?.length || 8,
    completedStops: currentBus?.currentStopIndex || 2,
    currentStop: currentBus?.routeStops?.[currentBus.currentStopIndex] || 'Điểm đón số 3 - Ngã tư Láng Hạ',
    nextStop: currentBus?.nextStop || 'Điểm đón số 4 - Bưu điện Đống Đa',
    estimatedTime: currentBus?.estimatedArrival || '15 phút',
    routeName: currentSchedule?.route || currentBus?.route || driverData.route,
    totalStudents: currentSchedule?.students || currentBus?.students || 0
  });

  // Sync students when context data changes
  useEffect(() => {
    setStudents(convertedStudents);
  }, [convertedStudents.length]);

  // Simulation real-time updates with real data integration
  useEffect(() => {
    const interval = setInterval(() => {
      setBusStatus(prev => ({
        ...prev,
        speed: currentBus?.speed || Math.floor(Math.random() * 40) + 10
      }));

      setCurrentLocation(prev => ({
        ...prev,
        lat: currentBus?.lat || (prev.lat + (Math.random() - 0.5) * 0.001),
        lng: currentBus?.lng || (prev.lng + (Math.random() - 0.5) * 0.001)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentBus]);

  const handleStudentStatus = (studentId: number, newStatus: 'picked' | 'absent' | 'dropped') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, status: newStatus }
          : student
      )
    );

    const contextStatus = newStatus === 'picked' ? 'Đã lên xe' :
      newStatus === 'dropped' ? 'Đã xuống xe' :
        newStatus === 'absent' ? 'Vắng mặt' : 'Chờ xe';
    updateStudentStatus(studentId, contextStatus);
  };

  const emergencyCall = () => {
    alert('Đang gọi đến số khẩn cấp: 113');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked': return 'text-green-600 bg-green-100';
      case 'dropped': return 'text-blue-600 bg-blue-100';
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'absent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'picked': return 'Đã đón';
      case 'dropped': return 'Đã trả';
      case 'waiting': return tripMode === 'pickup' ? 'Chờ đón' : 'Chờ trả';
      case 'absent': return 'Vắng mặt';
      default: return 'Không xác định';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
              {driverData.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Smart School Bus - Tài xế
              </h1>
              <p className="text-lg text-blue-600 font-medium mb-1">
                Xin chào, {driverData.name}! 👋
              </p>
              <p className="text-gray-600">Tuyến {driverData.route} - Xe buýt #{driverData.busId}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Đang hoạt động</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-500">Ca làm việc</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-blue-600">Sáng 07:00-12:00</p>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTripMode('pickup')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tripMode === 'pickup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                🚌 Đón học sinh
              </button>
              <button
                onClick={() => setTripMode('dropoff')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tripMode === 'dropoff'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                🏠 Trả học sinh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tốc độ hiện tại</p>
              <p className="text-2xl font-bold text-gray-900">{busStatus.speed}</p>
              <p className="text-sm text-gray-500">km/h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${tripMode === 'pickup' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Users className={`h-6 w-6 ${tripMode === 'pickup' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">
                {tripMode === 'pickup' ? 'Học sinh đã đón' : 'Học sinh đã trả'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {tripMode === 'pickup'
                  ? students.filter(s => s.status === 'picked').length
                  : students.filter(s => s.status === 'dropped').length
                }
              </p>
              <p className="text-sm text-gray-500">/ {students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Fuel className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Nhiên liệu</p>
              <p className="text-2xl font-bold text-gray-900">{busStatus.fuel}%</p>
              <p className="text-sm text-gray-500">còn lại</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Route className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Điểm đón</p>
              <p className="text-2xl font-bold text-gray-900">{routeInfo.completedStops}</p>
              <p className="text-sm text-gray-500">/ {routeInfo.totalStops}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Location & Route */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              Vị trí và Tuyến đường
            </h2>
            {/* ✅ ADD MAP TOGGLE BUTTON */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {showMap ? '📋 Ẩn bản đồ' : '🗺️ Xem bản đồ'}
            </button>
          </div>

          {/* Current Location */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Vị trí hiện tại:</span>
              <span className="text-xs text-gray-500">Real-time</span>
            </div>
            <p className="text-gray-600 mb-3">{currentLocation.address}</p>

            {/* ✅ CONDITIONAL MAP RENDERING */}
            {showMap ? (
              <div className="rounded-lg overflow-hidden mb-4 border border-gray-200" style={{ height: '300px' }}>
                <MapViews role="driver" userId={driverData.id.toString()} />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Bản đồ GPS</p>
                  <p className="text-xs text-gray-400">Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}</p>
                  <button
                    onClick={() => setShowMap(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Nhấn để xem bản đồ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Route Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến độ tuyến:</span>
              <span className="text-sm text-blue-600">{routeInfo.completedStops}/{routeInfo.totalStops}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(routeInfo.completedStops / routeInfo.totalStops) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600">Hiện tại: {routeInfo.currentStop}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Tiếp theo: {routeInfo.nextStop}</span>
              </div>
              <div className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600">Dự kiến: {routeInfo.estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              {tripMode === 'pickup' ? 'Danh sách Đón học sinh' : 'Danh sách Trả học sinh'}
              <span className="ml-2 text-sm text-gray-500">({filteredStudents.length}/{students.length})</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompactView(!compactView)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${compactView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                title={compactView ? 'Chế độ mở rộng' : 'Chế độ thu gọn'}
              >
                {compactView ? '📋' : '📖'}
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'waiting', 'picked', 'dropped', 'absent'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${statusFilter === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {status === 'all' ? 'Tất cả' : getStatusText(status)}
                  <span className="ml-1 text-xs">
                    ({status === 'all' ? students.length : students.filter(s => s.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Student List with Scroll */}
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Không tìm thấy học sinh nào</p>
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className={`border border-gray-200 rounded-lg transition-all ${compactView ? 'p-3' : 'p-4'
                  }`}>
                  <div className={`flex items-center justify-between ${compactView ? 'mb-1' : 'mb-2'}`}>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-gray-900 truncate ${compactView ? 'text-sm' : ''}`}>
                        {student.name}
                      </h3>
                      {!compactView && (
                        <>
                          <p className="text-sm text-gray-500">
                            {tripMode === 'pickup' ? `Đón lúc: ${student.pickup}` : `Trả lúc: ${student.dropoff}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            📍 {tripMode === 'pickup' ? student.pickupAddress : student.dropoffAddress}
                          </p>
                        </>
                      )}
                      {compactView && (
                        <p className="text-xs text-gray-500">
                          {tripMode === 'pickup' ? student.pickup : student.dropoff} • {student.phone}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(student.status)}`}>
                      {compactView ? (
                        student.status === 'picked' ? '✓' :
                          student.status === 'dropped' ? '📍' :
                            student.status === 'absent' ? '✗' : '⏳'
                      ) : (
                        getStatusText(student.status)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {!compactView && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {student.phone}
                      </div>
                    )}

                    <div className={`flex gap-1 ${compactView ? 'ml-auto' : ''}`}>
                      {tripMode === 'pickup' && student.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => handleStudentStatus(student.id, 'picked')}
                            className={`bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors ${compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                          >
                            {compactView ? '✓' : 'Đã đón'}
                          </button>
                          <button
                            onClick={() => handleStudentStatus(student.id, 'absent')}
                            className={`bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors ${compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                          >
                            {compactView ? '✗' : 'Vắng mặt'}
                          </button>
                        </>
                      )}

                      {tripMode === 'dropoff' && student.status === 'picked' && (
                        <>
                          <button
                            onClick={() => handleStudentStatus(student.id, 'dropped')}
                            className={`bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors ${compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                          >
                            {compactView ? '📍' : 'Đã trả'}
                          </button>
                          <button
                            onClick={() => handleStudentStatus(student.id, 'absent')}
                            className={`bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors ${compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                          >
                            {compactView ? '✗' : 'Không có mặt'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={emergencyCall}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors"
          title="Gọi khẩn cấp"
        >
          <Phone className="h-6 w-6" />
        </button>

        <button
          className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-colors border border-gray-200"
          title="Thông tin tài xế"
          onClick={() => alert(`Tài xế: ${driverData.name}\nBằng lái: ${driverData.license || 'Chưa cập nhật'}\nSĐT: ${driverData.phone || 'Chưa cập nhật'}`)}
        >
          <Users className="h-5 w-5" />
        </button>
      </div>

      {/* Bus Status Panel */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          Trạng thái Xe buýt
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tốc độ</p>
            <p className="text-xl font-bold text-blue-600">{busStatus.speed} km/h</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nhiên liệu</p>
            <p className="text-xl font-bold text-green-600">{busStatus.fuel}%</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Động cơ</p>
            <p className="text-xl font-bold text-yellow-600 capitalize">{busStatus.engine}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nhiệt độ</p>
            <p className="text-xl font-bold text-orange-600">{busStatus.temperature}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;