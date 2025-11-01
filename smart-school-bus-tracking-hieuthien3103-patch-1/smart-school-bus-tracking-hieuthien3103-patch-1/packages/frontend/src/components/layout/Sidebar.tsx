import { 
  BarChart3, 
  Bus, 
  Calendar, 
  MapPin, 
  Bell, 
  GraduationCap,
  UserCheck,
  FileText,
  Settings
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'schedule', label: 'Quản lý Lịch trình', icon: Calendar },
    { id: 'tracking', label: 'Theo dõi Vị trí', icon: MapPin },
    { id: 'students', label: 'Quản lý Học sinh', icon: GraduationCap },
    { id: 'drivers', label: 'Quản lý Tài xế', icon: UserCheck },
    { id: 'buses', label: 'Quản lý Xe buýt', icon: Bus },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: FileText },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bus className="h-6 w-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Smart School Bus</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;