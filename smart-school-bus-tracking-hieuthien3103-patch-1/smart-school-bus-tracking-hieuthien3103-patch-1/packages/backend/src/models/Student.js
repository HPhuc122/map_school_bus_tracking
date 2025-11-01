const db = require('../config/database');

class Student {
  // Lấy toàn bộ học sinh (kèm thông tin phụ huynh & trạm)
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT 
        hs.ma_hs,
        hs.ho_ten,
        hs.lop,
        hs.ma_phu_huynh,
        ph.ho_ten AS ten_phu_huynh,
        ph.so_dien_thoai AS sdt_phu_huynh,
        td.ten_tram AS tram_don,
        tt.ten_tram AS tram_tra
      FROM hocsinh hs
      LEFT JOIN phuhuynh ph ON hs.ma_phu_huynh = ph.ma_phu_huynh
      LEFT JOIN tramxe td ON hs.ma_diem_don = td.ma_tram
      LEFT JOIN tramxe tt ON hs.ma_diem_tra = tt.ma_tram
      ORDER BY hs.lop, hs.ho_ten
    `);
    return rows;
  }

  // Lấy chi tiết 1 học sinh
  static async getById(ma_hs) {
    const [rows] = await db.execute(`
      SELECT 
        hs.*,
        ph.ho_ten AS ten_phu_huynh,
        ph.so_dien_thoai AS sdt_phu_huynh,
        td.ten_tram AS tram_don,
        tt.ten_tram AS tram_tra
      FROM hocsinh hs
      LEFT JOIN phuhuynh ph ON hs.ma_phu_huynh = ph.ma_phu_huynh
      LEFT JOIN tramxe td ON hs.ma_diem_don = td.ma_tram
      LEFT JOIN tramxe tt ON hs.ma_diem_tra = tt.ma_tram
      WHERE hs.ma_hs = ?
    `, [ma_hs]);
    return rows[0];
  }

  // Thêm học sinh mới
  static async create(data) {
    const { ho_ten, lop, ma_phu_huynh, ma_diem_don, ma_diem_tra } = data;
    const [result] = await db.execute(`
      INSERT INTO hocsinh (ho_ten, lop, ma_phu_huynh, ma_diem_don, ma_diem_tra)
      VALUES (?, ?, ?, ?, ?)
    `, [ho_ten, lop, ma_phu_huynh, ma_diem_don, ma_diem_tra]);

    return { ma_hs: result.insertId, ...data };
  }

  // Cập nhật thông tin học sinh
  static async update(ma_hs, data) {
    const { ho_ten, lop, ma_phu_huynh, ma_diem_don, ma_diem_tra } = data;
    await db.execute(`
      UPDATE hocsinh 
      SET ho_ten = ?, lop = ?, ma_phu_huynh = ?, ma_diem_don = ?, ma_diem_tra = ?
      WHERE ma_hs = ?
    `, [ho_ten, lop, ma_phu_huynh, ma_diem_don, ma_diem_tra, ma_hs]);

    return { ma_hs, ...data };
  }

  // Xóa học sinh
  static async delete(ma_hs) {
    await db.execute(`DELETE FROM hocsinh WHERE ma_hs = ?`, [ma_hs]);
    return { message: 'Đã xóa học sinh thành công' };
  }
}

module.exports = Student;
