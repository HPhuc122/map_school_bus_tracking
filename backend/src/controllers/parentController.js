import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/db.config.js";
import { QueryTypes } from "sequelize";
import PhuHuynh from "../models/PhuHuynh.js";

// ========================== ĐĂNG NHẬP PHỤ HUYNH ==========================
export const loginParent = async (req, res) => {
  try {
    const { tai_khoan, mat_khau } = req.body;
    if (!tai_khoan || !mat_khau)
      return res.status(400).json({ error: "Thiếu tài khoản hoặc mật khẩu" });

    const parent = await PhuHuynh.findOne({ where: { tai_khoan } });
    if (!parent)
      return res.status(404).json({ error: "Không tìm thấy phụ huynh" });

    // hỗ trợ cả mật khẩu mã hóa & plain text
    let match = false;
    if (parent.mat_khau === mat_khau) match = true;
    else match = await bcrypt.compare(mat_khau, parent.mat_khau);

    if (!match)
      return res.status(401).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: parent.ma_phu_huynh, role: "parent" },
      process.env.JWT_SECRET || "smartbus",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      parent: {
        ma_phu_huynh: parent.ma_phu_huynh,
        ho_ten: parent.ho_ten,
        so_dien_thoai: parent.so_dien_thoai,
        email: parent.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// ====================== LẤY THÔNG TIN HỌC SINH CỦA PHỤ HUYNH ======================
export const getChildren = async (req, res) => {
  try {
    const parentId = req.user.id;

    const children = await sequelize.query(
      `
      SELECT 
        hs.ma_hs,
        hs.ho_ten,
        hs.lop,
        td.ten_tram AS diem_don,
        tt.ten_tram AS diem_tra,
        td.dia_chi AS dia_chi_don,
        tt.dia_chi AS dia_chi_tra,
        xb.bien_so AS bien_so,
        tx.ho_ten AS tai_xe,
        tx.so_dien_thoai AS sdt_tai_xe,
        lt.gio_bat_dau AS gio_don,
        lt.gio_ket_thuc AS gio_tra,
        lt.trang_thai_lich
      FROM hocsinh hs
      LEFT JOIN tramxe td ON hs.ma_diem_don = td.ma_tram
      LEFT JOIN tramxe tt ON hs.ma_diem_tra = tt.ma_tram
      LEFT JOIN phancong pc ON hs.ma_hs = pc.ma_hs
      LEFT JOIN lichtrinh lt ON pc.ma_lich = lt.ma_lich
      LEFT JOIN xebuyt xb ON lt.ma_xe = xb.ma_xe
      LEFT JOIN taixe tx ON lt.ma_tai_xe = tx.ma_tai_xe
      WHERE hs.ma_phu_huynh = ?;
      `,
      { replacements: [parentId], type: QueryTypes.SELECT }
    );

    res.json(children);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi lấy thông tin học sinh" });
  }
};
