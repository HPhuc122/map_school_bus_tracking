// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Students
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id: number) => `/students/${id}`,
    BY_BUS: (busId: number) => `/students/bus/${busId}`,
    BY_DRIVER: (driverId: number) => `/students/driver/${driverId}`,
    BY_ROUTE: (routeId: number) => `/students/by-route/${routeId}`,
    BY_SCHOOL: (schoolId: number) => `/students/school/${schoolId}`,
  },
  
  // Buses
  BUSES: {
    BASE: '/buses',
    BY_ID: (id: number) => `/buses/${id}`,
    TRACKING: (id: number) => `/buses/${id}/tracking`,
    ROUTE: (id: number) => `/buses/${id}/route`,
    STATUS: (id: number) => `/buses/${id}/status`,
  },
  
  // Drivers
  DRIVERS: {
    BASE: '/drivers',
    BY_ID: (id: number) => `/drivers/${id}`,
    SCHEDULE: (id: number) => `/drivers/${id}/schedule`,
    BY_BUS: (busId: number) => `/drivers/bus/${busId}`,
  },
  
  // Schools
  SCHOOLS: {
    BASE: '/schools',
    BY_ID: (id: number) => `/schools/${id}`,
  },
  
  // Routes
  ROUTES: {
    BASE: '/routes',
    BY_ID: (id: number) => `/routes/${id}`,
    STOPS: (id: number) => `/routes/${id}/stops`,
    BY_SCHOOL: (schoolId: number) => `/routes/school/${schoolId}`,
  },
  
  // Parents
  PARENTS: {
    BASE: '/parents',
    BY_ID: (id: number) => `/parents/${id}`,
    BY_STUDENT: (studentId: number) => `/parents/student/${studentId}`,
  },
  
  // Schedules
  SCHEDULES: {
    BASE: '/schedules',
    BY_ID: (id: number) => `/schedules/${id}`,
    BY_DATE: (date: string) => `/schedules/date/${date}`,
    BY_DRIVER: (driverId: number) => `/schedules/driver/${driverId}`,
  },
  
  // Attendance
  ATTENDANCE: {
    BASE: '/attendance',
    BY_SCHEDULE: (scheduleId: number) => `/attendance/schedule/${scheduleId}`,
    BY_STUDENT: (studentId: number) => `/attendance/student/${studentId}`,
    MARK: '/attendance/mark',
  },
  
  // Real-time tracking
  TRACKING: {
    LIVE: '/tracking/live',
    HISTORY: '/tracking/history',
    ALERTS: '/tracking/alerts',
    BY_BUS: (busId: number) => `/tracking/bus/${busId}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    SEND: '/notifications/send',
    BY_USER: (userId: string) => `/notifications/user/${userId}`,
  },
  
  // Health Check
  HEALTH: '/health',
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
  INTERNAL_SERVER_ERROR: 500,
} as const;