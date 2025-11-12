import { Plus, Edit, Trash2, Bus, Wrench, Fuel, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface BusInfo {
  id: number;
  busNumber: string;
  model: string;
  capacity: number;
  year: number;
  plateNumber: string;
  status: string;
  currentDriver?: string;
  currentRoute?: string;
  mileage: number;
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  condition: string;
}

interface BusManagementProps {
  busesData: BusInfo[];
  onAdd: () => void;
  onEdit: (bus: BusInfo) => void;
  onDelete: (id: number) => void;
}

const BusManagement = ({ busesData, onAdd, onEdit, onDelete }: BusManagementProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hoạt động':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'bảo trì':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hỏng hóc':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'không hoạt động':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'tốt':
        return 'text-green-600';
      case 'khá':
        return 'text-blue-600';
      case 'trung bình':
        return 'text-yellow-600';
      case 'kém':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFuelWidthClass = (fuelLevel: number) => {
    const level = Math.min(100, Math.max(0, fuelLevel));
    if (level >= 90) return 'w-full';
    if (level >= 80) return 'w-4/5';
    if (level >= 75) return 'w-3/4';
    if (level >= 66) return 'w-2/3';
    if (level >= 60) return 'w-3/5';
    if (level >= 50) return 'w-1/2';
    if (level >= 40) return 'w-2/5';
    if (level >= 33) return 'w-1/3';
    if (level >= 25) return 'w-1/4';
    if (level >= 20) return 'w-1/5';
    if (level >= 10) return 'w-1/12';
    return 'w-1/12';
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Xe buýt</h1>
          <p className="text-gray-600">Quản lý thông tin và trạng thái xe buýt</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Thêm Xe buýt
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tổng xe buýt</p>
              <p className="text-3xl font-bold">{busesData.length}</p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
              <Bus className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Đang hoạt động</p>
              <p className="text-3xl font-bold">
                {busesData.filter(b => b.status === 'Hoạt động').length}
              </p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Bảo trì</p>
              <p className="text-3xl font-bold">
                {busesData.filter(b => b.status === 'Bảo trì').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-30 rounded-lg">
              <Wrench className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Hỏng hóc</p>
              <p className="text-3xl font-bold">
                {busesData.filter(b => b.status === 'Hỏng hóc').length}
              </p>
            </div>
            <div className="p-3 bg-red-400 bg-opacity-30 rounded-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {busesData.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{bus.busNumber}</h3>
                    <p className="text-sm text-gray-600">{bus.plateNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bus.status)}`}>
                  {bus.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Model</p>
                  <p className="font-medium text-gray-900">{bus.model}</p>
                </div>
                <div>
                  <p className="text-gray-500">Năm sản xuất</p>
                  <p className="font-medium text-gray-900">{bus.year}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sức chứa</p>
                  <p className="font-medium text-gray-900">{bus.capacity} chỗ</p>
                </div>
                <div>
                  <p className="text-gray-500">Quãng đường</p>
                  <p className="font-medium text-gray-900">{bus.mileage.toLocaleString()} km</p>
                </div>
              </div>

              {/* Current Assignment */}
              {bus.currentDriver && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">ĐANG PHỤC VỤ</p>
                  <p className="text-sm font-medium text-gray-900">Tài xế: {bus.currentDriver}</p>
                  {bus.currentRoute && (
                    <p className="text-sm text-gray-600">Tuyến: {bus.currentRoute}</p>
                  )}
                </div>
              )}

              {/* Fuel Level */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Nhiên liệu</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{bus.fuelLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getFuelWidthClass(bus.fuelLevel)} ${getFuelLevelColor(bus.fuelLevel)}`}
                  ></div>
                </div>
              </div>

              {/* Condition */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Tình trạng</span>
                </div>
                <span className={`text-sm font-medium ${getConditionColor(bus.condition)}`}>
                  {bus.condition}
                </span>
              </div>

              {/* Maintenance */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bảo trì gần nhất:</span>
                  <span className="font-medium text-gray-900">{bus.lastMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bảo trì tiếp theo:</span>
                  <span className="font-medium text-gray-900">{bus.nextMaintenance}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 p-4 flex justify-end gap-2">
              <button
                onClick={() => onEdit(bus)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(bus.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {busesData.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <Bus className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Chưa có xe buýt nào</h3>
            <p className="text-sm text-center max-w-md">
              Thêm xe buýt đầu tiên để bắt đầu quản lý đội xe của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusManagement;