import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import parentRoutes from "./routes/parentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js"; // 🆕 thêm route cho học sinh
import { connectDB } from "./config/db.config.js";

dotenv.config();
connectDB();

const app = express();

// Cấu hình middleware
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================
app.use("/api/parents", parentRoutes);   // Đăng nhập + danh sách học sinh
app.use("/api/students", studentRoutes); // Vị trí xe học sinh

// Route kiểm tra nhanh API
app.get("/", (req, res) => {
  res.send("🚍 Smart School Bus API is running");
});

// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
