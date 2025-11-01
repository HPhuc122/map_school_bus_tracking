import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Schedule } from '../../types';

interface ScheduleManagementProps {
  schedules: Schedule[];
  onAdd: () => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (ma_lich: number) => void;
}

const ScheduleManagement = ({ schedules, onAdd, onEdit, onDelete }: ScheduleManagementProps) => {
  // Calculate stats
  const activeSchedules = schedules.filter(s => s.trang_thai_lich === 'dang_chay').length;
  const waitingSchedules = schedules.filter(s => s.trang_thai_lich === 'cho_chay').length;
  const completedSchedules = schedules.filter(s => s.trang_thai_lich === 'hoan_thanh').length;
  const canceledSchedules = schedules.filter(s => s.trang_thai_lich === 'huy').length;

  // Tổng số học sinh: tính tổng số phân công (nếu có)
  const totalStudents = schedules.reduce((sum, s) => sum + (s.phan_cong ? s.phan_cong.length : 0), 0);

  // Show empty state when no data
  if (schedules.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Lịch trình</h1>
            <p className="text-gray-600 mt-1">Quản lý lịch trình xe buýt trường học</p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm lịch trình
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch trình nào</h3>
            <p className="text-gray-500 mb-6">
              Hiện tại chưa có dữ liệu lịch trình từ server. Vui lòng kiểm tra kết nối backend API hoặc thêm lịch trình mới.
            </p>
            <button 
              onClick={onAdd}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-5 w-5" />
              Thêm lịch trình đầu tiên
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Lịch trình</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch trình xe buýt trường học</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm lịch trình
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lịch trình</p>
              <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang chạy</p>
              <p className="text-2xl font-bold text-green-600">{activeSchedules}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ chạy</p>
              <p className="text-2xl font-bold text-yellow-600">{waitingSchedules}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng học sinh</p>
              <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày chạy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ bắt đầu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài xế</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.ma_lich}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.ma_lich}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.tuyen?.ten_tuyen || schedule.ma_tuyen || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.ngay_chay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.gio_bat_dau}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.tai_xe?.ho_ten || schedule.ma_tai_xe || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.xe?.bien_so || schedule.ma_xe || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.phan_cong ? schedule.phan_cong.length : 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      schedule.trang_thai_lich === 'dang_chay' ? 'bg-green-100 text-green-800' :
                      schedule.trang_thai_lich === 'cho_chay' ? 'bg-yellow-100 text-yellow-800' :
                      schedule.trang_thai_lich === 'hoan_thanh' ? 'bg-blue-100 text-blue-800' :
                      schedule.trang_thai_lich === 'huy' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.trang_thai_lich === 'dang_chay' ? 'Đang chạy' :
                        schedule.trang_thai_lich === 'cho_chay' ? 'Chờ chạy' :
                        schedule.trang_thai_lich === 'hoan_thanh' ? 'Hoàn thành' :
                        schedule.trang_thai_lich === 'huy' ? 'Hủy' :
                        schedule.trang_thai_lich}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onEdit(schedule)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="Chỉnh sửa lịch trình"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(schedule.ma_lich)}
                        className="text-red-600 hover:text-red-900" 
                        title="Xóa lịch trình"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;