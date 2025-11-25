// dacna-be/src/routes/users.js
import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  listAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

// ========== ADMIN ROUTES ==========
// GET /api/users/admin - list all users (admin only)
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), listAllUsers);

// POST /api/users/admin - create user (admin only)
router.post("/admin", authMiddleware, roleMiddleware(["admin"]), createUser);

// GET /api/users/admin/:id - get user by ID (admin only)
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getUserById
);

// PATCH /api/users/admin/:id - update user (admin only)
router.patch(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUser
);

// DELETE /api/users/admin/:id - delete user (admin only)
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteUser
);

// ========== USER ROUTES ==========
// GET /api/users/profile - lấy thông tin user hiện tại
router.get("/profile", authMiddleware, getUserProfile);

// PUT /api/users/profile - cập nhật thông tin user hiện tại
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
