import express from "express";
import { loginParent, getChildren } from "../controllers/parentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Đăng nhập phụ huynh
router.post("/login", loginParent);

// Lấy danh sách học sinh (dành cho frontend mới)
router.get("/:parentId/students", verifyToken, getChildren);

// Giữ lại route cũ cho tương thích nếu cần
router.get("/children", verifyToken, getChildren);

export default router;
