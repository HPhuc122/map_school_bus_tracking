const { query: dbQuery } = require('../config/database');

class Schedule {
  // Lấy tất cả lịch trình
  static async getAll(filters = {}) {
    let sqlQuery = `
      SELECT 
        l.ma_lich,
        l.ma_tuyen,
        l.ma_xe,
        l.ma_tai_xe,
        l.ngay_chay AS date,
        l.gio_bat_dau,
        l.gio_ket_thuc,
        l.trang_thai_lich AS trang_thai,
        t.ten_tuyen,
        t.diem_bat_dau AS start_point,
        t.diem_ket_thuc AS end_point,
        t.do_dai_km AS distance,
        tx.ho_ten AS driver_name,
        xe.bien_so AS bus_number,
        COUNT(DISTINCT pc.ma_hs) AS so_hoc_sinh
      FROM lichtrinh l
      LEFT JOIN tuyenduong t ON l.ma_tuyen = t.ma_tuyen
      LEFT JOIN phancong pc ON l.ma_lich = pc.ma_lich
      LEFT JOIN taixe tx ON l.ma_tai_xe = tx.ma_tai_xe
      LEFT JOIN xebuyt xe ON l.ma_xe = xe.ma_xe
      WHERE 1=1
    `;
    const params = [];

    if (filters.ma_tuyen) {
      sqlQuery += " AND l.ma_tuyen = ?";
      params.push(filters.ma_tuyen);
    }

    if (filters.trang_thai) {
      sqlQuery += " AND l.trang_thai_lich = ?";
      params.push(filters.trang_thai);
    }

    if (filters.ngay_chay) {
      sqlQuery += " AND DATE(l.ngay_chay) = ?";
      params.push(filters.ngay_chay);
    }

    sqlQuery += " GROUP BY l.ma_lich ORDER BY l.ngay_chay DESC, l.gio_bat_dau ASC";

    const rows = await dbQuery(sqlQuery, params);
    return rows;
  }

  // Lấy chi tiết 1 lịch trình
  static async getById(ma_lich) {
    const sql = `
      SELECT 
        l.ma_lich,
        l.ma_tuyen,
        l.ma_xe,
        l.ma_tai_xe,
        l.ngay_chay AS date,
        l.gio_bat_dau,
        l.gio_ket_thuc,
        l.trang_thai_lich AS trang_thai,
        t.ten_tuyen,
        t.diem_bat_dau AS start_point,
        t.diem_ket_thuc AS end_point,
        t.do_dai_km AS distance,
        tx.ho_ten AS driver_name,
        xe.bien_so AS bus_number,
        COUNT(DISTINCT pc.ma_hs) AS so_hoc_sinh
      FROM lichtrinh l
      LEFT JOIN tuyenduong t ON l.ma_tuyen = t.ma_tuyen
      LEFT JOIN phancong pc ON l.ma_lich = pc.ma_lich
      LEFT JOIN taixe tx ON l.ma_tai_xe = tx.ma_tai_xe
      LEFT JOIN xebuyt xe ON l.ma_xe = xe.ma_xe
      WHERE l.ma_lich = ?
      GROUP BY l.ma_lich
    `;
    const rows = await dbQuery(sql, [ma_lich]);
    return rows[0] || null;
  }

  // Lấy danh sách học sinh trong lịch trình
  static async getStudents(ma_lich) {
    const sql = `
      SELECT 
        hs.ma_hs, hs.ho_ten, hs.lop,
        ph.ho_ten AS ten_phu_huynh, ph.so_dien_thoai AS sdt_phu_huynh
      FROM phancong pc
      JOIN hocsinh hs ON pc.ma_hs = hs.ma_hs
      JOIN phuhuynh ph ON hs.ma_phu_huynh = ph.ma_phu_huynh
      WHERE pc.ma_lich = ?
      ORDER BY hs.lop, hs.ho_ten
    `;
    const rows = await dbQuery(sql, [ma_lich]);
    return rows;
  }

  // Tạo lịch trình
  static async create(data) {
    const { ma_tuyen, ma_xe, ma_tai_xe, ngay_chay, gio_bat_dau, gio_ket_thuc } = data;

    const result = await dbQuery(
      `INSERT INTO lichtrinh (ma_tuyen, ma_xe, ma_tai_xe, ngay_chay, gio_bat_dau, gio_ket_thuc, trang_thai_lich)
       VALUES (?, ?, ?, ?, ?, ?, 'cho_chay')`,
      [ma_tuyen, ma_xe, ma_tai_xe, ngay_chay, gio_bat_dau, gio_ket_thuc]
    );

    return { ma_lich: result.insertId, ...data, trang_thai: 'cho_chay' };
  }

  // Cập nhật lịch trình
  static async update(ma_lich, data) {
    // Build dynamic SQL to handle partial updates safely
    const updates = [];
    const values = [];
    
    // Only update fields that are provided
    if (data.ma_tuyen !== undefined) {
      updates.push('ma_tuyen=?');
      values.push(data.ma_tuyen);
    }
    if (data.ma_xe !== undefined) {
      updates.push('ma_xe=?');
      values.push(data.ma_xe);
    }
    if (data.ma_tai_xe !== undefined) {
      updates.push('ma_tai_xe=?');
      values.push(data.ma_tai_xe);
    }
    if (data.ngay_chay !== undefined) {
      updates.push('ngay_chay=?');
      values.push(data.ngay_chay);
    }
    if (data.gio_bat_dau !== undefined) {
      updates.push('gio_bat_dau=?');
      values.push(data.gio_bat_dau);
    }
    if (data.gio_ket_thuc !== undefined) {
      updates.push('gio_ket_thuc=?');
      values.push(data.gio_ket_thuc);
    }
    if (data.trang_thai !== undefined) {
      updates.push('trang_thai_lich=?');
      values.push(data.trang_thai);
    }

    // Require at least one field to update
    if (updates.length === 0) {
      throw new Error('No fields provided for update');
    }

    // Add ma_lich to the end of values array for WHERE clause
    values.push(ma_lich);

    await dbQuery(
      `UPDATE lichtrinh 
       SET ${updates.join(', ')}
       WHERE ma_lich=?`,
      values
    );

    return { ma_lich, ...data };
  }

  // Xóa lịch trình
  static async delete(ma_lich) {
    await dbQuery(`DELETE FROM lichtrinh WHERE ma_lich=?`, [ma_lich]);
    return { message: 'Đã xóa lịch trình thành công' };
  }
}

module.exports = Schedule;
