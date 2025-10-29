// models/ViTriXe.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const ViTriXe = sequelize.define("vitrixe", {
  ma_vitri: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ma_xe: { type: DataTypes.INTEGER },
  vi_do: { type: DataTypes.DECIMAL(10,6) },
  kinh_do: { type: DataTypes.DECIMAL(10,6) },
  toc_do: { type: DataTypes.DECIMAL(5,2) },
  thoi_gian: { type: DataTypes.DATE }
}, { tableName: "vitrixe", timestamps: false });

export default ViTriXe;
