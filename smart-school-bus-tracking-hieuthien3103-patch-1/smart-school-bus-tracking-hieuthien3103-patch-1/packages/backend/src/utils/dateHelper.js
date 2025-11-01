// utils/dateHelper.js
// Các hàm xử lý ngày tháng dùng chung

class DateHelper {
  // Format date sang YYYY-MM-DD (MySQL format)
  static formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format datetime sang MySQL DATETIME
  static formatDateTime(date) {
    const d = new Date(date);
    const dateStr = this.formatDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}:${seconds}`;
  }

  // Lấy ngày hôm nay (YYYY-MM-DD)
  static today() {
    return this.formatDate(new Date());
  }

  // Lấy timestamp hiện tại
  static now() {
    return this.formatDateTime(new Date());
  }

  // Thêm số ngày vào date
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return this.formatDate(result);
  }

  // Trừ số ngày từ date
  static subtractDays(date, days) {
    return this.addDays(date, -days);
  }

  // Lấy ngày đầu tuần (Thứ 2)
  static getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return this.formatDate(new Date(d.setDate(diff)));
  }

  // Lấy ngày cuối tuần (Chủ nhật)
  static getEndOfWeek(date = new Date()) {
    const start = this.getStartOfWeek(date);
    return this.addDays(start, 6);
  }

  // Lấy ngày đầu tháng
  static getStartOfMonth(date = new Date()) {
    const d = new Date(date);
    return this.formatDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  // Lấy ngày cuối tháng
  static getEndOfMonth(date = new Date()) {
    const d = new Date(date);
    return this.formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  }

  // Kiểm tra 2 ngày có cùng ngày không
  static isSameDay(date1, date2) {
    return this.formatDate(date1) === this.formatDate(date2);
  }

  // Tính số ngày giữa 2 ngày
  static daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Format sang định dạng Việt Nam (dd/mm/yyyy)
  static formatVN(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Format thời gian sang 24h (HH:MM)
  static formatTime(date) {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Parse time string (HH:MM) thành số phút từ 00:00
  static timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Chuyển số phút thành HH:MM
  static minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Tính duration giữa 2 thời gian (trả về số phút)
  static calculateDuration(startTime, endTime) {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    return end - start;
  }

  // Kiểm tra có phải ngày trong tuần không (Thứ 2-6)
  static isWeekday(date) {
    const d = new Date(date);
    const day = d.getDay();
    return day >= 1 && day <= 5;
  }

  // Kiểm tra có phải cuối tuần không
  static isWeekend(date) {
    const d = new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
  }

  // Lấy tên ngày trong tuần (Tiếng Việt)
  static getDayName(date) {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const d = new Date(date);
    return days[d.getDay()];
  }

  // Lấy tháng (Tiếng Việt)
  static getMonthName(date) {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    const d = new Date(date);
    return months[d.getMonth()];
  }

  // Format relative time (vừa xong, 5 phút trước, 2 giờ trước...)
  static timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      năm: 31536000,
      tháng: 2592000,
      tuần: 604800,
      ngày: 86400,
      giờ: 3600,
      phút: 60
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInInterval);
      if (interval >= 1) {
        return `${interval} ${name} trước`;
      }
    }

    return 'vừa xong';
  }
}

module.exports = DateHelper;

// =====================================================
// USAGE EXAMPLES:

/*
const DateHelper = require('../utils/dateHelper');

// Format dates
const today = DateHelper.today(); // '2025-10-16'
const formatted = DateHelper.formatVN(new Date()); // '16/10/2025'

// Calculate duration
const duration = DateHelper.calculateDuration('06:30', '07:15'); // 45 phút

// Get week range
const startOfWeek = DateHelper.getStartOfWeek(); // '2025-10-14'
const endOfWeek = DateHelper.getEndOfWeek(); // '2025-10-20'

// Relative time
const timeAgo = DateHelper.timeAgo('2025-10-16 10:00:00'); // '2 giờ trước'

// Add days
const tomorrow = DateHelper.addDays(DateHelper.today(), 1);
*/