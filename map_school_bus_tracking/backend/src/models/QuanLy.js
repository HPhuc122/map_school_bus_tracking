import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const QuanLy = sequelize.define("QuanLy", {
    ma_ql: {
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
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    tai_khoan: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    mat_khau: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    dia_chi: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
}, {
    tableName: "quanlytaixe",
    timestamps: false, // vì bảng MySQL không có createdAt/updatedAt
});

export default QuanLy;
