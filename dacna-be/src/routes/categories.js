import { Router } from "express";
import {
  listCategories,
  getCategoryDetails,
} from "../controllers/categoryController.js";

const router = Router();

// GET http://localhost:5000/api/categories
router.get("/", listCategories);

// GET http://localhost:5000/api/categories/electronics
router.get("/:slug", getCategoryDetails);

export default router;
