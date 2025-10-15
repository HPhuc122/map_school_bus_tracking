import { useState, useRef, useEffect } from 'react';
import { 
  Download, FileText, 
  TrendingUp, Users, DollarSign, AlertTriangle,
  Printer, Mail, Share2, Settings, RefreshCw
} from 'lucide-react';
import { 
  Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip,
  ComposedChart
} from 'recharts';
import { reportsService } from '../../services/api/reportsService';
import type { 
  PerformanceData, 
  RouteAnalysis, 
  MaintenanceData, 
  DriverPerformance, 
  ReportStats 
} from '../../services/api/reportsService';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('performance');
  const [dateRange, setDateRange] = useState('this-month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // State for real data
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysis[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData[]>([]);
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats>({
    totalTrips: 0,
    activeStudents: 0,
    totalRevenue: 0,
    onTimePercentage: 0,
    totalBuses: 0,
    activeDrivers: 0
  });

  // Load data when component mounts or date range changes
  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const [performance, routes, maintenance, drivers, stats] = await Promise.all([
        reportsService.getPerformanceData(),
        reportsService.getRouteAnalysis(),
        reportsService.getMaintenanceData(),
        reportsService.getDriverPerformance(),
        reportsService.getReportStats()
      ]);

      setPerformanceData(performance);
      setRouteAnalysis(routes);
      setMaintenanceData(maintenance);
      setDriverPerformance(drivers);
      setReportStats(stats);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportTypes = [
    { id: 'performance', label: 'Báo cáo hiệu suất', icon: TrendingUp, color: 'blue' },
    { id: 'financial', label: 'Báo cáo tài chính', icon: DollarSign, color: 'green' },
    { id: 'maintenance', label: 'Báo cáo bảo trì', icon: Settings, color: 'orange' },
    { id: 'safety', label: 'Báo cáo an toàn', icon: AlertTriangle, color: 'red' },
    { id: 'driver', label: 'Báo cáo tài xế', icon: Users, color: 'purple' }
  ];

  const handleExportPDF = () => {
    setIsGenerating(true);
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real app, would trigger PDF download
      alert('Báo cáo PDF đã được tạo và tải xuống!');
    }, 2000);
  };

  const handleExportExcel = () => {
    setIsGenerating(true);
    // Simulate Excel generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real app, would trigger Excel download
      alert('Báo cáo Excel đã được tạo và tải xuống!');
    }, 1500);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng hiệu suất</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" name="Số chuyến" />
              <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={3} name="Đúng giờ (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích tuyến đường</h3>
          <div className="space-y-4">
            {routeAnalysis.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>{route.students} HS</div>
                    <div>{route.distance}km</div>
                    <div>{(route.cost / 1000000).toFixed(1)}M đ</div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        route.efficiency >= 90 ? 'bg-green-500' : 
                        route.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${route.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi phí và tiêu thụ nhiên liệu</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => [
              name === 'cost' ? `${(value as number / 1000000).toFixed(1)}M đ` : `${value}L`,
              name === 'cost' ? 'Chi phí' : 'Nhiên liệu'
            ]} />
            <Legend />
            <Bar yAxisId="left" dataKey="fuel" fill="#f59e0b" name="Nhiên liệu (L)" />
            <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} name="Chi phí (VNĐ)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ bảo trì</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={maintenanceData as any}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi phí bảo trì</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`${(value as number / 1000000).toFixed(1)}M đ`, 'Chi phí']} />
              <Bar dataKey="cost" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết bảo trì</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại bảo trì</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lần</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí/lần</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {maintenanceData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                      <div className="text-sm font-medium text-gray-900">{item.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(item.cost / 1000000).toFixed(1)}M đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(item.cost / item.count / 1000).toFixed(0)}K đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDriverReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất tài xế</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài xế</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số chuyến</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đúng giờ (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vi phạm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {driverPerformance.map((driver, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.trips}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            driver.onTime >= 95 ? 'bg-green-500' : 
                            driver.onTime >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${driver.onTime}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{driver.onTime}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">{driver.rating}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.violations === 0 ? 'bg-green-100 text-green-800' : 
                      driver.violations <= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.violations} vi phạm
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.onTime >= 95 && driver.violations === 0 ? 'bg-green-100 text-green-800' : 
                      driver.onTime >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.onTime >= 95 && driver.violations === 0 ? 'Xuất sắc' : 
                       driver.onTime >= 90 ? 'Tốt' : 'Cần cải thiện'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'performance':
        return renderPerformanceReport();
      case 'maintenance':
        return renderMaintenanceReport();
      case 'driver':
        return renderDriverReport();
      case 'financial':
        return renderPerformanceReport(); // Simplified for demo
      case 'safety':
        return renderDriverReport(); // Simplified for demo
      default:
        return renderPerformanceReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-1">Tạo và xuất báo cáo chi tiết về hoạt động hệ thống</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>In</span>
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại báo cáo</label>
            <div className="grid grid-cols-1 gap-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    selectedReport === type.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Chọn khoảng thời gian báo cáo"
            >
              <option value="this-week">Tuần này</option>
              <option value="this-month">Tháng này</option>
              <option value="last-month">Tháng trước</option>
              <option value="this-quarter">Quý này</option>
              <option value="this-year">Năm này</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hành động</label>
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Cập nhật</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="Chia sẻ báo cáo">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" title="Gửi email báo cáo">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div ref={printRef}>
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan hệ thống</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{reportStats.totalTrips.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Tổng chuyến</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{reportStats.activeStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Học sinh</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{(reportStats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-600">Doanh thu (đ)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{reportStats.onTimePercentage}%</div>
                  <div className="text-sm text-gray-600">Đúng giờ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{reportStats.totalBuses}</div>
                  <div className="text-sm text-gray-600">Xe buýt</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{reportStats.activeDrivers}</div>
                  <div className="text-sm text-gray-600">Tài xế</div>
                </div>
              </div>
            </div>
            
            {renderCurrentReport()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;