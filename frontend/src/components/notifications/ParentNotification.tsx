import { useState, useEffect } from 'react';
import { Bell, MapPin, Clock, Bus, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface NotificationData {
  id: number;
  type: 'pickup' | 'dropoff' | 'delay' | 'arrived';
  busNumber: string;
  studentName: string;
  stopName: string;
  estimatedTime: string;
  distance: number; // khoảng cách tính bằng km
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

const ParentNotification = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: 1,
      type: 'pickup',
      busNumber: 'BS001',
      studentName: 'Nguyễn Minh An',
      stopName: 'Ngã tư Trần Duy Hưng',
      estimatedTime: '7:15 AM',
      distance: 0.8,
      timestamp: '2 phút trước',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'dropoff',
      busNumber: 'BS002',
      studentName: 'Trần Thị Lan',
      stopName: 'Trường THCS Giảng Võ',
      estimatedTime: '4:30 PM',
      distance: 1.2,
      timestamp: '5 phút trước',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'delay',
      busNumber: 'BS001',
      studentName: 'Nguyễn Minh An',
      stopName: 'Ngã tư Trần Duy Hưng',
      estimatedTime: '7:25 AM',
      distance: 2.5,
      timestamp: '1 phút trước',
      isRead: true,
      priority: 'high'
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification
      const newNotification: NotificationData = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'pickup' : 'dropoff',
        busNumber: `BS00${Math.floor(Math.random() * 3) + 1}`,
        studentName: 'Học sinh mẫu',
        stopName: 'Điểm dừng mẫu',
        estimatedTime: new Date(Date.now() + 10 * 60000).toLocaleTimeString('vi-VN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        distance: Math.random() * 2,
        timestamp: 'Vừa xong',
        isRead: false,
        priority: 'medium'
      };

      // Only add if distance < 1km (trigger condition)
      if (newNotification.distance < 1) {
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'dropoff':
        return <MapPin className="h-5 w-5 text-green-600" />;
      case 'delay':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'arrived':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationMessage = (notification: NotificationData) => {
    switch (notification.type) {
      case 'pickup':
        return {
          title: '🚌 Xe buýt sắp đến điểm đón!',
          message: `Xe ${notification.busNumber} sẽ đến ${notification.stopName} lúc ${notification.estimatedTime}`,
          subtitle: `Cách điểm đón ${notification.distance.toFixed(1)}km`
        };
      case 'dropoff':
        return {
          title: '🏫 Xe buýt sắp đến điểm trả!',
          message: `Xe ${notification.busNumber} sẽ đến ${notification.stopName} lúc ${notification.estimatedTime}`,
          subtitle: `Cách điểm trả ${notification.distance.toFixed(1)}km`
        };
      case 'delay':
        return {
          title: '⏰ Xe buýt bị chậm lịch trình',
          message: `Xe ${notification.busNumber} dự kiến đến ${notification.stopName} lúc ${notification.estimatedTime}`,
          subtitle: `Chậm khoảng 10 phút do giao thông`
        };
      case 'arrived':
        return {
          title: '✅ Xe buýt đã đến điểm đón',
          message: `Xe ${notification.busNumber} đã đến ${notification.stopName}`,
          subtitle: `${notification.studentName} vui lòng lên xe`
        };
      default:
        return {
          title: 'Thông báo',
          message: 'Có thông báo mới',
          subtitle: ''
        };
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    const baseClasses = isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4';
    
    if (isRead) return baseClasses;
    
    switch (type) {
      case 'pickup':
        return `${baseClasses} border-l-blue-500`;
      case 'dropoff':
        return `${baseClasses} border-l-green-500`;
      case 'delay':
        return `${baseClasses} border-l-yellow-500`;
      case 'arrived':
        return `${baseClasses} border-l-green-500`;
      default:
        return `${baseClasses} border-l-gray-500`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo cho Phụ huynh</h1>
          <p className="text-gray-600">Theo dõi vị trí xe buýt và nhận thông báo real-time</p>
        </div>
        
        {/* Bell Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Thông báo chưa đọc</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Xe đang di chuyển</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <Bus className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Thời gian trung bình</p>
              <p className="text-2xl font-bold">25 phút</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thông báo gần đây</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Chưa có thông báo</p>
              <p className="text-sm">Bạn sẽ nhận được thông báo khi xe buýt sắp đến điểm đón/trả</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const notifData = getNotificationMessage(notification);
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${getNotificationBgColor(notification.type, notification.isRead)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notifData.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'} mb-1`}>
                          {notifData.message}
                        </p>
                        
                        {notifData.subtitle && (
                          <p className="text-xs text-gray-500 mb-2">
                            {notifData.subtitle}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>🎓 {notification.studentName}</span>
                          <span>⏰ {notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                        title="Xóa thông báo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentNotification;