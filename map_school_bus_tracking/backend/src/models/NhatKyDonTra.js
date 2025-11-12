// models/NhatKyDonTra.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const NhatKyDonTra = sequelize.define("nhatkydontra", {
  ma_nhat_ky: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ma_hs: { type: DataTypes.INTEGER },
  ma_lich: { type: DataTypes.INTEGER },
  ca_don_tra: { type: DataTypes.ENUM("sang","chieu") },
  trang_thai_don: { type: DataTypes.ENUM("cho","da_don","vang") },
  trang_thai_tra: { type: DataTypes.ENUM("cho","da_tra","vang") },
  thoi_gian: { type: DataTypes.DATE }
}, { tableName: "nhatkydontra", timestamps: false });

export default NhatKyDonTra;
