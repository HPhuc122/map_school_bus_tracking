
// ================= Database-aligned Types =================

export type UserRole = 'admin' | 'driver' | 'parent';

export interface User {
  ten: string;
  id: number;
  username: string;
  role: UserRole;
}

// ==================== PHỤ HUYNH (PARENTS) ====================
export interface Parent {
  ma_phu_huynh: number;
  ho_ten: string;
  so_dien_thoai: string;
  email: string | null;
  dia_chi: string | null;
  tai_khoan: string;
  mat_khau: string;
}

// ==================== HỌC SINH (STUDENTS) ====================
export type StudentStatus = 'hoat_dong' | 'nghi';

export interface Student {
  ma_hs: number;
  ho_ten: string;
  lop: string | null;
  ma_phu_huynh: number;
  ma_diem_don: number;  // ID trạm đón
  ma_diem_tra: number;  // ID trạm trả
  trang_thai: StudentStatus;
  
  // Relations (populated từ API)
  phu_huynh?: Parent;
  diem_don?: Stop;
  diem_tra?: Stop;
}

// ==================== QUẢN LÝ TÀI XẾ ====================
export interface DriverManager {
  ma_ql: number;
  ho_ten: string;
  so_dien_thoai: string;
  email: string | null;
  tai_khoan: string;
  mat_khau: string;
  dia_chi: string | null;
}

// ==================== TÀI XẾ (DRIVERS) ====================
export type DriverStatus = 'san_sang' | 'dang_chay' | 'nghi';

export interface Driver {
  ma_tai_xe: number;
  ho_ten: string;
  so_dien_thoai: string;
  so_gplx: string;
  trang_thai: DriverStatus;
  tai_khoan: string;
  mat_khau: string;
  ma_ql: number | null;
  
  // Relations
  quan_ly?: DriverManager;
}

// ==================== XE BUÝT (BUSES) ====================
export type BusStatus = 'san_sang' | 'dang_su_dung' | 'bao_duong';

export interface Bus {
  ma_xe: number;
  bien_so: string;
  suc_chua: number;
  trang_thai: 'san_sang' | 'dang_su_dung' | 'bao_duong'; // ✅ trạng thái từ DB
  ma_tai_xe: number | null;
  
  // Relations
  tai_xe?: Driver;
  vi_tri_hien_tai?: BusLocation;
}

// ==================== TRẠM XE (STOPS) ====================
export type StopType = 'don' | 'tra' | 'ca_hai';

export interface Stop {
  ma_tram: number;
  ten_tram: string;
  dia_chi: string | null;
  loai_tram: StopType;
}

// ==================== TUYẾN ĐƯỜNG (ROUTES) ====================
export interface Route {
  ma_tuyen: number;
  ten_tuyen: string;
  diem_bat_dau: string | null;
  diem_ket_thuc: string | null;
  do_dai_km: number | null;
  
  // Relations
  chi_tiet_tuyen?: RouteDetail[];
}

// ==================== CHI TIẾT TUYẾN ĐƯỜNG ====================
export interface RouteDetail {
  ma_ct: number;
  ma_tuyen: number;
  ma_tram: number;
  thu_tu: number;  // Thứ tự trạm trong tuyến
  
  // Relations
  tram?: Stop;
}

// ==================== LỊCH TRÌNH (SCHEDULES) ====================
export type ScheduleStatus = 'cho_chay' | 'dang_chay' | 'hoan_thanh' | 'huy';

export interface Schedule {
  ma_lich: number;
  ma_tuyen: number | null;
  ma_xe: number | null;
  ma_tai_xe: number | null;
  ngay_chay: string;  // Date format: YYYY-MM-DD
  gio_bat_dau: string;  // Time format: HH:mm:ss
  gio_ket_thuc: string | null;
  trang_thai_lich: 'cho_chay' | 'dang_chay' | 'hoan_thanh' | 'huy'; // ✅ trạng thái từ DB
  
  // Relations
  tuyen?: Route;
  xe?: Bus;
  tai_xe?: Driver;
  phan_cong?: Assignment[];
}

// ==================== PHÂN CÔNG (ASSIGNMENTS) ====================
export interface Assignment {
  ma_pc: number;
  ma_hs: number | null;
  ma_lich: number | null;
  
  // Relations
  hoc_sinh?: Student;
  lich_trinh?: Schedule;
}

// ==================== NHẬT KÝ ĐÓN TRẢ ====================
export type ShiftType = 'sang' | 'chieu';
export type PickupStatus = 'cho' | 'da_don' | 'vang';
export type DropoffStatus = 'cho' | 'da_tra' | 'vang';

export interface PickupDropoffLog {
  ma_nhat_ky: number;
  ma_hs: number | null;
  ma_lich: number | null;
  ca_don_tra: ShiftType;
  trang_thai_don: PickupStatus;
  trang_thai_tra: DropoffStatus;
  thoi_gian: string;  // Timestamp
  
  // Relations
  hoc_sinh?: Student;
  lich_trinh?: Schedule;
}

// ==================== VỊ TRÍ XE (BUS LOCATION) ====================
export interface BusLocation {
  ma_vitri: number;
  ma_xe: number | null;
  vi_do: number | null;  // Latitude
  kinh_do: number | null;  // Longitude
  toc_do: number | null;  // Speed (km/h)
  thoi_gian: string;  // Timestamp
  
  // Relations
  xe?: Bus;
}

// ==================== THÔNG BÁO (NOTIFICATIONS) ====================
export interface Notification {
  ma_tb: number;
  noi_dung: string | null;
  thoi_gian: string;  // Timestamp
  ma_phu_huynh: number | null;
  ma_tai_xe: number | null;
  
  // Relations
  phu_huynh?: Parent;
  tai_xe?: Driver;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== AUTH TYPES ====================
export interface LoginRequest {
  tai_khoan: string;
  mat_khau: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// ==================== REAL-TIME TRACKING TYPES ====================
export interface BusTrackingData {
  ma_xe: number;
  bien_so: string;
  vi_tri: {
    vi_do: number;
    kinh_do: number;
    toc_do: number;
    thoi_gian: string;
  };
  lich_trinh?: Schedule;
  hoc_sinh_tren_xe?: Student[];
}

// ==================== FILTER & SEARCH TYPES ====================
export interface BusFilter {
  trang_thai?: BusStatus[];
  ma_tai_xe?: number;
  search?: string;
}

export interface StudentFilter {
  lop?: string;
  trang_thai?: StudentStatus;
  ma_phu_huynh?: number;
  search?: string;
}

export interface ScheduleFilter {
  ngay_chay?: string;
  trang_thai_lich?: ScheduleStatus[];
  ma_tuyen?: number;
  ma_tai_xe?: number;
}

// ==================== FORM TYPES ====================
export interface StudentFormData {
  ho_ten: string;
  lop: string;
  ma_phu_huynh: number;
  ma_diem_don: number;
  ma_diem_tra: number;
}

export interface BusFormData {
  bien_so: string;
  suc_chua: number;
  ma_tai_xe?: number;
}

export interface ScheduleFormData {
  ma_tuyen: number;
  ma_xe: number;
  ma_tai_xe: number;
  ngay_chay: string;
  gio_bat_dau: string;
  gio_ket_thuc?: string;
}