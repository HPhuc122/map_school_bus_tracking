import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QuanLy from "../models/QuanLy.js";

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "smartbus", { expiresIn: "1d" });
};

export const loginAdmin = async (req, res) => {
    try {
        const { tai_khoan, mat_khau } = req.body;
        if (!tai_khoan || !mat_khau) return res.status(400).json({ error: "Thiếu tài khoản hoặc mật khẩu" });

        const admin = await QuanLy.findOne({ where: { tai_khoan } });
        if (!admin) return res.status(404).json({ error: "Không tìm thấy admin" });

        const match = await bcrypt.compare(mat_khau, admin.mat_khau) || admin.mat_khau === mat_khau;
        if (!match) return res.status(401).json({ error: "Sai mật khẩu" });

        const token = createToken(admin.ma_quan_ly, "admin");
        res.json({ message: "Đăng nhập thành công", token, user: admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
    }
};
