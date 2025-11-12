// backend/src/models/TramXe.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const TramXe = sequelize.define("TramXe", {
    ma_tram: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ten_tram: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    dia_chi: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    loai_tram: {
        type: DataTypes.ENUM("don", "tra", "ca_hai"),
        allowNull: true,
        defaultValue: "ca_hai",
    },
    vi_do: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
    },
    kinh_do: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: true,
    },
}, {
    tableName: "tramxe", // tên bảng trong database
    timestamps: false,   // nếu không có createdAt/updatedAt
});

export default TramXe;
