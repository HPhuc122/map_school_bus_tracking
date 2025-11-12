// models/PhanCong.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const PhanCong = sequelize.define("phancong", {
  ma_pc: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ma_hs: { type: DataTypes.INTEGER },
  ma_lich: { type: DataTypes.INTEGER },
}, { tableName: "phancong", timestamps: false });

export default PhanCong;
