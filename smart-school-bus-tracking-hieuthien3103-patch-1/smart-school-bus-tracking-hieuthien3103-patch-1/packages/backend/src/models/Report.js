// src/models/Report.js
const db = require('../config/database');

class Report {
  // Báo cáo tổng quan
  static async getOverview() {
    const [studentCount] = await db.execute('SELECT COUNT(*) AS total FROM hocsinh');
    const [driverCount] = await db.execute('SELECT COUNT(*) AS total FROM taixe');
    const [busCount] = await db.execute('SELECT COUNT(*) AS total FROM xebuyt');
    const [todaySchedules] = await db.execute(`
      SELECT COUNT(*) AS total FROM lichtrinh 
      WHERE DATE(ngay_chay) = CURDATE() AND trang_thai_lich = 'hoan_thanh'
    `);
    return {
      tong_hoc_sinh: studentCount[0].total,
      tong_tai_xe: driverCount[0].total,
      tong_xe_bus: busCount[0].total,
      lich_hoan_thanh_hom_nay: todaySchedules[0].total
    };
  }

  // Báo cáo lịch trình trong khoảng thời gian
  static async getScheduleReport(start_date, end_date) {
    const query = `
      SELECT DATE(ngay_chay) as ngay, trang_thai_lich, COUNT(*) as so_luong
      FROM lichtrinh
      WHERE ngay_chay BETWEEN ? AND ?
      GROUP BY DATE(ngay_chay), trang_thai_lich
      ORDER BY ngay DESC
    `;
    const [rows] = await db.execute(query, [start_date, end_date]);
    return rows;
  }

  // Hiệu suất tài xế
  static async getDriverPerformance() {
    const query = `
      SELECT 
        tx.ma_tai_xe, tx.ho_ten, COUNT(l.ma_lich) AS so_chuyen,
        ROUND(SUM(CASE WHEN l.trang_thai_lich = 'hoan_thanh' THEN 1 ELSE 0 END) / COUNT(l.ma_lich) * 100, 1) AS ty_le_hoan_thanh
      FROM taixe tx
      LEFT JOIN lichtrinh l ON tx.ma_tai_xe = l.ma_tai_xe
      GROUP BY tx.ma_tai_xe, tx.ho_ten
      ORDER BY so_chuyen DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }
}

module.exports = Report;
