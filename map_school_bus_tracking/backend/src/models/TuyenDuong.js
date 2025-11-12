// backend/src/models/TuyenDuong.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const TuyenDuong = sequelize.define("TuyenDuong", {
    ma_tuyen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ten_tuyen: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    diem_bat_dau: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    diem_ket_thuc: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    do_dai_km: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
}, {
    tableName: "tuyenduong", // tên bảng trong database
    timestamps: false,       // nếu không có createdAt/updatedAt
});

export default TuyenDuong;
