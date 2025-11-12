import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Bus, 
  MapPin, 
  Bell, 
  Calendar,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Plus,
  UserPlus
} from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';

interface AdminDashboardProps {
  adminData: {
    name: string;
    role: string;
  };
  onNavigate?: (tab: string) => void;
  onAddNew?: (type: 'student' | 'driver' | 'bus' | 'schedule') => void;
}

const AdminDashboard = ({ adminData, onNavigate, onAddNew }: AdminDashboardProps) => {
  // Get real data from context
  const { busLocations, scheduleData, driversData, studentsData, error } = useAppData();
  
  // Calculate real-time stats from actual data with useMemo for proper re-rendering
  const dashboardStats = useMemo(() => ({
    totalBuses: busLocations.length,
    activeBuses: busLocations.filter(bus => bus.status === 'Đang di chuyển').length,
    // Calculate total students from actual studentsData for accurate count
    totalStudents: studentsData.length,
    totalDrivers: driversData.length,
    totalRoutes: scheduleData.length, // Total number of routes/schedules
    activeRoutes: scheduleData.filter(s => s.status === 'Hoạt động').length,
    totalAlerts: busLocations.filter(bus => bus.status === 'Sự cố').length
  }), [busLocations, scheduleData, driversData, studentsData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Quick navigation shortcuts
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault();
            onNavigate?.('buses'); // Fixed: 'bus' -> 'buses'
            break;
          case 's':
            event.preventDefault();
            onNavigate?.('students'); // Fixed: added students shortcut
            break;
          case 'd':
            event.preventDefault();
            onNavigate?.('drivers'); // Fixed: added drivers shortcut
            break;
          case 'y':
            event.preventDefault();
            onNavigate?.('tracking');
            break;
          case 'l':
            event.preventDefault();
            onNavigate?.('schedule');
            break;
          case 'r':
            event.preventDefault();
            onNavigate?.('reports');
            break;
          case '1':
            event.preventDefault();
            onAddNew?.('student');
            break;
          case '2':
            event.preventDefault();
            onAddNew?.('driver');
            break;
          case '3':
            event.preventDefault();
            onAddNew?.('bus'); // Added bus quick add
            break;
          case '4':
            event.preventDefault();
            onAddNew?.('schedule'); // Added schedule quick add
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate, onAddNew]);

  const [recentActivities] = useState([
    { id: 1, type: 'bus', message: 'Xe BS001 đã hoàn thành tuyến A1', time: '2 phút trước', status: 'success' },
    { id: 2, type: 'alert', message: 'Cảnh báo: Xe BS003 chậm tiến độ 10 phút', time: '5 phút trước', status: 'warning' },
    { id: 3, type: 'student', message: 'Học sinh Nguyễn Văn An đã được đón', time: '8 phút trước', status: 'info' },
    { id: 4, type: 'driver', message: 'Tài xế Trần Văn B đã đăng nhập', time: '12 phút trước', status: 'info' }
  ]);

  const [activeAlerts] = useState([
    { id: 1, type: 'delay', message: 'Xe BS003 chậm 10 phút so với lịch trình', severity: 'medium', route: 'Tuyến B2' },
    { id: 2, type: 'maintenance', message: 'Xe BS007 cần bảo trì định kỳ', severity: 'low', route: 'Tuyến C1' },
    { id: 3, type: 'emergency', message: 'Sự cố nhỏ tại điểm đón số 5', severity: 'high', route: 'Tuyến A3' }
  ]);

  // Real-time stats are now calculated directly from context data

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'student': return <Users className="h-4 w-4" />;
      case 'driver': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Quản trị - {adminData.name}
        </h1>
        <p className="text-gray-600">Tổng quan hệ thống Smart School Bus</p>
        
        {/* Data Source Indicator */}
        {error && (
          <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">
              {error}
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng số xe buýt</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalBuses}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 tháng này
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Xe đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeBuses}</p>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round((dashboardStats.activeBuses / dashboardStats.totalBuses) * 100)}% tổng số
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng học sinh</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Users className="h-3 w-3 mr-1" />
                {dashboardStats.totalRoutes} tuyến đường
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cảnh báo</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalAlerts}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Cần xử lý
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="xl:col-span-2 space-y-6">
          {/* Active Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Cảnh báo Hệ thống
            </h2>
            
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{alert.message}</h3>
                      <p className="text-sm opacity-80">Tuyến: {alert.route}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {alert.severity === 'high' ? 'Cao' : alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              Hoạt động Gần đây
            </h2>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác Nhanh</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate?.('buses')}
                className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+B"
              >
                <div className="flex items-center">
                  <Bus className="h-5 w-5 mr-3" />
                  Quản lý Xe buýt
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Ctrl+B</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('students')}
                className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+S"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  Quản lý Học sinh
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Ctrl+S</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('tracking')}
                className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+Y"
              >
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  Theo dõi Vị trí
                </div>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Ctrl+Y</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('drivers')}
                className="w-full p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+D"
              >
                <div className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-3" />
                  Quản lý Tài xế
                </div>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Ctrl+D</span>
              </button>

              <button 
                onClick={() => onNavigate?.('schedule')}
                className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+L"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  Lịch trình
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Ctrl+L</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('reports')}
                className="w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left flex items-center justify-between"
                title="Phím tắt: Ctrl+R"
              >
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Báo cáo
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Ctrl+R</span>
              </button>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>
              
              {/* Quick Add Actions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thêm mới nhanh</p>
                
                <button 
                  onClick={() => onAddNew?.('student')}
                  className="w-full p-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left flex items-center justify-between text-sm"
                  title="Phím tắt: Ctrl+1"
                >
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm học sinh mới
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Ctrl+1</span>
                </button>
                
                <button 
                  onClick={() => onAddNew?.('driver')}
                  className="w-full p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left flex items-center justify-between text-sm"
                  title="Phím tắt: Ctrl+2"
                >
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm tài xế mới
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Ctrl+2</span>
                </button>
                
                <button 
                  onClick={() => onAddNew?.('bus')}
                  className="w-full p-2.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left flex items-center justify-between text-sm"
                  title="Phím tắt: Ctrl+3"
                >
                  <div className="flex items-center">
                    <Bus className="h-4 w-4 mr-2" />
                    Thêm xe buýt mới
                  </div>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Ctrl+3</span>
                </button>
                
                <button 
                  onClick={() => onAddNew?.('schedule')}
                  className="w-full p-2.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-left flex items-center justify-between text-sm"
                  title="Phím tắt: Ctrl+4"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Thêm lịch trình mới
                  </div>
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Ctrl+4</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái Hệ thống</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tài xế hoạt động</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {dashboardStats.activeBuses}/{dashboardStats.totalDrivers}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(dashboardStats.activeBuses / dashboardStats.totalDrivers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tuyến đường hoạt động</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {dashboardStats.activeRoutes}/{dashboardStats.totalRoutes}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${dashboardStats.totalRoutes > 0 ? (dashboardStats.activeRoutes / dashboardStats.totalRoutes) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hệ thống</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm font-medium text-green-600">Hoạt động tốt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;