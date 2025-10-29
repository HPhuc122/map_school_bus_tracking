import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/db.config.js";
import { QueryTypes } from "sequelize";
import PhuHuynh from "../models/PhuHuynh.js";

/**
 * Đăng nhập phụ huynh
 */
export const loginParent = async (req, res) => {
  try {
    const { tai_khoan, mat_khau } = req.body;
    if (!tai_khoan || !mat_khau)
      return res.status(400).json({ error: "Thiếu tài khoản hoặc mật khẩu" });

    const parent = await PhuHuynh.findOne({ where: { tai_khoan } });
    if (!parent)
      return res.status(404).json({ error: "Không tìm thấy phụ huynh" });

    // kiểm tra mật khẩu: hỗ trợ cả plain và bcrypt
    let match = false;
    if (parent.mat_khau === mat_khau) match = true;
    else match = await bcrypt.compare(mat_khau, parent.mat_khau);

    if (!match) return res.status(401).json({ error: "Sai mật khẩu" });

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
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

/**
 * Lấy danh sách học sinh của phụ huynh
 * Route: GET /api/parents/:id/students
 */
export const getChildren = async (req, res) => {
  try {
    // Lấy id phụ huynh từ token hoặc URL
    const parentId = req.user?.id || req.params.parentId;

    const children = await sequelize.query(
      `
      SELECT 
        hs.ma_hs, hs.ho_ten, hs.lop, hs.trang_thai,
        td.ten_tram AS diem_don,
        tt.ten_tram AS diem_tra,
        xb.bien_so AS so_xe,
        tx.ho_ten AS tai_xe,
        tx.so_dien_thoai
      FROM hocsinh hs
      LEFT JOIN tramxe td ON hs.ma_diem_don = td.ma_tram
      LEFT JOIN tramxe tt ON hs.ma_diem_tra = tt.ma_tram
      LEFT JOIN phancong pc ON hs.ma_hs = pc.ma_hs
      LEFT JOIN lichtrinh lt ON pc.ma_lich = lt.ma_lich
      LEFT JOIN xebuyt xb ON lt.ma_xe = xb.ma_xe
      LEFT JOIN taixe tx ON xb.ma_tai_xe = tx.ma_tai_xe
      WHERE hs.ma_phu_huynh = ?;
      `,
      { replacements: [parentId], type: QueryTypes.SELECT }
    );

    res.json(children);
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin học sinh:", error);
    res.status(500).json({ error: "Lỗi khi lấy thông tin học sinh" });
  }
};
