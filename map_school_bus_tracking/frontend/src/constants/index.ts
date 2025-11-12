// Constants for Smart School Bus System

export const USER_ROLES = {
  ADMIN: 'admin',
  PARENT: 'parent',
  DRIVER: 'driver'
} as const;

export const BUS_STATUS = {
  MOVING: 'Đang di chuyển',
  PICKING_UP: 'Dừng đón khách',
  INCIDENT: 'Sự cố',
  LUNCH_BREAK: 'Nghỉ trưa'
} as const;

export const DEMO_ACCOUNTS = {
  admin: { 
    username: 'admin', 
    password: 'admin123',
    displayName: 'Quản trị viên'
  },
  parent: { 
    username: 'parent', 
    password: 'parent123',
    displayName: 'Phụ huynh'
  },
  driver: { 
    username: 'driver', 
    password: 'driver123',
    displayName: 'Tài xế'
  }
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const;

export const TABS = {
  DASHBOARD: 'dashboard',
  SCHEDULE: 'schedule',
  STUDENTS: 'students',
  DRIVERS: 'drivers',
  BUSES: 'buses',
  TRACKING: 'tracking',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  SETTINGS: 'settings'
} as const;

export const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds

export const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: BUS_STATUS.MOVING, label: 'Đang di chuyển' },
  { key: BUS_STATUS.PICKING_UP, label: 'Dừng đón khách' },
  { key: BUS_STATUS.INCIDENT, label: 'Sự cố' }
];