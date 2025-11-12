// models/ThongBao.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const ThongBao = sequelize.define("thongbao", {
  ma_tb: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  noi_dung: { type: DataTypes.TEXT },
  thoi_gian: { type: DataTypes.DATE },
  ma_phu_huynh: { type: DataTypes.INTEGER },
  ma_tai_xe: { type: DataTypes.INTEGER }
}, { tableName: "thongbao", timestamps: false });

export default ThongBao;
