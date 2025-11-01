// AdminApp component - Full management system for administrators
import React, { useState, useMemo } from 'react';
import AdminDashboard from '../dashboard/AdminDashboard';
import ScheduleManagement from '../management/ScheduleManagement';
import StudentManagement from '../management/StudentManagement';
import DriverManagement from '../management/DriverManagement';
import BusManagement from '../management/BusManagement';
import LocationTracking from '../tracking/LocationTracking';
import NotificationCenter from '../notifications/NotificationCenter';
import Reports from '../reports/Reports';
import Settings from '../settings/Settings';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import Modal from '../shared/Modal';
import Form from '../shared/Form';

import type { User, Student, Schedule, Driver } from '../../types';
import { useStudents } from '../../contexts/StudentsContext';
import { useDrivers } from '../../contexts/DriversContext';
import { useBuses } from '../../contexts/BusesContext';
import { useSchedules } from '../../contexts/SchedulesContext';



interface AdminAppProps {
  user: User;
  onLogout: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ user, onLogout }) => {
  // Context con hooks
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { drivers, addDriver, updateDriver, deleteDriver } = useDrivers();
  const { buses, addBus, updateBus, deleteBus } = useBuses();
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useSchedules();

  // App state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'schedule' | 'student' | 'driver' | 'bus'>('schedule');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Transform data for management components - use global data
  const studentsData = students.map((student: Student) => ({
    ma_hs: student.ma_hs,
    ho_ten: student.ho_ten || 'Chưa có tên',
    lop: student.lop || 'Chưa xác định',
    ma_phu_huynh: student.ma_phu_huynh ? String(student.ma_phu_huynh) : 'N/A',
    ma_diem_don: student.ma_diem_don || 'Chưa xác định',
    ma_diem_tra: student.ma_diem_tra || 'Chưa xác định',
    trang_thai: student.trang_thai || 'Chưa xác định'
  }));
  
  // Transform global drivers data for AdminApp format
  const driversData = useMemo(() => drivers.map((driver: Driver) => ({
    ma_tai_xe: driver.ma_tai_xe,
    ho_ten: driver.ho_ten || 'Chưa có tên',
    so_dien_thoai: driver.so_dien_thoai || 'Chưa có SĐT',
    so_gplx: driver.so_gplx || 'Chưa có GPLX',
    trang_thai: driver.trang_thai || 'Chưa xác định',
    ma_ql: driver.ma_ql ? `BS${driver.ma_ql}` : 'Chưa phân xe',
    tai_khoan: driver.tai_khoan || '',
    mat_khau: driver.mat_khau || ''
  })), [drivers]);
  
  // Use global buses data directly
  const busesData = buses;

  // Update current time
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Use ref to track sync state and prevent infinite loops
  // Removed unused lastSyncRef

  // Nếu cần đồng bộ vị trí xe buýt, hãy chuyển logic này sang BusesContext hoặc LocationTracking

  // CRUD operations
  const handleAdd = (type: 'schedule' | 'student' | 'driver' | 'bus') => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (type: 'schedule' | 'student' | 'driver' | 'bus', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleFormSubmit = (formData: any) => {
    try {
      // Validate form data
      if (!formData || Object.keys(formData).length === 0) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      if (editingItem) {
        // Edit existing item
        switch (modalType) {
          case 'schedule':
            // UpdateSchedule method with database field names
            updateSchedule(editingItem.ma_lich_trinh, {
              ma_tuyen: formData.ma_tuyen,
              ma_xe: formData.ma_xe,
              ma_tai_xe: formData.ma_tai_xe,
              ngay_chay: formData.ngay_chay,
              gio_bat_dau: formData.gio_bat_dau,
              gio_ket_thuc: formData.gio_ket_thuc,
              trang_thai_lich: formData.trang_thai_lich
            });
            alert('Cập nhật lịch trình thành công!');
            break;
          case 'student':
            // Update student với các trường hợp lệ
            const studentUpdate: Partial<Student> = {
              ho_ten: formData.ho_ten,
              lop: formData.lop,
              ma_phu_huynh: Number(formData.ma_phu_huynh),
              ma_diem_don: Number(formData.ma_diem_don),
              ma_diem_tra: Number(formData.ma_diem_tra),
              trang_thai: formData.trang_thai
            };
            updateStudent(editingItem.ma_hoc_sinh, studentUpdate);
            alert('Cập nhật học sinh thành công!');
            break;
          case 'driver':
            // Update driver với các trường hợp lệ
            const driverUpdate: Partial<Driver> = {
              ho_ten: formData.ho_ten,
              so_dien_thoai: formData.so_dien_thoai,
              so_gplx: formData.so_gplx,
              trang_thai: formData.trang_thai,
              tai_khoan: formData.tai_khoan,
              mat_khau: formData.mat_khau,
              ma_ql: formData.ma_ql ? Number(formData.ma_ql) : null
            };
            updateDriver(editingItem.ma_tai_xe, driverUpdate);
            alert('Cập nhật tài xế thành công!');
            break;
          case 'bus':
            // Update bus in global context with correct database fields
            const busUpdate: Partial<import('../../types').Bus> = {
              bien_so: formData.bien_so,
              suc_chua: Number(formData.suc_chua),
              ma_tai_xe: formData.ma_tai_xe ? Number(formData.ma_tai_xe) : null,
              trang_thai: formData.trang_thai
            };
            updateBus(editingItem.ma_xe, busUpdate);
            alert('Cập nhật xe buýt thành công!');
            break;
        }
      } else {
  // Add new item with correct backend fields
        switch (modalType) {
          case 'schedule':
            // addSchedule method
            const newScheduleData: Omit<Schedule, 'ma_lich_trinh'> = {
              ma_lich: Number(formData.ma_lich),
              ma_tuyen: Number(formData.ma_tuyen),
              ma_xe: Number(formData.ma_xe),
              ma_tai_xe: Number(formData.ma_tai_xe),
              ngay_chay: formData.ngay_chay,
              gio_bat_dau: formData.gio_bat_dau,
              gio_ket_thuc: formData.gio_ket_thuc,
              trang_thai_lich: formData.trang_thai_lich
            };
            addSchedule(newScheduleData);
            alert('Thêm lịch trình mới thành công!');
            break;
          case 'student':
            // Tạo mới student với các trường hợp lệ
            const newStudentData: Omit<Student, 'ma_hoc_sinh'> = {
              ma_hs: formData.ma_hs,
              ho_ten: formData.ho_ten,
              lop: formData.lop,
              ma_phu_huynh: Number(formData.ma_phu_huynh),
              ma_diem_don: Number(formData.ma_diem_don),
              ma_diem_tra: Number(formData.ma_diem_tra),
              trang_thai: formData.trang_thai
            };
            addStudent(newStudentData);
            alert('Thêm học sinh mới thành công!');
            break;
          case 'driver':
            // Tạo mới driver với các trường hợp lệ
            const newDriver: Omit<Driver, 'ma_tai_xe'> = {
              ho_ten: formData.ho_ten,
              so_dien_thoai: formData.so_dien_thoai,
              so_gplx: formData.so_gplx,
              trang_thai: formData.trang_thai,
              tai_khoan: formData.tai_khoan,
              mat_khau: formData.mat_khau,
              ma_ql: formData.ma_ql ? Number(formData.ma_ql) : null
            };
            addDriver(newDriver);
            alert('Thêm tài xế mới thành công!');
            break;
          case 'bus':
            // Add bus using global context with correct database fields
            const newBus: Omit<import('../../types').Bus, 'ma_xe'> = {
              bien_so: formData.bien_so,
              suc_chua: Number(formData.suc_chua),
              ma_tai_xe: formData.ma_tai_xe ? Number(formData.ma_tai_xe) : null,
              trang_thai: formData.trang_thai
            };
            addBus(newBus);
            alert('Thêm xe buýt mới thành công!');
            break;
        }
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error handling form submit:', error);
      alert('Có lỗi xảy ra khi xử lý dữ liệu!');
    }
  };

  const deleteItem = (type: 'schedule' | 'student' | 'driver' | 'bus', id: number) => {
    const itemNames = {
      schedule: 'lịch trình',
      student: 'học sinh', 
      driver: 'tài xế',
      bus: 'xe buýt'
    };
    
    const confirmMessage = `Bạn có chắc chắn muốn xóa ${itemNames[type]} này không?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      switch (type) {
        case 'schedule':
          deleteSchedule(id);
          alert('Xóa lịch trình thành công!');
          break;
        case 'student':
          deleteStudent(id);
          alert('Xóa học sinh thành công!');
          break;
        case 'driver':
          deleteDriver(id);
          alert('Xóa tài xế thành công!');
          break;
        case 'bus':
          deleteBus(id);
          alert('Xóa xe buýt thành công!');
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Có lỗi xảy ra khi xóa!');
    }
  };

  // Render admin content based on active tab
  const renderAdminContent = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard 
          adminData={{ name: user?.ten || '', role: user?.role || '' }} 
          onNavigate={setActiveTab}
          onAddNew={(type) => handleAdd(type)}
        />;
      case 'schedule':
  // scheduleData is already transformed to display format
        // Just pass it directly to ScheduleManagement component
        return (
          <ScheduleManagement
            schedules={schedules}
            onAdd={() => handleAdd('schedule')}
            onEdit={(item) => handleEdit('schedule', item)}
            onDelete={(id) => deleteItem('schedule', id)}
          />
        );
      case 'students':
        return <StudentManagement />;
      case 'drivers':
        return (
          <DriverManagement
            driversData={drivers}
            onAdd={handleAdd.bind(null, 'driver')}
            onEdit={handleEdit.bind(null, 'driver')}
            onDelete={deleteItem.bind(null, 'driver')}
          />
        );
      case 'buses':
        return <BusManagement busesData={busesData} onAdd={handleAdd.bind(null, 'bus')} onEdit={handleEdit.bind(null, 'bus')} onDelete={deleteItem.bind(null, 'bus')} />;
      case 'tracking':
        return <LocationTracking />;
      case 'notifications':
        return <NotificationCenter />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard 
          adminData={{ name: user?.ten || '', role: user?.role || '' }} 
          onNavigate={setActiveTab}
          onAddNew={(type) => handleAdd(type)}
        />;
    }
  }, [activeTab, user, schedules, studentsData, driversData, busesData]);

  // Generate dynamic options from current data
  const generateDriverOptions = () => {
    return driversData.map((driver) => ({
      value: driver.ho_ten,
      label: `${driver.ho_ten}`
    }));
  };

  const generateBusOptions = () => {
    return busesData.map(bus => ({
      value: bus.bien_so,
      label: `${bus.bien_so} (${bus.suc_chua} chỗ ngồi)`
    }));
  };

  const generateRouteOptions = () => {
    // Get unique routes from existing schedules + default routes
  const existingRoutes = schedules.map((s: Schedule) => `Tuyến ${s.ma_tuyen}`);
    const defaultRoutes = ['Tuyến A1', 'Tuyến B2', 'Tuyến C3', 'Tuyến D4', 'Tuyến E5'];
    const allRoutes = [...new Set([...defaultRoutes, ...existingRoutes])];
    
    return allRoutes.map(route => ({
      value: route,
      label: `${route} - Khu vực`
    }));
  };

  // Get form fields for modal
  // Replace with correct type or any if FormField is not defined
  const getFormFields = (): any[] => {
    switch (modalType) {
      case 'schedule':
        return [
          { 
            name: 'route_id', 
            label: 'Tuyến đường', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tuyến đường cho lịch trình',
            options: generateRouteOptions()
          },
          { 
            name: 'driver_id', 
            label: 'Tài xế', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tài xế phụ trách',
            options: generateDriverOptions()
          },
          { 
            name: 'bus_id', 
            label: 'Xe buýt', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn xe buýt sử dụng',
            options: generateBusOptions()
          },
          { name: 'schedule_date', label: 'Ngày lịch trình', type: 'date', required: true, placeholder: 'Chọn ngày thực hiện lịch trình' },
          { name: 'start_time', label: 'Giờ bắt đầu', type: 'time', required: true, placeholder: 'VD: 07:00 (giờ bắt đầu chuyến)' },
          { name: 'end_time', label: 'Giờ kết thúc', type: 'time', required: true, placeholder: 'VD: 08:30 (giờ dự kiến kết thúc)' },
          { 
            name: 'status', 
            label: 'Trạng thái', 
            type: 'select', 
            placeholder: 'Chọn trạng thái lịch trình',
            options: [
              { value: 'cho_chay', label: '📅 Chờ chạy' },
              { value: 'dang_chay', label: '🚌 Đang chạy' },
              { value: 'hoan_thanh', label: '✅ Hoàn thành' },
              { value: 'huy', label: '❌ Đã hủy' }
            ], 
            required: true 
          }
        ];
      case 'student':
        return [
          { name: 'name', label: 'Họ tên', type: 'text', required: true, placeholder: 'VD: Nguyễn Văn An' },
          { name: 'student_code', label: 'Mã học sinh', type: 'text', required: true, placeholder: 'VD: HS001, HS002' },
          { name: 'date_of_birth', label: 'Ngày sinh', type: 'date', required: true, placeholder: 'Chọn ngày sinh' },
          { 
            name: 'gender', 
            label: 'Giới tính', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn giới tính',
            options: [
              { value: 'male', label: '👦 Nam' },
              { value: 'female', label: '👧 Nữ' }
            ]
          },
          { name: 'grade', label: 'Khối', type: 'text', required: true, placeholder: 'VD: 6, 7, 8, 9' },
          { name: 'class', label: 'Lớp', type: 'text', required: true, placeholder: 'VD: 6A, 7B, 8C' },
          { name: 'address', label: 'Địa chỉ', type: 'text', required: true, placeholder: 'VD: 123 Đường ABC, Quận 1, TP.HCM' },
          { name: 'pickup_address', label: 'Điểm đón', type: 'text', required: true, placeholder: 'VD: Ngã tư ABC, gần siêu thị XYZ' },
          { name: 'dropoff_address', label: 'Điểm trả', type: 'text', required: true, placeholder: 'VD: Cổng trường THCS XYZ' },
          { 
            name: 'school_id', 
            label: 'Trường học', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn trường học',
            options: [] // TODO: Add school options from database
          },
          { 
            name: 'route_id', 
            label: 'Tuyến đường', 
            type: 'select', 
            required: false,
            placeholder: 'Chọn tuyến đường (tùy chọn)',
            options: generateRouteOptions()
          },
          { 
            name: 'stop_id', 
            label: 'Điểm dừng', 
            type: 'select', 
            required: false,
            placeholder: 'Chọn điểm dừng (tùy chọn)',
            options: [] // TODO: Add stop options based on selected route
          },
          { 
            name: 'status', 
            label: 'Trạng thái', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn trạng thái',
            options: [
              { value: 'active', label: '✅ Đang học' },
              { value: 'inactive', label: '⏸️ Tạm nghỉ' },
              { value: 'transferred', label: '🔄 Chuyển trường' },
              { value: 'graduated', label: '🎓 Tốt nghiệp' }
            ]
          },
          { name: 'medical_notes', label: 'Ghi chú y tế', type: 'textarea', required: false, placeholder: 'VD: Dị ứng thuốc kháng sinh' },
          { name: 'allergies', label: 'Dị ứng', type: 'textarea', required: false, placeholder: 'VD: Dị ứng hải sản, phấn hoa' },
          { name: 'emergency_instructions', label: 'Hướng dẫn khẩn cấp', type: 'textarea', required: false, placeholder: 'VD: Liên hệ bố mẹ ngay khi có vấn đề' }
        ];
      case 'driver':
        return [
          { name: 'name', label: 'Họ tên', type: 'text', required: true, placeholder: 'VD: Trần Văn Tài Xế' },
          { name: 'phone', label: 'Điện thoại', type: 'text', required: true, placeholder: 'VD: 0987654321' },
          { name: 'license_number', label: 'Số bằng lái', type: 'text', required: true, placeholder: 'VD: D123456789' },
          { name: 'experience', label: 'Kinh nghiệm (năm)', type: 'number', required: true, placeholder: 'VD: 5 (số năm kinh nghiệm lái xe)' },
          { name: 'hire_date', label: 'Ngày tuyển dụng', type: 'date', required: true, placeholder: 'Chọn ngày bắt đầu làm việc' },
          { 
            name: 'current_bus_id', 
            label: 'Xe buýt phụ trách', 
            type: 'select', 
            required: false,
            placeholder: 'Chọn xe buýt để phụ trách (tùy chọn)',
            options: generateBusOptions()
          },
          { 
            name: 'status', 
            label: 'Trạng thái', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn trạng thái làm việc',
            options: [
              { value: 'active', label: '✅ Đang làm việc' },
              { value: 'inactive', label: '⏸️ Tạm nghỉ' },
              { value: 'on_leave', label: '🏖️ Nghỉ phép' }
            ]
          },
          { name: 'emergency_contact_name', label: 'Người liên hệ khẩn cấp', type: 'text', required: false, placeholder: 'VD: Nguyễn Thị Vợ' },
          { name: 'emergency_contact_phone', label: 'SĐT liên hệ khẩn cấp', type: 'text', required: false, placeholder: 'VD: 0912345678' },
          { name: 'address', label: 'Địa chỉ', type: 'text', required: false, placeholder: 'VD: 123 Đường ABC, Quận 1' },
          { name: 'notes', label: 'Ghi chú', type: 'textarea', required: false, placeholder: 'VD: Ghi chú về tài xế' }
        ];
      case 'bus':
        return [
          { 
            name: 'license_plate', 
            label: 'Biển số xe', 
            type: 'text', 
            required: true, 
            placeholder: 'VD: 30A-10001, 29B-12345' 
          },
          { 
            name: 'capacity', 
            label: 'Sức chứa', 
            type: 'number', 
            required: true, 
            placeholder: 'VD: 40 (số ghế ngồi tối đa)' 
          },
          { 
            name: 'driver_id', 
            label: 'Tài xế phụ trách', 
            type: 'select', 
            required: false,
            placeholder: 'Chọn tài xế phụ trách xe này (không bắt buộc)',
            options: generateDriverOptions()
          },
          { 
            name: 'status', 
            label: 'Trạng thái', 
            type: 'select', 
            placeholder: 'Chọn trạng thái xe buýt', 
            options: [
              { value: 'san_sang', label: '✅ Sẵn sàng' },
              { value: 'dang_su_dung', label: '🚌 Đang sử dụng' },
              { value: 'bao_duong', label: '🔧 Bảo dưỡng' }
            ], 
            required: true 
          }
        ];
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    const action = editingItem ? 'Chỉnh sửa' : 'Thêm mới';
    const type = modalType === 'schedule' ? 'Lịch trình' :
                 modalType === 'student' ? 'Học sinh' :
                 modalType === 'driver' ? 'Tài xế' :
                 modalType === 'bus' ? 'Xe buýt' : 'Mục';
    return `${action} ${type}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentTime={currentTime}
          onLogout={onLogout}
          user={user}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderAdminContent}
        </main>
      </div>
      
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={getModalTitle()}
      >
        <Form
          fields={getFormFields().map(field => ({
            ...field,
            defaultValue: editingItem ? editingItem[field.name] : field.defaultValue
          }))}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
          isEditing={!!editingItem}
        />
      </Modal>
    </div>
  );
};