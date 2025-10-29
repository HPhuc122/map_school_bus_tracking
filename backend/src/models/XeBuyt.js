// models/XeBuyt.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const XeBuyt = sequelize.define("xebuyt", {
  ma_xe: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bien_so: { type: DataTypes.STRING },
  suc_chua: { type: DataTypes.INTEGER },
  trang_thai: { type: DataTypes.ENUM("san_sang","dang_su_dung","bao_duong") },
  ma_tai_xe: { type: DataTypes.INTEGER }
}, { tableName: "xebuyt", timestamps: false });

export default XeBuyt;
