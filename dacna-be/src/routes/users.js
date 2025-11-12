// dacna-be/src/routes/users.js
import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// GET /api/users/profile - lấy thông tin user hiện tại
router.get("/profile", authMiddleware, getUserProfile);

// PUT /api/users/profile - cập nhật thông tin user hiện tại
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
