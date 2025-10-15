import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, Filter, Search, MoreVertical, Clock, User, MessageSquare } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionRequired?: boolean;
  relatedBus?: string;
  relatedRoute?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'error',
      title: 'Xe BS001 gặp sự cố',
      message: 'Xe buýt BS001 trên tuyến A1 báo cáo sự cố động cơ. Cần hỗ trợ kỹ thuật ngay lập tức.',
      timestamp: '2 phút trước',
      isRead: false,
      priority: 'high',
      category: 'Kỹ thuật',
      actionRequired: true,
      relatedBus: 'BS001',
      relatedRoute: 'Tuyến A1'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Đã đến giờ bảo trì định kỳ',
      message: 'Xe buýt BS003 đã đến lịch bảo trì định kỳ 10,000 km. Vui lòng sắp xếp lịch bảo trì.',
      timestamp: '15 phút trước',
      isRead: false,
      priority: 'medium',
      category: 'Bảo trì',
      actionRequired: true,
      relatedBus: 'BS003'
    },
    {
      id: 3,
      type: 'info',
      title: 'Cập nhật lộ trình',
      message: 'Lộ trình tuyến B2 đã được cập nhật do tình hình giao thông. Thời gian dự kiến tăng 5 phút.',
      timestamp: '30 phút trước',
      isRead: true,
      priority: 'low',
      category: 'Lộ trình',
      relatedRoute: 'Tuyến B2'
    },
    {
      id: 4,
      type: 'success',
      title: 'Hoàn thành chuyến đi',
      message: 'Xe buýt BS002 đã hoàn thành chuyến đi buổi sáng với 98% đúng giờ.',
      timestamp: '1 giờ trước',
      isRead: true,
      priority: 'low',
      category: 'Vận hành'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Mức nhiên liệu thấp',
      message: 'Xe buýt BS004 có mức nhiên liệu dưới 20%. Cần tiếp nhiên liệu trước chuyến đi tiếp theo.',
      timestamp: '2 giờ trước',
      isRead: false,
      priority: 'medium',
      category: 'Nhiên liệu',
      actionRequired: true,
      relatedBus: 'BS004'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now(),
          type: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as any,
          title: 'Thông báo mới',
          message: 'Đây là thông báo được tạo tự động để demo tính năng real-time.',
          timestamp: 'Vừa xong',
          isRead: false,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          category: 'Hệ thống'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = !showUnreadOnly || !notif.isRead;
    
    return matchesFilter && matchesSearch && matchesUnread;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trung tâm Thông báo</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả thông báo hệ thống</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            disabled={unreadCount === 0}
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng thông báo</p>
              <p className="text-xl font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chưa đọc</p>
              <p className="text-xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ưu tiên cao</p>
              <p className="text-xl font-semibold text-gray-900">{highPriorityCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Cần xử lý</p>
              <p className="text-xl font-semibold text-gray-900">
                {notifications.filter(n => n.actionRequired && !n.isRead).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'error', 'warning', 'info', 'success'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === type
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Tất cả' : 
                 type === 'error' ? 'Lỗi' :
                 type === 'warning' ? 'Cảnh báo' :
                 type === 'info' ? 'Thông tin' : 'Thành công'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Chỉ chưa đọc</span>
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo nào</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Không tìm thấy thông báo phù hợp với tìm kiếm của bạn' : 'Tất cả thông báo đã được xử lý'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all hover:shadow-md ${
                !notif.isRead ? 'border-l-blue-500 bg-blue-50' : 'border-l-gray-300'
              } ${getTypeColor(notif.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </h3>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(notif.priority)}`}></div>
                        {notif.actionRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Cần xử lý
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.timestamp}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {notif.category}
                        </div>
                        {notif.relatedBus && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {notif.relatedBus}
                          </span>
                        )}
                        {notif.relatedRoute && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {notif.relatedRoute}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Xóa thông báo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <button 
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                        title="Thêm tùy chọn"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;