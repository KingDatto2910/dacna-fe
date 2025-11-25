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
  listAllOrdersForAdmin,
  getOrderDetailForAdmin,
} from "../controllers/orderController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.js";

const router = Router();

// ============ ADMIN ROUTES ============
// [GET] /api/orders/admin - danh sách tất cả đơn cho admin/staff
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin", "staff"]),
  listAllOrdersForAdmin
);

// [GET] /api/orders/admin/:id - chi tiết 1 đơn
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin", "staff"]),
  getOrderDetailForAdmin
);

// ============ PUBLIC & USER ROUTES ============
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
