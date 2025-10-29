// models/PhuHuynh.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const PhuHuynh = sequelize.define("phuhuynh", {
  ma_phu_huynh: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ho_ten: { type: DataTypes.STRING },
  so_dien_thoai: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING },
  dia_chi: { type: DataTypes.STRING },
  tai_khoan: { type: DataTypes.STRING, unique: true },
  mat_khau: { type: DataTypes.STRING },
}, {
  tableName: "phuhuynh",
  timestamps: false
});

export default PhuHuynh;
