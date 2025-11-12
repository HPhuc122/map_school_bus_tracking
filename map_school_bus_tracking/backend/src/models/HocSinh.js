// models/HocSinh.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const HocSinh = sequelize.define("hocsinh", {
  ma_hs: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ho_ten: { type: DataTypes.STRING },
  lop: { type: DataTypes.STRING },
  ma_phu_huynh: { type: DataTypes.INTEGER },
  ma_diem_don: { type: DataTypes.INTEGER },
  ma_diem_tra: { type: DataTypes.INTEGER },
  trang_thai: { type: DataTypes.ENUM("hoat_dong","nghi") },
}, {
  tableName: "hocsinh",
  timestamps: false
});

export default HocSinh;
