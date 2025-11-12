// backend/src/models/ChiTietTuyenDuong.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import TuyenDuong from "./TuyenDuong.js";
import TramXe from "./TramXe.js";

const ChiTietTuyenDuong = sequelize.define("ChiTietTuyenDuong", {
    ma_ct: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ma_tuyen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TuyenDuong,
            key: "ma_tuyen",
        },
    },
    ma_tram: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TramXe,
            key: "ma_tram",
        },
    },
    thu_tu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "chitiettuyenduong",
    timestamps: false,
});

// Thiết lập quan hệ (nếu cần)
TuyenDuong.hasMany(ChiTietTuyenDuong, { foreignKey: "ma_tuyen" });
ChiTietTuyenDuong.belongsTo(TuyenDuong, { foreignKey: "ma_tuyen" });

TramXe.hasMany(ChiTietTuyenDuong, { foreignKey: "ma_tram" });
ChiTietTuyenDuong.belongsTo(TramXe, { foreignKey: "ma_tram" });

export default ChiTietTuyenDuong;
