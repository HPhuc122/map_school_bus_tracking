// src/models/Route.js
const db = require('../config/database');

class Route {
  // Lấy danh sách tuyến
  static async getAll() {
    const query = `
      SELECT ma_tuyen, ten_tuyen, diem_bat_dau, diem_ket_thuc, do_dai_km, trang_thai
      FROM tuyenduong
      ORDER BY ma_tuyen DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy chi tiết 1 tuyến
  static async getById(ma_tuyen) {
    const query = `SELECT * FROM tuyenduong WHERE ma_tuyen = ?`;
    const [rows] = await db.execute(query, [ma_tuyen]);
    return rows[0];
  }

  // Tạo tuyến mới
  static async create(data) {
    const query = `
      INSERT INTO tuyenduong (ten_tuyen, diem_bat_dau, diem_ket_thuc, do_dai_km, trang_thai)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      data.ten_tuyen,
      data.diem_bat_dau,
      data.diem_ket_thuc,
      data.do_dai_km || 0,
      data.trang_thai || 'hoat_dong'
    ]);
    return { ma_tuyen: result.insertId, ...data };
  }

  // Cập nhật tuyến
  static async update(ma_tuyen, data) {
    const query = `
      UPDATE tuyenduong
      SET ten_tuyen = ?, diem_bat_dau = ?, diem_ket_thuc = ?, do_dai_km = ?, trang_thai = ?
      WHERE ma_tuyen = ?
    `;
    await db.execute(query, [
      data.ten_tuyen,
      data.diem_bat_dau,
      data.diem_ket_thuc,
      data.do_dai_km,
      data.trang_thai,
      ma_tuyen
    ]);
    return { ma_tuyen, ...data };
  }

  // Xóa tuyến
  static async delete(ma_tuyen) {
    const query = `DELETE FROM tuyenduong WHERE ma_tuyen = ?`;
    await db.execute(query, [ma_tuyen]);
    return { message: 'Xóa tuyến thành công' };
  }
}

module.exports = Route;
    