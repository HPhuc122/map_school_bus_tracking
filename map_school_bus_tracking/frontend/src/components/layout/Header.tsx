import { Menu, X, Clock, Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTime: Date;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout?: () => void;
  user?: any;
}

const Header = ({ currentTime, sidebarOpen, setSidebarOpen, onLogout, user }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Bell className="h-4 w-4 mr-1" />
            <span>3 thông báo</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role === 'admin' ? 'Quản trị viên' : 
                 user?.role === 'parent' ? 'Phụ huynh' : 
                 user?.role === 'driver' ? 'Tài xế' : user?.role}
              </div>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0) || user?.role?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;