import { useState, useEffect, useMemo } from 'react';
import type { Student, Bus, Schedule, PickupDropoffLog, Stop, Parent } from '../../types';
import { 
  MapPin, 
  Users, 
  Clock, 
  Navigation, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Route as RouteIcon,
  Fuel,
  Activity
} from 'lucide-react';
import { useBuses } from '../../contexts/BusesContext';
import { useSchedules } from '../../contexts/SchedulesContext';
import { useStudents } from '../../contexts/StudentsContext';
import busService from '../../services/api/busService';
import pickupDropoffService from '../../services/api/pickupDropoffService';

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

// Local student type for UI
interface LocalStudent {
  id: number;
  name: string;
  pickup: string;
  dropoff: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: 'waiting' | 'picked' | 'dropped' | 'absent';
  phone: string;
}

type TripMode = 'pickup' | 'dropoff';
type StatusFilter = 'all' | 'waiting' | 'picked' | 'dropped' | 'absent';

const DriverDashboard = ({ driverData }: DriverDashboardProps) => {
  // ==================== CONTEXTS ====================
  const { buses } = useBuses();
  const { schedules } = useSchedules();
  const { students } = useStudents();

  // ==================== STATE ====================
  const [tripMode, setTripMode] = useState<TripMode>('pickup');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [compactView, setCompactView] = useState(false);
  
  // Bus location state
  const [busLocation, setBusLocation] = useState<{ 
    latitude: number; 
    longitude: number; 
    speed?: number 
  } | null>(null);
  
  // Pickup/Dropoff logs state
  const [pickupDropoffLogs, setPickupDropoffLogs] = useState<PickupDropoffLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);

  // Bus status state
  const [busStatus, setBusStatus] = useState({
    speed: 0,
    fuel: 85,
    engine: 'normal',
    temperature: 92
  });

  // ==================== FIND CURRENT DATA ====================
  // Find current bus for this driver
  const currentBus = useMemo(() => 
    buses.find((bus: Bus) => bus.ma_tai_xe === driverData.id),
    [buses, driverData.id]
  );

  // Find today's schedule for this driver
  const currentSchedule = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.find((schedule: Schedule) => 
      schedule.ma_tai_xe === driverData.id && 
      schedule.ngay_chay === today
    );
  }, [schedules, driverData.id]);

  // ==================== FETCH BUS LOCATION ====================
  useEffect(() => {
    if (!currentBus?.ma_xe) return;

    const fetchLocation = async () => {
      try {
        // busService.getBusLocation returns BusLocation[] (may contain multiple samples)
        const locations = await busService.getBusLocation(currentBus.ma_xe);
        if (Array.isArray(locations) && locations.length > 0) {
          // pick the most recent (assume first or last depending on backend; choose last)
          const latest = locations[locations.length - 1];
          setBusLocation({
            latitude: latest.vi_do ?? 21.0285,
            longitude: latest.kinh_do ?? 105.8542,
            speed: latest.toc_do ?? 0
          });
          setBusStatus(prev => ({
            ...prev,
            speed: latest.toc_do ?? 0
          }));
        }
      } catch (error) {
        console.error('Error fetching bus location:', error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [currentBus?.ma_xe]);

  // ==================== FETCH PICKUP/DROPOFF LOGS ====================
  useEffect(() => {
    if (!currentSchedule?.ma_lich) {
      setPickupDropoffLogs([]);
      return;
    }

    const fetchLogs = async () => {
      setLoadingLogs(true);
      setErrorLogs(null);
      
      try {
        const response = await pickupDropoffService.getLogsBySchedule(currentSchedule.ma_lich);
        if (response.success && response.data) {
          setPickupDropoffLogs(response.data);
        } else {
          setPickupDropoffLogs([]);
          setErrorLogs(response.message || 'Không thể tải nhật ký đón trả');
        }
      } catch (error) {
        setPickupDropoffLogs([]);
        setErrorLogs('Lỗi kết nối server');
        console.error('Error fetching logs:', error);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [currentSchedule?.ma_lich]);

  // ==================== CONVERT STUDENTS DATA ====================
  const localStudents = useMemo(() => {
    if (!currentSchedule) return [];

    // Filter students assigned to this schedule
    const assignedStudents = students.filter((student: Student) => {
      // Check if student has valid pickup/dropoff points
      return student.ma_diem_don && student.ma_diem_tra;
    });

    // Convert to local format with status from logs
    return assignedStudents.map((student: Student): LocalStudent => {
      const log = pickupDropoffLogs.find((l: PickupDropoffLog) => l.ma_hs === student.ma_hs);
      
      let status: LocalStudent['status'] = 'waiting';
      if (log) {
        if (tripMode === 'pickup') {
          if (log.trang_thai_don === 'da_don') status = 'picked';
          else if (log.trang_thai_don === 'vang') status = 'absent';
        } else {
          if (log.trang_thai_tra === 'da_tra') status = 'dropped';
          else if (log.trang_thai_tra === 'vang') status = 'absent';
          else if (log.trang_thai_don === 'da_don') status = 'picked'; // Already picked up
        }
      }

      return {
        id: student.ma_hs,
        name: student.ho_ten,
        pickup: (student.diem_don as Stop)?.ten_tram || 'Chưa có thông tin',
        dropoff: (student.diem_tra as Stop)?.ten_tram || 'Chưa có thông tin',
        pickupAddress: (student.diem_don as Stop)?.dia_chi || '',
        dropoffAddress: (student.diem_tra as Stop)?.dia_chi || '',
        status,
        phone: (student.phu_huynh as Parent)?.so_dien_thoai || 'N/A'
      };
    });
  }, [students, pickupDropoffLogs, tripMode, currentSchedule]);

  // ==================== FILTERED STUDENTS ====================
  const filteredStudents = useMemo(() => {
    return localStudents.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [localStudents, searchTerm, statusFilter]);

  // ==================== ROUTE INFO ====================
  const routeInfo = useMemo(() => {
    const completedCount = tripMode === 'pickup'
      ? localStudents.filter(s => s.status === 'picked').length
      : localStudents.filter(s => s.status === 'dropped').length;

    return {
      totalStops: 8,
      completedStops: completedCount,
      currentStop: 'Đang cập nhật...',
      nextStop: 'Đang cập nhật...',
      estimatedTime: '15 phút',
      routeName: currentSchedule?.tuyen?.ten_tuyen || driverData.route,
      totalStudents: localStudents.length
    };
  }, [localStudents, tripMode, currentSchedule, driverData.route]);

  // ==================== HANDLERS ====================
  const handleStudentStatus = async (
    studentId: number, 
    newStatus: 'picked' | 'absent' | 'dropped'
  ) => {
    const log = pickupDropoffLogs.find((l: PickupDropoffLog) => l.ma_hs === studentId);
    if (!log) {
      console.error('Log not found for student:', studentId);
      return;
    }

    try {
      let updateData: Partial<PickupDropoffLog> = {};
      
      if (tripMode === 'pickup') {
        updateData.trang_thai_don = newStatus === 'picked' ? 'da_don' : 
                                     newStatus === 'absent' ? 'vang' : 'cho';
      } else {
        updateData.trang_thai_tra = newStatus === 'dropped' ? 'da_tra' : 
                                     newStatus === 'absent' ? 'vang' : 'cho';
      }

      await pickupDropoffService.updateLogStatus(log.ma_nhat_ky, updateData);

      // Refresh logs after update
      if (currentSchedule?.ma_lich) {
        const response = await pickupDropoffService.getLogsBySchedule(currentSchedule.ma_lich);
        if (response.success && response.data) {
          setPickupDropoffLogs(response.data);
        }
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const emergencyCall = () => {
    if (window.confirm('Bạn có chắc muốn gọi số khẩn cấp 113?')) {
      window.location.href = 'tel:113';
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  const getStatusColor = (status: LocalStudent['status']) => {
    const colors = {
      picked: 'text-green-600 bg-green-100',
      dropped: 'text-blue-600 bg-blue-100',
      waiting: 'text-yellow-600 bg-yellow-100',
      absent: 'text-red-600 bg-red-100'
    };
    return colors[status];
  };

  const getStatusText = (status: LocalStudent['status']) => {
    const texts = {
      picked: 'Đã đón',
      dropped: 'Đã trả',
      waiting: tripMode === 'pickup' ? 'Chờ đón' : 'Chờ trả',
      absent: 'Vắng mặt'
    };
    return texts[status];
  };

  const getStatusIcon = (status: LocalStudent['status']) => {
    const icons = {
      picked: '✓',
      dropped: '📍',
      waiting: '⏳',
      absent: '✗'
    };
    return icons[status];
  };

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const pickedCount = localStudents.filter(s => s.status === 'picked').length;
    const droppedCount = localStudents.filter(s => s.status === 'dropped').length;
    
    return {
      picked: pickedCount,
      dropped: droppedCount,
      total: localStudents.length,
      progress: tripMode === 'pickup' ? pickedCount : droppedCount
    };
  }, [localStudents, tripMode]);

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Driver Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
              {driverData.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Smart School Bus - Tài xế
              </h1>
              <p className="text-lg text-blue-600 font-medium mb-1">
                Xin chào, {driverData.name}! 👋
              </p>
              <p className="text-gray-600">
                Tuyến {routeInfo.routeName} - Xe #{currentBus?.bien_so || driverData.busId}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Đang hoạt động</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Current Time */}
            <div className="text-right mr-4">
              <p className="text-sm text-gray-500">Ca làm việc</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-blue-600">Sáng 07:00-12:00</p>
            </div>

            {/* Trip Mode Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTripMode('pickup')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tripMode === 'pickup' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🚌 Đón học sinh
              </button>
              <button
                onClick={() => setTripMode('dropoff')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tripMode === 'dropoff' 
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
              <p className="text-2xl font-bold text-gray-900">{stats.progress}</p>
              <p className="text-sm text-gray-500">/ {stats.total}</p>
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
              <RouteIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tiến độ</p>
              <p className="text-2xl font-bold text-gray-900">{routeInfo.completedStops}</p>
              <p className="text-sm text-gray-500">/ {routeInfo.totalStops}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Location & Route */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            Vị trí và Tuyến đường
          </h2>
          
          {/* Current Location */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Vị trí hiện tại:</span>
              <span className="text-xs text-green-600 flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Real-time
              </span>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-48 flex items-center justify-center mb-4 border border-blue-200">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Bản đồ GPS</p>
                {busLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {busLocation.latitude.toFixed(4)}, Lng: {busLocation.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Route Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến độ tuyến:</span>
              <span className="text-sm text-blue-600 font-semibold">
                {routeInfo.completedStops}/{routeInfo.totalStops}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-blue-600 h-2 rounded-full progress-bar"
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
              <span className="ml-2 text-sm text-gray-500">
                ({filteredStudents.length}/{localStudents.length})
              </span>
            </h2>
            
            {/* View Toggle */}
            <button
              onClick={() => setCompactView(!compactView)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                compactView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
              title={compactView ? 'Chế độ mở rộng' : 'Chế độ thu gọn'}
            >
              {compactView ? '📋 Thu gọn' : '📖 Mở rộng'}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 space-y-3">
            {/* Search Bar */}
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

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'waiting', 'picked', 'dropped', 'absent'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tất cả' : getStatusText(status)}
                  <span className="ml-1">
                    ({status === 'all' 
                      ? localStudents.length 
                      : localStudents.filter(s => s.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Loading State */}
          {loadingLogs && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Error State */}
          {errorLogs && (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{errorLogs}</p>
            </div>
          )}

          {/* Student List */}
          {!loadingLogs && !errorLogs && (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>Không tìm thấy học sinh nào</p>
                  {(searchTerm || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`border border-gray-200 rounded-lg hover:shadow-sm transition-all ${
                      compactView ? 'p-3' : 'p-4'
                    }`}
                  >
                    <div className={`flex items-center justify-between ${compactView ? 'mb-1' : 'mb-2'}`}>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-gray-900 truncate ${compactView ? 'text-sm' : ''}`}>
                          {student.name}
                        </h3>
                        {!compactView && (
                          <>
                            <p className="text-sm text-gray-500 mt-1">
                              {tripMode === 'pickup' 
                                ? `Đón tại: ${student.pickup}` 
                                : `Trả tại: ${student.dropoff}`}
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getStatusColor(student.status)}`}>
                        {compactView ? getStatusIcon(student.status) : getStatusText(student.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      {!compactView && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          {student.phone}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className={`flex gap-1 ${compactView ? 'ml-auto' : ''}`}>
                        {tripMode === 'pickup' && student.status === 'waiting' && (
                          <>
                            <button
                              onClick={() => handleStudentStatus(student.id, 'picked')}
                              className={`bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors ${
                                compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                            >
                              {compactView ? '✓' : 'Đã đón'}
                            </button>
                            <button
                              onClick={() => handleStudentStatus(student.id, 'absent')}
                              className={`bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors ${
                                compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
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
                              className={`bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors ${
                                compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                              }`}
                            >
                              {compactView ? '📍' : 'Đã trả'}
                            </button>
                            <button
                              onClick={() => handleStudentStatus(student.id, 'absent')}
                              className={`bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors ${
                                compactView ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
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
          )}
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={emergencyCall}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors"
          title="Gọi khẩn cấp"
          aria-label="Gọi khẩn cấp - Số 113"
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