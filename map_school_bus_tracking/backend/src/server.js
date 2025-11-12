// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.config.js";
import parentRoutes from "./routes/parentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import busRoutes from './routes/busRoutes.js'; // ✅ Import ở đây
import LichTrinh from "./models/LichTrinh.js";
import ViTriXe from "./models/ViTriXe.js";
import { startVehicleSimulation } from "./services/vehicleSimulation.js";

dotenv.config();
connectDB();

const app = express(); // ✅ Khởi tạo app TRƯỚC
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================
app.use("/api/parents", parentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/driver", driverRoutes);
app.use('/api/buses', busRoutes); // ✅ Dùng SAU KHI khởi tạo app

// ================== TEST ====================
app.get("/", (req, res) => {
  res.send("🚍 Smart School Bus API is running");
});

// ⚙️ Tạo HTTP server và tích hợp Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ================= SOCKET.IO =================
io.on("connection", (socket) => {
  console.log("📡 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 🔁 Gửi vị trí thật-time từ DB
setInterval(async () => {
  try {
    const lichTrinhDangChay = await LichTrinh.findAll({
      where: { trang_thai_lich: "dang_chay" },
      attributes: ["ma_lich", "ma_xe", "ma_tuyen"],
    });

    const maXeList = lichTrinhDangChay.map(lt => lt.ma_xe);

    if (maXeList.length > 0) {
      const viTriXeList = await ViTriXe.findAll({
        where: { ma_xe: maXeList },
        attributes: ["ma_xe", "vi_do", "kinh_do", "toc_do", "thoi_gian"],
        order: [['thoi_gian', 'DESC']]
      });

      const buses = lichTrinhDangChay.map(lich => {
        const viTri = viTriXeList.find(vt => vt.ma_xe === lich.ma_xe);
        return {
          ma_lich: lich.ma_lich,
          ma_xe: lich.ma_xe,
          ma_tuyen: lich.ma_tuyen,
          vi_do: viTri?.vi_do || null,
          kinh_do: viTri?.kinh_do || null,
          toc_do: viTri?.toc_do || null,
          thoi_gian: viTri?.thoi_gian || null
        };
      });

      io.emit("busLocationUpdate", buses);
    } else {
      io.emit("busLocationUpdate", []);
    }
  } catch (err) {
    console.error("❌ Lỗi khi gửi vị trí xe:", err);
  }
}, 5000);

// 🚀 Khởi động server + bắt đầu mô phỏng xe
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server chạy trên cổng ${PORT}`);
  startVehicleSimulation(io);
});