import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const TaiXe = sequelize.define("TaiXe", {
    ma_tai_xe: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ho_ten: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    so_dien_thoai: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    so_gplx: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    trang_thai: {
        type: DataTypes.ENUM("san_sang", "dang_chay", "nghi"),
        allowNull: true,
        defaultValue: "san_sang",
    },
    tai_khoan: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    mat_khau: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ma_ql: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "taixe", // trùng tên bảng MySQL
    timestamps: false, // tắt createdAt / updatedAt nếu bảng MySQL không có
});

export default TaiXe;
