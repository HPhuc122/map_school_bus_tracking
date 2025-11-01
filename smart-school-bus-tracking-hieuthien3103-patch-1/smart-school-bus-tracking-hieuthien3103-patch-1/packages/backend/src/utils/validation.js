// utils/validation.js
// Các hàm validation dùng chung cho toàn bộ app

class Validator {
  // Kiểm tra số điện thoại Việt Nam
  static isValidPhoneNumber(phone) {
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  // Kiểm tra email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Kiểm tra biển số xe Việt Nam
  static isValidLicensePlate(plate) {
    // Format: 30A-10001 hoặc 29-A12345
    const plateRegex = /^\d{2}[A-Z]-?\d{4,5}$/;
    return plateRegex.test(plate.replace(/\s/g, ''));
  }

  // Kiểm tra GPLX
  static isValidDriverLicense(license) {
    // Format: GPLX0001 hoặc B2-123456
    const licenseRegex = /^[A-Z0-9]{4,10}$/;
    return licenseRegex.test(license);
  }

  // Kiểm tra ngày hợp lệ (không quá khứ)
  static isValidFutureDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  // Kiểm tra giờ hợp lệ (HH:MM)
  static isValidTime(timeString) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeString);
  }

  // Kiểm tra giờ kết thúc sau giờ bắt đầu
  static isEndTimeAfterStartTime(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    return end > start;
  }

  // Validate required fields
  static validateRequired(data, requiredFields) {
    const missing = [];
    requiredFields.forEach(field => {
      if (!data[field]) {
        missing.push(field);
      }
    });
    
    return {
      valid: missing.length === 0,
      missing
    };
  }

  // Validate enum values
  static isValidEnum(value, allowedValues) {
    return allowedValues.includes(value);
  }

  // Sanitize string (xóa HTML tags, trim)
  static sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
  }

  // Validate số nguyên dương
  static isPositiveInteger(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  }

  // Validate số thập phân dương
  static isPositiveDecimal(value) {
    return !isNaN(value) && Number(value) > 0;
  }
}

module.exports = Validator;

// =====================================================
// USAGE EXAMPLES:

/*
// Trong controller:
const Validator = require('../utils/validation');

// Check phone
if (!Validator.isValidPhoneNumber(req.body.so_dien_thoai)) {
  return res.status(400).json({
    message: 'Số điện thoại không hợp lệ'
  });
}

// Check required fields
const { valid, missing } = Validator.validateRequired(req.body, [
  'ma_tuyen', 'ma_xe', 'ma_tai_xe'
]);
if (!valid) {
  return res.status(400).json({
    message: `Thiếu trường: ${missing.join(', ')}`
  });
}

// Check enum
const validStatuses = ['cho_chay', 'dang_chay', 'hoan_thanh', 'huy'];
if (!Validator.isValidEnum(req.body.trang_thai, validStatuses)) {
  return res.status(400).json({
    message: 'Trạng thái không hợp lệ'
  });
}
*/