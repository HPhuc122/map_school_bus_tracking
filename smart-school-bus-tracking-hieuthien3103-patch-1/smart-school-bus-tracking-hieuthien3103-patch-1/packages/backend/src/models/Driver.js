const db = require('../config/database');

class Driver {
  static async getAll() {
    const [rows] = await db.execute(`SELECT * FROM taixe ORDER BY ma_tai_xe DESC`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(`SELECT * FROM taixe WHERE ma_tai_xe = ?`, [id]);
    return rows[0];
  }

  static async create(data) {
    const { ho_ten, so_dien_thoai, so_gplx, trang_thai } = data;
    // Generate default account credentials
    const tai_khoan = `tx${Date.now()}`;
    const mat_khau = '123456'; // Default password
    
    const [result] = await db.execute(
      `INSERT INTO taixe (ho_ten, so_dien_thoai, so_gplx, trang_thai, tai_khoan, mat_khau) VALUES (?, ?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, so_gplx, trang_thai || 'san_sang', tai_khoan, mat_khau]
    );
    return { ma_tai_xe: result.insertId, ...data };
  }

  static async update(id, data) {
    // Build dynamic SQL to handle partial updates
    const updates = [];
    const values = [];
    
    if (data.ho_ten !== undefined) {
      updates.push('ho_ten=?');
      values.push(data.ho_ten);
    }
    if (data.so_dien_thoai !== undefined) {
      updates.push('so_dien_thoai=?');
      values.push(data.so_dien_thoai);
    }
    if (data.so_gplx !== undefined) {
      updates.push('so_gplx=?');
      values.push(data.so_gplx);
    }
    if (data.trang_thai !== undefined) {
      updates.push('trang_thai=?');
      values.push(data.trang_thai);
    }

    if (updates.length === 0) {
      throw new Error('No fields provided for update');
    }

    values.push(id);

    await db.execute(
      `UPDATE taixe SET ${updates.join(', ')} WHERE ma_tai_xe=?`,
      values
    );
    return { ma_tai_xe: id, ...data };
  }

  static async delete(id) {
    await db.execute(`DELETE FROM taixe WHERE ma_tai_xe = ?`, [id]);
    return { message: 'Đã xóa tài xế thành công' };
  }
}

module.exports = Driver;
