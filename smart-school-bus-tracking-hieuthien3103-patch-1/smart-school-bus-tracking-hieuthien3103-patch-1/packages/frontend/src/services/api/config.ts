// services/api/config.ts

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // Tăng timeout lên 30s cho real-time data
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints - Mapped to Database Schema
export const ENDPOINTS = {
  // ==================== AUTHENTICATION ====================
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // ==================== HỌC SINH (Students) ====================
  STUDENTS: {
    BASE: '/hocsinh', // hoặc '/students' tùy backend routing
    BY_ID: (id: number) => `/hocsinh/${id}`,
    BY_PARENT: (parentId: number) => `/hocsinh/phuhuynh/${parentId}`,
    BY_CLASS: (className: string) => `/hocsinh/lop/${className}`,
    UPDATE_STATUS: (id: number) => `/hocsinh/${id}/status`,
    ASSIGN_TO_SCHEDULE: '/hocsinh/assign',
  },
  
  // ==================== XE BUÝT (Buses) ====================
  BUSES: {
    BASE: '/xebuyt', // hoặc '/buses'
    BY_ID: (id: number) => `/xebuyt/${id}`,
    BY_DRIVER: (driverId: number) => `/xebuyt/taixe/${driverId}`,
    LOCATION: (id: number) => `/xebuyt/${id}/vitri`, // Lấy vị trí xe
    UPDATE_STATUS: (id: number) => `/xebuyt/${id}/status`,
    AVAILABLE: '/xebuyt/available', // Xe đang sẵn sàng
  },
  
  // ==================== TÀI XẾ (Drivers) ====================
  DRIVERS: {
    BASE: '/taixe', // hoặc '/drivers'
    BY_ID: (id: number) => `/taixe/${id}`,
    BY_MANAGER: (managerId: number) => `/taixe/quanly/${managerId}`,
    UPDATE_STATUS: (id: number) => `/taixe/${id}/status`,
    AVAILABLE: '/taixe/available',
  },
  
  // ==================== QUẢN LÝ TÀI XẾ (Driver Managers) ====================
  MANAGERS: {
    BASE: '/quanlytaixe',
    BY_ID: (id: number) => `/quanlytaixe/${id}`,
  },
  
  // ==================== PHỤ HUYNH (Parents) ====================
  PARENTS: {
    BASE: '/phuhuynh', // hoặc '/parents'
    BY_ID: (id: number) => `/phuhuynh/${id}`,
    BY_PHONE: (phone: string) => `/phuhuynh/sdt/${phone}`,
    STUDENTS: (id: number) => `/phuhuynh/${id}/hocsinh`,
  },
  
  // ==================== TUYẾN ĐƯỜNG (Routes) ====================
  ROUTES: {
    BASE: '/tuyenduong', // hoặc '/routes'
    BY_ID: (id: number) => `/tuyenduong/${id}`,
    DETAILS: (id: number) => `/tuyenduong/${id}/chitiet`, // Chi tiết tuyến (trạm)
    STOPS: (id: number) => `/tuyenduong/${id}/tram`, // Các trạm trên tuyến
  },
  
  // ==================== TRẠM XE (Stops) ====================
  STOPS: {
    BASE: '/tramxe', // hoặc '/stops'
    BY_ID: (id: number) => `/tramxe/${id}`,
    BY_TYPE: (type: 'don' | 'tra' | 'ca_hai') => `/tramxe/loai/${type}`,
  },
  
  // ==================== CHI TIẾT TUYẾN (Route Details) ====================
  ROUTE_DETAILS: {
    BASE: '/chitiettuyenduong',
    BY_ROUTE: (routeId: number) => `/chitiettuyenduong/tuyen/${routeId}`,
    BY_STOP: (stopId: number) => `/chitiettuyenduong/tram/${stopId}`,
  },
  
  // ==================== LỊCH TRÌNH (Schedules) ====================
  SCHEDULES: {
    BASE: '/lichtrinh', // hoặc '/schedules'
    BY_ID: (id: number) => `/lichtrinh/${id}`,
    BY_DATE: (date: string) => `/lichtrinh/ngay/${date}`,
    BY_DRIVER: (driverId: number) => `/lichtrinh/taixe/${driverId}`,
    BY_BUS: (busId: number) => `/lichtrinh/xe/${busId}`,
    BY_ROUTE: (routeId: number) => `/lichtrinh/tuyen/${routeId}`,
    TODAY: '/lichtrinh/today',
    UPDATE_STATUS: (id: number) => `/lichtrinh/${id}/status`,
  },
  
  // ==================== PHÂN CÔNG (Assignments) ====================
  ASSIGNMENTS: {
    BASE: '/phancong',
    BY_SCHEDULE: (scheduleId: number) => `/phancong/lich/${scheduleId}`,
    BY_STUDENT: (studentId: number) => `/phancong/hocsinh/${studentId}`,
    ASSIGN: '/phancong/assign',
    UNASSIGN: (id: number) => `/phancong/${id}/unassign`,
  },
  
  // ==================== NHẬT KÝ ĐÓN TRẢ (Pickup/Dropoff Log) ====================
  PICKUP_DROPOFF: {
    BASE: '/nhatkydontra',
    BY_ID: (id: number) => `/nhatkydontra/${id}`,
    BY_SCHEDULE: (scheduleId: number) => `/nhatkydontra/lich/${scheduleId}`,
    BY_STUDENT: (studentId: number) => `/nhatkydontra/hocsinh/${studentId}`,
    UPDATE_STATUS: (id: number) => `/nhatkydontra/${id}/status`,
    MARK_PICKUP: '/nhatkydontra/mark-pickup',
    MARK_DROPOFF: '/nhatkydontra/mark-dropoff',
    MARK_ABSENT: '/nhatkydontra/mark-absent',
  },
  
  // ==================== VỊ TRÍ XE (Bus Locations) ====================
  LOCATIONS: {
    BASE: '/vitrixe',
    BY_BUS: (busId: number) => `/vitrixe/xe/${busId}`,
    LATEST: (busId: number) => `/vitrixe/xe/${busId}/latest`, // Vị trí mới nhất
    HISTORY: (busId: number) => `/vitrixe/xe/${busId}/history`, // Lịch sử vị trí
    LIVE: '/vitrixe/live', // Tất cả xe đang chạy
  },
  
  // ==================== THÔNG BÁO (Notifications) ====================
  NOTIFICATIONS: {
    BASE: '/thongbao',
    BY_ID: (id: number) => `/thongbao/${id}`,
    BY_PARENT: (parentId: number) => `/thongbao/phuhuynh/${parentId}`,
    BY_DRIVER: (driverId: number) => `/thongbao/taixe/${driverId}`,
    SEND: '/thongbao/send',
    MARK_READ: (id: number) => `/thongbao/${id}/read`,
    UNREAD_COUNT: (userId: number, role: 'parent' | 'driver') => 
      `/thongbao/unread/${role}/${userId}`,
  },
  
  // ==================== REPORTS & ANALYTICS ====================
  REPORTS: {
    ATTENDANCE: '/reports/attendance',
    BUS_USAGE: '/reports/bus-usage',
    DRIVER_PERFORMANCE: '/reports/driver-performance',
    ROUTE_EFFICIENCY: '/reports/route-efficiency',
    DAILY_SUMMARY: (date: string) => `/reports/daily/${date}`,
  },
  
  // ==================== REAL-TIME TRACKING ====================
  TRACKING: {
    LIVE_BUSES: '/tracking/live-buses', // Tất cả xe đang chạy
    BUS_ROUTE: (busId: number) => `/tracking/bus/${busId}/route`,
    ETA: (busId: number, stopId: number) => `/tracking/bus/${busId}/eta/${stopId}`,
    ALERTS: '/tracking/alerts',
  },
  
  // ==================== HEALTH CHECK ====================
  HEALTH: '/health',
  VERSION: '/version',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập chức năng này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  TIMEOUT: 'Yêu cầu hết thời gian. Vui lòng thử lại.',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  PARENT: 'parent',
  MANAGER: 'manager', // Quản lý tài xế
} as const;

