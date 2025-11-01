const db = require('../config/database');

class Bus {
  static async getAll() {
    const [rows] = await db.execute(`SELECT * FROM xebuyt ORDER BY ma_xe DESC`);
    return rows;
  }

  static async getById(ma_xe) {
    const [rows] = await db.execute(`SELECT * FROM xebuyt WHERE ma_xe = ?`, [ma_xe]);
    return rows[0];
  }

  static async create(data) {
    const { bien_so, suc_chua, trang_thai, ma_tai_xe } = data;
    const [result] = await db.execute(
      `INSERT INTO xebuyt (bien_so, suc_chua, trang_thai, ma_tai_xe) VALUES (?, ?, ?, ?)`,
      [bien_so, suc_chua, trang_thai || 'san_sang', ma_tai_xe || null]
    );
    return { ma_xe: result.insertId, ...data };
  }

  static async update(ma_xe, data) {
    // Build dynamic SQL to handle partial updates
    const updates = [];
    const values = [];
    
    if (data.bien_so !== undefined) {
      updates.push('bien_so=?');
      values.push(data.bien_so);
    }
    if (data.suc_chua !== undefined) {
      updates.push('suc_chua=?');
      values.push(data.suc_chua);
    }
    if (data.trang_thai !== undefined) {
      updates.push('trang_thai=?');
      values.push(data.trang_thai);
    }
    if (data.ma_tai_xe !== undefined) {
      updates.push('ma_tai_xe=?');
      values.push(data.ma_tai_xe);
    }

    if (updates.length === 0) {
      throw new Error('No fields provided for update');
    }

    values.push(ma_xe);

    await db.execute(
      `UPDATE xebuyt SET ${updates.join(', ')} WHERE ma_xe=?`,
      values
    );
    return { ma_xe, ...data };
  }

  static async delete(ma_xe) {
    await db.execute(`DELETE FROM xebuyt WHERE ma_xe=?`, [ma_xe]);
    return { message: 'Đã xóa xe buýt thành công' };
  }
}

module.exports = Bus;
