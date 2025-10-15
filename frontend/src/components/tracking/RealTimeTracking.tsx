import { useState, useEffect } from 'react';
import { Navigation, Wifi, WifiOff, Clock, AlertTriangle } from 'lucide-react';

interface RealTimeData {
  busId: string;
  busNumber: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  studentOnBoard: string[];
  nextStopId: string;
  nextStopName: string;
  distanceToNextStop: number;
  estimatedArrival: string;
  isDelayed: boolean;
  delayMinutes?: number;
}

interface NotificationTrigger {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  parentEmail: string;
  stopId: string;
  stopName: string;
  notificationType: 'approaching_pickup' | 'approaching_dropoff' | 'arrived_pickup' | 'arrived_dropoff' | 'delay';
  triggered: boolean;
  triggerDistance: number; // km
}

const RealTimeTracking = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([
    {
      busId: 'bus_001',
      busNumber: 'BS001',
      latitude: 21.0285,
      longitude: 105.8542,
      speed: 25,
      heading: 45,
      timestamp: new Date().toISOString(),
      studentOnBoard: ['student_001', 'student_002', 'student_003'],
      nextStopId: 'stop_001',
      nextStopName: 'Ngã tư Trần Duy Hưng',
      distanceToNextStop: 0.8,
      estimatedArrival: '7:15',
      isDelayed: false
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationTrigger[]>([
    {
      id: 'notif_001',
      studentId: 'student_001',
      studentName: 'Nguyễn Minh An',
      parentPhone: '+84123456789',
      parentEmail: 'parent@email.com',
      stopId: 'stop_001',
      stopName: 'Ngã tư Trần Duy Hưng',
      notificationType: 'approaching_pickup',
      triggered: false,
      triggerDistance: 1.0
    }
  ]);

  const [sentNotifications, setSentNotifications] = useState<any[]>([]);

  // Simulate WebSocket connection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time GPS data updates
      setRealTimeData(prev => prev.map(bus => ({
        ...bus,
        latitude: bus.latitude + (Math.random() - 0.5) * 0.001,
        longitude: bus.longitude + (Math.random() - 0.5) * 0.001,
        speed: Math.max(0, bus.speed + (Math.random() - 0.5) * 10),
        distanceToNextStop: Math.max(0, bus.distanceToNextStop - 0.05),
        timestamp: new Date().toISOString(),
        isDelayed: Math.random() > 0.8, // 20% chance of delay
        delayMinutes: Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 5 : undefined
      })));

      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    // Simulate connection issues
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionInterval);
    };
  }, []);

  // Notification trigger logic
  useEffect(() => {
    realTimeData.forEach(bus => {
      notifications.forEach(notification => {
        if (!notification.triggered && bus.distanceToNextStop <= notification.triggerDistance) {
          // Trigger notification
          const newNotification = {
            id: `sent_${Date.now()}`,
            busNumber: bus.busNumber,
            studentName: notification.studentName,
            stopName: notification.stopName,
            type: notification.notificationType,
            distance: bus.distanceToNextStop,
            estimatedTime: bus.estimatedArrival,
            timestamp: new Date().toLocaleString('vi-VN'),
            parentContact: {
              phone: notification.parentPhone,
              email: notification.parentEmail
            }
          };

          setSentNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
          
          // Mark as triggered
          setNotifications(prev => prev.map(n => 
            n.id === notification.id ? { ...n, triggered: true } : n
          ));

          // Simulate API call to notification service
          console.log('🔔 Sending notification:', newNotification);
        }
      });
    });
  }, [realTimeData, notifications]);

  const getNotificationMessage = (type: string, data: any) => {
    switch (type) {
      case 'approaching_pickup':
        return `🚌 Xe ${data.busNumber} sắp đến điểm đón ${data.stopName}! Cách ${data.distance.toFixed(1)}km, dự kiến ${data.estimatedTime}`;
      case 'approaching_dropoff':
        return `🏫 Xe ${data.busNumber} sắp đến trường! Cách ${data.distance.toFixed(1)}km, dự kiến ${data.estimatedTime}`;
      case 'arrived_pickup':
        return `✅ Xe ${data.busNumber} đã đến điểm đón ${data.stopName}. ${data.studentName} vui lòng lên xe!`;
      case 'arrived_dropoff':
        return `🎓 ${data.studentName} đã đến trường an toàn với xe ${data.busNumber}`;
      case 'delay':
        return `⏰ Xe ${data.busNumber} bị chậm khoảng ${data.delayMinutes} phút do giao thông`;
      default:
        return 'Thông báo từ hệ thống xe buýt trường học';
    }
  };

  const simulateNotificationSend = () => {
    // Simulate different notification methods
    const methods = [
      { type: 'SMS', status: 'sent', icon: '📱' },
      { type: 'Email', status: 'sent', icon: '📧' },
      { type: 'Push', status: 'sent', icon: '🔔' },
      { type: 'In-App', status: 'delivered', icon: '📲' }
    ];

    return methods;
  };

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-time Tracking & Notifications</h1>
          <p className="text-gray-600">Hệ thống giám sát và thông báo tự động cho phụ huynh</p>
        </div>
        
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {isConnected ? 'Kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>

      {/* Real-time Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Bus Data */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Dữ liệu GPS Real-time</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {realTimeData.map((bus) => (
              <div key={bus.busId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Navigation className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{bus.busNumber}</h4>
                      <p className="text-sm text-gray-500">ID: {bus.busId}</p>
                    </div>
                  </div>
                  
                  {bus.isDelayed && (
                    <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Chậm {bus.delayMinutes}p</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tọa độ:</span>
                    <p className="font-mono text-xs text-gray-900">
                      {bus.latitude.toFixed(6)}, {bus.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tốc độ:</span>
                    <p className="font-medium text-gray-900">{bus.speed.toFixed(1)} km/h</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Điểm dừng tiếp theo:</span>
                    <p className="font-medium text-gray-900">{bus.nextStopName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Khoảng cách:</span>
                    <p className="font-medium text-gray-900">{bus.distanceToNextStop.toFixed(2)} km</p>
                  </div>
                </div>
                
                <div className="mt-3 bg-gray-50 rounded p-2">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Học sinh trên xe: {bus.studentOnBoard.length}</span>
                    <span>Dự kiến đến: {bus.estimatedArrival}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Triggers */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Trigger Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">Thiết lập điều kiện tự động gửi thông báo</p>
          </div>
          
          <div className="p-6 space-y-4">
            {notifications.map((trigger) => (
              <div key={trigger.id} className={`border rounded-lg p-4 ${
                trigger.triggered ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{trigger.studentName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trigger.triggered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trigger.triggered ? 'Đã kích hoạt' : 'Chờ kích hoạt'}
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-500">Điểm dừng:</span> {trigger.stopName}</p>
                  <p><span className="text-gray-500">Loại:</span> {
                    trigger.notificationType === 'approaching_pickup' ? 'Sắp đến điểm đón' :
                    trigger.notificationType === 'approaching_dropoff' ? 'Sắp đến điểm trả' :
                    'Khác'
                  }</p>
                  <p><span className="text-gray-500">Khoảng cách kích hoạt:</span> {trigger.triggerDistance} km</p>
                  <p><span className="text-gray-500">Liên hệ:</span> {trigger.parentPhone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sent Notifications Log */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử Thông báo đã gửi</h3>
          <p className="text-sm text-gray-500 mt-1">Theo dõi các thông báo đã được gửi cho phụ huynh</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {sentNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Chưa có thông báo nào được gửi</p>
              <p className="text-sm">Thông báo sẽ được gửi tự động khi xe buýt gần đến điểm đón/trả</p>
            </div>
          ) : (
            sentNotifications.map((notification) => (
              <div key={notification.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-medium text-gray-900">{notification.studentName}</h4>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">
                      {getNotificationMessage(notification.type, notification)}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      {simulateNotificationSend().map((method, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs">
                          <span>{method.icon}</span>
                          <span className="text-gray-600">{method.type}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            method.status === 'sent' ? 'bg-green-100 text-green-700' :
                            method.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {method.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;