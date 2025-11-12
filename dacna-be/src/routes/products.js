import { Router } from "express";
import {
  listProducts,
  getProductDetails,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// GET http://localhost:5000/api/products
// GET http://localhost:5000/api/products?category_slug=...
router.get("/", listProducts);

// GET http://localhost:5000/api/products/1
router.get("/:id", getProductDetails);

// POST http://localhost:5000/api/products/:id/reviews (requires authentication)
router.post("/:id/reviews", authMiddleware, createReview);

// PATCH http://localhost:5000/api/products/:productId/reviews/:reviewId (requires authentication)
router.patch("/:productId/reviews/:reviewId", authMiddleware, updateReview);

// DELETE http://localhost:5000/api/products/:productId/reviews/:reviewId (requires authentication)
router.delete("/:productId/reviews/:reviewId", authMiddleware, deleteReview);

// Xóa các route POST và PATCH cũ
// router.post("/", authMiddleware, roleMiddleware(["admin", "staff"]), create);
// router.patch("/:id/active", authMiddleware, roleMiddleware(["admin"]), setActive);

export default router;
