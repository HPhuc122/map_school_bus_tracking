import express from "express";
import { getStudentLocation } from "../controllers/studentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id/location", verifyToken, getStudentLocation);

export default router;
