import { Router } from "express";
import {
  create,
  detail,
  addItem,
  removeItem,
  checkout,
  pay,
  updateStatus,
  getMyCart,
  getMyOrders,
  createGuestOrder,
  trackByCode,
} from "../controllers/orderController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

// Guest routes (no authentication required)
router.post("/guest", createGuestOrder); // Create guest order
router.get("/track/:code", trackByCode); // Track order by code

// Authenticated routes
router.get("/my-cart", authMiddleware, getMyCart);
router.get("/my-orders", authMiddleware, getMyOrders);

router.post("/", authMiddleware, create);

router.get("/:id", authMiddleware, detail);

router.post("/:id/items", authMiddleware, addItem);

router.delete("/:id/items/:productId", authMiddleware, removeItem);

// Tính tổng giá tiền (có ship)
router.post("/:id/checkout", authMiddleware, checkout);

router.post("/:id/pay", authMiddleware, pay);

// Trạng thái (shipping, delivered, cancelled,...) chỉ admin/staff là thay đổi đc
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "staff"]),
  updateStatus
);

export default router;
