import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Cấu hình kết nối Sequelize với MySQL (hỗ trợ Unicode tiếng Việt)
export const sequelize = new Sequelize(
  process.env.DB_NAME,     // Tên CSDL
  process.env.DB_USER,     // Tên user MySQL
  process.env.DB_PASS,     // Mật khẩu
  {
    host: process.env.DB_HOST,  // Ví dụ: "localhost"
    dialect: "mysql",
    logging: false,

    // ⚙️ Thiết lập mã hóa để hiển thị đúng tiếng Việt
    dialectOptions: {
      charset: "utf8mb4", // đảm bảo client dùng UTF-8
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    timezone: "+07:00", // múi giờ Việt Nam (tùy chọn)
  }
);

// Hàm kết nối
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối MySQL thành công (UTF8MB4)");

    // Kiểm tra nhanh việc hiển thị tiếng Việt
    const [result] = await sequelize.query(
      "SELECT ho_ten FROM taixe LIMIT 1;",
      { raw: true }
    );
    if (result?.ho_ten)
      console.log("🧪 Test tiếng Việt:", result.ho_ten);
    else console.log("ℹ️ Không có dữ liệu để test tiếng Việt");
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
    process.exit(1);
  }
};
