import express from "express";
import { loginDriver } from "../controllers/driverController.js";

const router = express.Router();

// POST /api/driver/login
router.post("/login", loginDriver);

export default router;
