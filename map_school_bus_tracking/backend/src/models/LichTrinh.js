// models/LichTrinh.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const LichTrinh = sequelize.define("lichtrinh", {
  ma_lich: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ma_tuyen: { type: DataTypes.INTEGER },
  ma_xe: { type: DataTypes.INTEGER },
  ma_tai_xe: { type: DataTypes.INTEGER },
  ngay_chay: { type: DataTypes.DATEONLY },
  gio_bat_dau: { type: DataTypes.TIME },
  gio_ket_thuc: { type: DataTypes.TIME },
  trang_thai_lich: { type: DataTypes.ENUM("cho_chay", "dang_chay", "hoan_thanh", "huy") }
}, { tableName: "lichtrinh", timestamps: false });

export default LichTrinh;
