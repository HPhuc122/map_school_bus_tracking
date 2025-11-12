import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TaiXe from "../models/TaiXe.js";

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "smartbus", { expiresIn: "1d" });
};

export const loginDriver = async (req, res) => {
    try {
        const { tai_khoan, mat_khau } = req.body;
        if (!tai_khoan || !mat_khau) return res.status(400).json({ error: "Thiếu tài khoản hoặc mật khẩu" });

        const driver = await TaiXe.findOne({ where: { tai_khoan } });
        if (!driver) return res.status(404).json({ error: "Không tìm thấy tài xế" });

        const match = await bcrypt.compare(mat_khau, driver.mat_khau) || driver.mat_khau === mat_khau;
        if (!match) return res.status(401).json({ error: "Sai mật khẩu" });

        const token = createToken(driver.ma_tai_xe, "driver");
        res.json({ message: "Đăng nhập thành công", token, user: driver });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
    }
};
