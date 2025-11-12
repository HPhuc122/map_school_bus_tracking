import { useState, useEffect } from 'react';
import { 
  Bus, Users, UserCheck, AlertTriangle, MapPin, 
  TrendingUp, TrendingDown, Fuel,
  RefreshCw, Filter, Download, Eye, Activity
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time data simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Simulate real-time data updates
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Enhanced data structures
  const stats = {
    activeBuses: { current: 15, change: 2, trend: 'up' },
    students: { current: 245, change: -5, trend: 'down' },
    drivers: { current: 18, change: 1, trend: 'up' },
    alerts: { current: 2, change: -1, trend: 'down' }
  };

  const performanceData = [
    { time: '06:00', trips: 12, onTime: 95, fuel: 85 },
    { time: '07:00', trips: 25, onTime: 88, fuel: 82 },
    { time: '08:00', trips: 18, onTime: 92, fuel: 79 },
    { time: '09:00', trips: 8, onTime: 96, fuel: 77 },
    { time: '14:00', trips: 22, onTime: 90, fuel: 75 },
    { time: '15:00', trips: 28, onTime: 85, fuel: 72 },
    { time: '16:00', trips: 15, onTime: 93, fuel: 70 },
    { time: '17:00', trips: 10, onTime: 98, fuel: 68 }
  ];

  const routePerformance = [
    { route: 'Tuyến A', efficiency: 92, students: 45, distance: 12.5 },
    { route: 'Tuyến B', efficiency: 88, students: 38, distance: 10.2 },
    { route: 'Tuyến C', efficiency: 95, students: 52, distance: 15.8 },
    { route: 'Tuyến D', efficiency: 85, students: 35, distance: 8.7 },
    { route: 'Tuyến E', efficiency: 90, students: 42, distance: 11.3 }
  ];

  const fuelConsumption = [
    { day: 'T2', consumption: 145, cost: 3250000 },
    { day: 'T3', consumption: 138, cost: 3100000 },
    { day: 'T4', consumption: 152, cost: 3420000 },
    { day: 'T5', consumption: 141, cost: 3160000 },
    { day: 'T6', consumption: 156, cost: 3500000 },
    { day: 'T7', consumption: 98, cost: 2200000 }
  ];

  const statusData = [
    { name: 'Đang chạy', value: 15, color: '#22c55e' },
    { name: 'Chờ khởi hành', value: 8, color: '#f59e0b' },
    { name: 'Bảo trì', value: 3, color: '#ef4444' },
    { name: 'Nghỉ', value: 2, color: '#6b7280' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Cập nhật cuối:</span>
            <span className="text-sm font-medium text-gray-900">
              {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
        </div>
      </div>
      
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 shadow-lg">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeBuses.current}</h3>
                <p className="text-sm text-gray-600">Xe đang hoạt động</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${
              stats.activeBuses.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.activeBuses.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(stats.activeBuses.change)}</span>
            </div>
          </div>
          <div className="mt-4 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full progress-85"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.students.current}</h3>
                <p className="text-sm text-gray-600">Học sinh</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${
              stats.students.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.students.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(stats.students.change)}</span>
            </div>
          </div>
          <div className="mt-4 bg-green-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full progress-92"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.drivers.current}</h3>
                <p className="text-sm text-gray-600">Tài xế</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${
              stats.drivers.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.drivers.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(stats.drivers.change)}</span>
            </div>
          </div>
          <div className="mt-4 bg-yellow-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full progress-78"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500 shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{stats.alerts.current}</h3>
                <p className="text-sm text-gray-600">Cảnh báo</p>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${
              stats.alerts.trend === 'up' ? 'text-red-600' : 'text-green-600'
            }`}>
              {stats.alerts.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(stats.alerts.change)}</span>
            </div>
          </div>
          <div className="mt-4 bg-red-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full progress-25"></div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất theo thời gian</h3>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Xem chi tiết">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Tải xuống dữ liệu">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="trips" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Số chuyến"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="onTime" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Đúng giờ (%)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tiêu thụ nhiên liệu</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Tuần này</span>
              <Filter className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fuelConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'consumption' ? `${value}L` : `${value.toLocaleString()}đ`,
                  name === 'consumption' ? 'Tiêu thụ' : 'Chi phí'
                ]}
              />
              <Legend />
              <Bar 
                dataKey="consumption" 
                fill="#f59e0b" 
                name="Tiêu thụ (L)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Performance & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Efficiency */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất tuyến đường</h3>
          <div className="space-y-4">
            {routePerformance.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{route.route}</h4>
                    <span className={`text-sm font-semibold ${
                      route.efficiency >= 90 ? 'text-green-600' : 
                      route.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {route.efficiency}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{route.students} học sinh</span>
                    <span>{route.distance}km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        route.efficiency >= 90 ? 'bg-green-500' : 
                        route.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{'--progress-width': `${route.efficiency}%`} as React.CSSProperties & { '--progress-width': string }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đội xe</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
                label={({ value, percent }: any) => `${value} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} xe`, 'Số lượng']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Status Summary */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{'--bg-color': item.color} as React.CSSProperties & { '--bg-color': string }}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.value} xe</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động trực tiếp</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">LIVE</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
            <div className="text-center z-10">
              <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-bounce" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h4>
              <p className="text-gray-600 mb-4">Theo dõi vị trí xe buýt thời gian thực</p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600">Xe đang di chuyển</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-gray-600">Tuyến hoạt động</div>
                </div>
              </div>
            </div>
            
            {/* Animated elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            <div className="absolute top-8 right-12 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-12 left-8 w-4 h-4 bg-yellow-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Quick Stats & Alerts */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt hiệu suất</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Đúng giờ hôm nay</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-15"></div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">91%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hiệu suất nhiên liệu</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-12"></div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">87%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sự hài lòng</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-14"></div>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo gần đây</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800">Xe A-001 chậm lịch trình</p>
                  <p className="text-xs text-red-600">2 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <Fuel className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yellow-800">Xe B-003 cần đổ xăng</p>
                  <p className="text-xs text-yellow-600">15 phút trước</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <Activity className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-800">Bảo trì định kỳ xe C-005</p>
                  <p className="text-xs text-blue-600">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;