// Database Status Enums (mapped from SQL schema)
export const DB_STATUS = {
  // Student Status (hoat_dong, nghi)
  STUDENT: {
    ACTIVE: 'hoat_dong',
    INACTIVE: 'nghi',
  },
  
  // Driver Status (san_sang, dang_chay, nghi)
  DRIVER: {
    AVAILABLE: 'san_sang',
    DRIVING: 'dang_chay',
    OFF_DUTY: 'nghi',
  },
  
  // Bus Status (san_sang, dang_su_dung, bao_duong)
  BUS: {
    AVAILABLE: 'san_sang',
    IN_USE: 'dang_su_dung',
    MAINTENANCE: 'bao_duong',
  },
  
  // Schedule Status (cho_chay, dang_chay, hoan_thanh, huy)
  SCHEDULE: {
    PENDING: 'cho_chay',
    IN_PROGRESS: 'dang_chay',
    COMPLETED: 'hoan_thanh',
    CANCELLED: 'huy',
  },
  
  // Pickup Status (cho, da_don, vang)
  PICKUP: {
    WAITING: 'cho',
    PICKED: 'da_don',
    ABSENT: 'vang',
  },
  
  // Dropoff Status (cho, da_tra, vang)
  DROPOFF: {
    WAITING: 'cho',
    DROPPED: 'da_tra',
    ABSENT: 'vang',
  },
  
  // Shift Type (sang, chieu)
  SHIFT: {
    MORNING: 'sang',
    AFTERNOON: 'chieu',
  },
  
  // Stop Type (don, tra, ca_hai)
  STOP_TYPE: {
    PICKUP: 'don',
    DROPOFF: 'tra',
    BOTH: 'ca_hai',
  },
} as const;

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Bus tracking
  BUS_LOCATION_UPDATE: 'bus:location:update',
  BUS_STATUS_CHANGE: 'bus:status:change',
  
  // Schedule updates
  SCHEDULE_START: 'schedule:start',
  SCHEDULE_END: 'schedule:end',
  
  // Student pickup/dropoff
  STUDENT_PICKED: 'student:picked',
  STUDENT_DROPPED: 'student:dropped',
  
  // Notifications
  NEW_NOTIFICATION: 'notification:new',
  
  // Alerts
  EMERGENCY_ALERT: 'alert:emergency',
  DELAY_ALERT: 'alert:delay',
} as const;

export default API_CONFIG;