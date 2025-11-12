import { sequelize } from "../config/db.config.js";
import { QueryTypes } from "sequelize";

/**
 * Lấy vị trí xe buýt của học sinh
 * Route: GET /api/students/:id/location
 */
export const getStudentLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await sequelize.query(
      `
      SELECT 
        v.vi_do, v.kinh_do, v.toc_do, v.thoi_gian,
        x.bien_so, tx.ho_ten AS tai_xe, tx.so_dien_thoai
      FROM vitrixe v
      JOIN xebuyt x ON v.ma_xe = x.ma_xe
      JOIN lichtrinh l ON x.ma_xe = l.ma_xe
      JOIN phancong p ON p.ma_lich = l.ma_lich
      JOIN taixe tx ON l.ma_tai_xe = tx.ma_tai_xe
      WHERE p.ma_hs = ?
      ORDER BY v.thoi_gian DESC
      LIMIT 1;
      `,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    if (!result) return res.status(404).json({ error: "Không có vị trí xe" });
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi lấy vị trí xe:", err);
    res.status(500).json({ error: "Lỗi khi lấy vị trí xe" });
  }
};
