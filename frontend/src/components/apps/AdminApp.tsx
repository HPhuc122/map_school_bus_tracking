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

import type { User, FormField } from '../../types';
import { useAppData } from '../../contexts/AppDataContext';



interface AdminAppProps {
  user: User;
  onLogout: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ user, onLogout }) => {
  // Global data context
  const { 
    updateBusLocations, 
    syncBusLocationFromSchedule,
    scheduleData,
    setScheduleData,
    studentsData: globalStudentsData,
    addStudent,
    updateStudent,
    deleteStudent,
    driversData: globalDriversData,
    addDriver,
    updateDriver,
    deleteDriver,
    busesData: globalBusesData,
    addBus,
    updateBus,
    deleteBus
  } = useAppData();

  // App state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'schedule' | 'student' | 'driver' | 'bus'>('schedule');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Transform data for management components - use global data
  const studentsData = globalStudentsData.map(student => ({
    id: student.id,
    name: student.name || 'Chưa có tên',
    class: student.grade || 'Chưa xác định',    // Transform grade -> class for StudentManagement
    route: student.bus || 'Chưa phân tuyến',      // Transform bus -> route for StudentManagement
    pickup: student.pickup || 'Chưa xác định',
    dropoff: student.dropoff || 'Chưa xác định',
    parent: student.parent || 'Chưa có thông tin',
    phone: student.phone || 'Chưa có SĐT',
    status: student.status || 'Chưa xác định'
  }));
  
  // Transform global drivers data for AdminApp format
  const driversData = useMemo(() => globalDriversData.map(driver => ({
    id: driver.id,
    name: driver.name || 'Chưa có tên',
    phone: driver.phone || 'Chưa có SĐT',
    license: driver.license || 'Chưa có GPLX',
    experience: driver.experience ? 
      (typeof driver.experience === 'string' ? 
        parseInt(driver.experience.replace(' năm', '')) || 0 : 
        parseInt(driver.experience) || 0) : 0,
    status: driver.status || 'Chưa xác định',
    currentRoute: driver.bus ? 
      (typeof driver.bus === 'string' ? 
        driver.bus.replace('BS', 'Tuyến ') : 
        `Tuyến ${driver.bus}`) : 'Chưa phân tuyến',
    currentBus: driver.bus || 'Chưa phân xe'
  })), [globalDriversData]);
  
  // Use global buses data directly
  const busesData = globalBusesData;

  // Update current time
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Use ref to track sync state and prevent infinite loops
  const lastSyncRef = React.useRef({ busCount: 0, scheduleCount: 0 });

  // Sync data with location tracking when data count changes
  React.useEffect(() => {
    const currentBusCount = busesData.length;
    const currentScheduleCount = scheduleData.length;
    
    // Only sync if the data counts have actually changed
    if (currentBusCount !== lastSyncRef.current.busCount) {
      if (currentBusCount > 0) {
        updateBusLocations(busesData);
      }
      lastSyncRef.current.busCount = currentBusCount;
    }
    
    if (currentScheduleCount !== lastSyncRef.current.scheduleCount) {
      if (currentScheduleCount > 0) {
        syncBusLocationFromSchedule(scheduleData);
      }
      lastSyncRef.current.scheduleCount = currentScheduleCount;
    }
  }, [busesData, scheduleData, updateBusLocations, syncBusLocationFromSchedule]);

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
            setScheduleData(prev => prev.map(item => 
              item.id === editingItem.id ? { 
                ...item, 
                ...formData,
                students: parseInt(formData.students) || item.students
              } : item
            ));
            alert('Cập nhật lịch trình thành công!');
            break;
          case 'student':
            // Convert AdminApp format to context format
            const studentUpdate = {
              name: formData.name,
              grade: formData.grade,  // Use grade from form (not class)
              bus: formData.bus,      // Use bus from form (not route)
              pickup: formData.pickup || globalStudentsData.find(s => s.id === editingItem.id)?.pickup || '',
              dropoff: formData.dropoff || globalStudentsData.find(s => s.id === editingItem.id)?.dropoff || '',
              parent: formData.parent || globalStudentsData.find(s => s.id === editingItem.id)?.parent || '',
              phone: formData.phone || globalStudentsData.find(s => s.id === editingItem.id)?.phone || '',
              status: formData.status || globalStudentsData.find(s => s.id === editingItem.id)?.status || 'Chờ xe'
            };
            updateStudent(editingItem.id, studentUpdate);
            alert('Cập nhật học sinh thành công!');
            break;
          case 'driver':
            // Convert back to Driver format and update in global context
            const driverUpdate = {
              name: formData.name,
              phone: formData.phone, 
              license: formData.license,
              experience: `${parseInt(formData.experience) || 0} năm`,
              status: formData.status,
              bus: formData.bus || formData.currentBus
            };
            updateDriver(editingItem.id, driverUpdate);
            alert('Cập nhật tài xế thành công!');
            break;
          case 'bus':
            // Update bus in global context
            const busUpdate = {
              ...formData,
              capacity: parseInt(formData.capacity) || editingItem.capacity
            };
            updateBus(editingItem.id, busUpdate);
            alert('Cập nhật xe buýt thành công!');
            break;
        }
      } else {
        // Add new item with unique ID based on existing data
        let newId: number;
        switch (modalType) {
          case 'schedule':
            newId = Math.max(...scheduleData.map(s => s.id), 0) + 1;
            const newSchedule = {
              id: newId,
              route: formData.route,
              schedule_date: formData.schedule_date,  // ✅ NEW: Required field for API
              start_time: formData.start_time,        // ✅ NEW: Required field for API
              time: formData.time,
              students: parseInt(formData.students) || 0,
              driver: formData.driver,
              bus: formData.bus,
              status: formData.status || 'Hoạt động'
            };
            setScheduleData(prev => [...prev, newSchedule]);
            alert('Thêm lịch trình mới thành công!');
            break;
          case 'student':
            // Helper function to generate default pickup/dropoff times based on bus
            const generateDefaultTimes = (busNumber: string) => {
              const basePickupTimes: { [key: string]: string } = {
                'BS001': '07:15',
                'BS002': '07:20', 
                'BS003': '07:25'
              };
              const baseDropoffTimes: { [key: string]: string } = {
                'BS001': '16:30',
                'BS002': '16:35',
                'BS003': '16:40'
              };
              return {
                pickupTime: basePickupTimes[busNumber] || '07:15',
                dropoffTime: baseDropoffTimes[busNumber] || '16:30'
              };
            };

            const selectedBus = formData.bus || 'BS001';
            const defaultTimes = generateDefaultTimes(selectedBus);

            // Convert AdminApp format to context format
            const newStudentData = {
              name: formData.name,
              student_code: formData.student_code,    // ✅ NEW: Required field for API
              date_of_birth: formData.date_of_birth,  // ✅ NEW: Required field for API
              gender: formData.gender,                // ✅ NEW: Required field for API
              grade: formData.grade || 'Lớp 6A',      // Use grade from form
              bus: selectedBus,                       // Use bus from form
              pickup: formData.pickup || 'Chưa cập nhật địa chỉ đón',
              dropoff: formData.dropoff || 'Trường học',
              parent: formData.parent || 'Chưa cập nhật',
              phone: formData.phone || '0900000000',
              pickupTime: defaultTimes.pickupTime,    // Add required pickup time
              dropoffTime: defaultTimes.dropoffTime,  // Add required dropoff time
              status: 'Chờ xe'  // Default status for new students
            };
            addStudent(newStudentData);
            alert('Thêm học sinh mới thành công!');
            break;
          case 'driver':
            newId = Math.max(...driversData.map(d => d.id), 0) + 1;
            // Convert to Driver format for global context
            const newDriver = {
              name: formData.name,
              user_id: parseInt(formData.user_id) || 1,       // ✅ NEW: Required field for API
              employee_id: formData.employee_id,              // ✅ NEW: Required field for API
              phone: formData.phone,
              license: formData.license,
              license_type: formData.license_type,            // ✅ NEW: Required field for API
              license_expiry: formData.license_expiry,        // ✅ NEW: Required field for API
              experience: `${parseInt(formData.experience) || 0} năm`,
              status: 'Đang hoạt động',
              bus: formData.bus || 'BS001',
              rating: 5.0
            };
            addDriver(newDriver);
            alert('Thêm tài xế mới thành công!');
            break;
          case 'bus':
            // Add bus using global context
            const newBus = {
              busNumber: formData.busNumber,
              model: 'Standard Bus',
              capacity: parseInt(formData.capacity) || 0,
              year: 2024,
              plateNumber: `${formData.busNumber}-SCHOOL`,
              status: 'Đang hoạt động',
              currentDriver: '',
              currentRoute: '',
              mileage: 0,
              fuelLevel: 100,
              lastMaintenance: new Date().toLocaleDateString('vi-VN'),
              nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
              condition: 'Tốt'
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
          setScheduleData(prev => prev.filter(item => item.id !== id));
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
          adminData={{ name: user?.name || '', role: user?.role || '' }} 
          onNavigate={setActiveTab}
          onAddNew={(type) => handleAdd(type)}
        />;
      case 'schedule':
        return (
          <ScheduleManagement
            scheduleData={scheduleData}
            onAdd={() => handleAdd('schedule')}
            onEdit={(item) => handleEdit('schedule', item)}
            onDelete={(id) => deleteItem('schedule', id)}
          />
        );
      case 'students':
        return (
          <StudentManagement
            studentsData={studentsData}
            onAdd={() => handleAdd('student')}
            onEdit={(item) => handleEdit('student', item)}
            onDelete={(id) => deleteItem('student', id)}
          />
        );
      case 'drivers':
        return (
          <DriverManagement
            driversData={driversData}
            onAdd={() => handleAdd('driver')}
            onEdit={(item) => handleEdit('driver', item)}
            onDelete={(id) => deleteItem('driver', id)}
          />
        );
      case 'buses':
        return (
          <BusManagement
            busesData={busesData}
            onAdd={() => handleAdd('bus')}
            onEdit={(item) => handleEdit('bus', item)}
            onDelete={(id) => deleteItem('bus', id)}
          />
        );
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
          adminData={{ name: user?.name || '', role: user?.role || '' }} 
          onNavigate={setActiveTab}
          onAddNew={(type) => handleAdd(type)}
        />;
    }
  }, [activeTab, user, scheduleData, studentsData, driversData, busesData]);

  // Generate dynamic options from current data
  const generateDriverOptions = () => {
    return driversData.map(driver => ({
      value: driver.name,
      label: `${driver.name} (${driver.experience} năm kinh nghiệm)`
    }));
  };

  const generateBusOptions = () => {
    return busesData.map(bus => ({
      value: bus.busNumber,
      label: `${bus.busNumber} (${bus.capacity} chỗ ngồi)`
    }));
  };

  const generateRouteOptions = () => {
    // Get unique routes from existing schedules + default routes
    const existingRoutes = scheduleData.map(s => s.route);
    const defaultRoutes = ['Tuyến A1', 'Tuyến B2', 'Tuyến C3', 'Tuyến D4', 'Tuyến E5'];
    const allRoutes = [...new Set([...defaultRoutes, ...existingRoutes])];
    
    return allRoutes.map(route => ({
      value: route,
      label: `${route} - Khu vực`
    }));
  };

  // Get form fields for modal
  const getFormFields = (): FormField[] => {
    switch (modalType) {
      case 'schedule':
        return [
          { 
            name: 'route', 
            label: 'Tuyến đường', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tuyến đường cho lịch trình',
            options: generateRouteOptions()
          },
          { name: 'schedule_date', label: 'Ngày lịch trình', type: 'date', required: true, placeholder: 'Chọn ngày thực hiện lịch trình' },
          { name: 'start_time', label: 'Giờ bắt đầu', type: 'time', required: true, placeholder: 'VD: 07:30 (giờ bắt đầu chuyến)' },
          { name: 'time', label: 'Thời gian khởi hành', type: 'time', required: true, placeholder: 'VD: 07:30 (giờ bắt đầu chuyến)' },
          { name: 'students', label: 'Số học sinh dự kiến', type: 'number', required: true, placeholder: 'VD: 25 (số học sinh trên chuyến)' },
          { 
            name: 'driver', 
            label: 'Tài xế', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tài xế phụ trách',
            options: generateDriverOptions()
          },
          { 
            name: 'bus', 
            label: 'Xe buýt', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn xe buýt sử dụng',
            options: generateBusOptions()
          },
          { 
            name: 'status', 
            label: 'Trạng thái', 
            type: 'select', 
            placeholder: 'Chọn trạng thái lịch trình',
            options: [
              { value: 'Hoạt động', label: '✅ Hoạt động' },
              { value: 'Tạm dừng', label: '⏸️ Tạm dừng' },
              { value: 'Bảo trì', label: '🔧 Bảo trì' }
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
              { value: 'female', label: '👧 Nữ' },
              { value: 'other', label: '🧑 Khác' }
            ]
          },
          { name: 'grade', label: 'Lớp', type: 'text', required: true, placeholder: 'VD: Lớp 6A, Lớp 7B' },
          { 
            name: 'bus', 
            label: 'Xe buýt', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn xe buýt',
            options: generateBusOptions()
          },
          { name: 'pickup', label: 'Điểm đón', type: 'text', required: true, placeholder: 'VD: 123 Đường ABC, Quận 1, TP.HCM' },
          { name: 'dropoff', label: 'Điểm trả', type: 'text', required: true, placeholder: 'VD: Trường THCS XYZ, 456 Đường DEF' },
          { name: 'parent', label: 'Phụ huynh', type: 'text', required: true, placeholder: 'VD: Nguyễn Thị Mẹ (Mẹ)' },
          { name: 'phone', label: 'Điện thoại', type: 'text', required: true, placeholder: 'VD: 0901234567' }
        ];
      case 'driver':
        return [
          { name: 'name', label: 'Họ tên', type: 'text', required: true, placeholder: 'VD: Trần Văn Tài Xế' },
          { name: 'user_id', label: 'ID Người dùng', type: 'number', required: true, placeholder: 'VD: 1, 2, 3 (ID tài khoản)' },
          { name: 'employee_id', label: 'Mã nhân viên', type: 'text', required: true, placeholder: 'VD: EMP001, NV001' },
          { name: 'license', label: 'Số bằng lái', type: 'text', required: true, placeholder: 'VD: D123456789' },
          { 
            name: 'license_type', 
            label: 'Loại bằng lái', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn loại bằng lái',
            options: [
              { value: 'B1', label: 'B1 - Xe ô tô không kinh doanh vận tải' },
              { value: 'B2', label: 'B2 - Xe ô tô không kinh doanh vận tải (số sàn)' },
              { value: 'C', label: 'C - Xe ô tô tải và xe ô tô chở người' },
              { value: 'D', label: 'D - Xe ô tô chở người từ 9 chỗ ngồi trở lên' },
              { value: 'E', label: 'E - Xe ô tô kéo rơ moóc' },
              { value: 'FC', label: 'FC - Xe ô tô chở người 9 chỗ + C' }
            ]
          },
          { name: 'license_expiry', label: 'Ngày hết hạn GPLX', type: 'date', required: true, placeholder: 'Chọn ngày hết hạn bằng lái' },
          { name: 'phone', label: 'Điện thoại', type: 'text', required: true, placeholder: 'VD: 0987654321' },
          { 
            name: 'bus', 
            label: 'Xe buýt phụ trách', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn xe buýt để phụ trách',
            options: generateBusOptions()
          },
          { name: 'experience', label: 'Kinh nghiệm (năm)', type: 'number', required: true, placeholder: 'VD: 5 (số năm kinh nghiệm lái xe)' }
        ];
      case 'bus':
        return [
          { name: 'busNumber', label: 'Số xe', type: 'text', required: true, placeholder: 'VD: BS001, XB-123.45' },
          { name: 'capacity', label: 'Sức chứa', type: 'number', required: true, placeholder: 'VD: 45 (số ghế ngồi tối đa)' },
          { 
            name: 'currentDriver', 
            label: 'Tài xế phụ trách', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tài xế phụ trách xe này',
            options: generateDriverOptions()
          },
          { 
            name: 'currentRoute', 
            label: 'Tuyến đường', 
            type: 'select', 
            required: true,
            placeholder: 'Chọn tuyến đường hoạt động',
            options: generateRouteOptions()
          },
          { name: 'status', label: 'Trạng thái', type: 'select', placeholder: 'Chọn trạng thái hoạt động', options: [
            { value: 'Hoạt động', label: '✅ Hoạt động' },
            { value: 'Bảo trì', label: '🔧 Bảo trì' },
            { value: 'Ngừng hoạt động', label: '❌ Ngừng hoạt động' }
          ], required: true }
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