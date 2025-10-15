import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Kiểm tra kết nối DB
sequelize.sync().then(() => console.log("✅ Database connected"));

export default app;
