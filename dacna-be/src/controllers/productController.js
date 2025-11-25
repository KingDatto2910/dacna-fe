import * as productModel from "../models/productModel.js";
import { pool } from "../db.js";

/**
 * List products with filters and sorting
 * Query params: category_slug, sub_category_slug, q, trending, bestseller,
 *               toprated, min_price, max_price, sort
 */
export async function listProducts(req, res, next) {
  try {
    const {
      category_slug,
      sub_category_slug,
      q,
      trending,
      bestseller,
      toprated,
      min_price,
      max_price,
      sort,
    } = req.query;

    const options = {
      categorySlug: category_slug,
      subCategorySlug: sub_category_slug,
      q: q,
      isTrending: trending === "true",
      isBestSeller: bestseller === "true",
      isTopRated: toprated === "true",
      minPrice: min_price ? parseFloat(min_price) : undefined,
      maxPrice: max_price ? parseFloat(max_price) : undefined,
      sortBy: sort, // Options: price-asc, price-desc, rating, newest
    };

    const data = await productModel.list(options);

    // Transform DB format to frontend format
    const feProducts = data.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      price: parseFloat(p.price),
      salePrice: p.sale_price ? parseFloat(p.sale_price) : undefined,
      images: [p.thumbnail_url || "/placeholder.svg"],
      category: p.category_name,
      categorySlug: p.category_slug,
      subCategory: p.sub_category_name || undefined,
      subCategorySlug: p.sub_category_slug || undefined,
      rating: parseFloat(p.average_rating),
      reviewCount: p.review_count,
      isBestSeller: p.is_bestseller === 1,
      isTrending: p.is_trending === 1,
      sku: p.sku,
      model: p.model,
      // Fields required by FE but not in list query
      description: "",
      specifications: [],
      stock: {
        level:
          p.stock_qty > 10
            ? "in-stock"
            : p.stock_qty > 0
            ? "low-stock"
            : "out-of-stock",
        storeAddress: "",
      },
      reviews: [],
    }));

    res.json({ ok: true, count: feProducts.length, data: feProducts });
  } catch (err) {
    next(err);
  }
}

/**
 * Get product details by ID
 */
export async function getProductDetails(req, res, next) {
  try {
    const { id } = req.params;
    const data = await productModel.getById(id);

    if (!data) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy sản phẩm" });
    }

    // Chuyển đổi cấu trúc DB sang cấu trúc FE mong muốn
    const feProduct = {
      id: data.id.toString(),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      salePrice: data.sale_price ? parseFloat(data.sale_price) : undefined,
      images: data.images.length > 0 ? data.images : ["/placeholder.svg"],
      category: data.category_name,
      categorySlug: data.category_slug,
      subCategory: data.sub_category_name || undefined,
      subCategorySlug: data.sub_category_slug || undefined,
      category_id: data.category_id ?? null,
      sub_category_id: data.sub_category_id ?? null,
      rating: parseFloat(data.average_rating),
      reviewCount: data.review_count,
      isBestSeller: data.is_bestseller === 1,
      isTrending: data.is_trending === 1,
      sku: data.sku,
      model: data.model,
      specifications: data.specifications,
      // Chuyển đổi stock_qty (số) sang stock (đối tượng)
      stock: {
        level:
          data.stock_qty > 10
            ? "in-stock"
            : data.stock_qty > 0
            ? "low-stock"
            : "out-of-stock",
        storeAddress: "123 Main St, Ho Chi Minh City", // (Fake)
      },
      reviews: data.reviews.map((r) => ({
        ...r,
        isVerified: r.isVerified === 1,
        // Format lại ngày
        date: new Date(r.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      })),
    };

    res.json({ ok: true, data: feProduct });
  } catch (err) {
    next(err);
  }
}

/**
 * [POST] /api/products/:id/reviews
 * Create a new review for a product
 * Requires authentication
 */
export async function createReview(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: "You must be logged in to write a review",
      });
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ ok: false, message: "Rating must be between 1 and 5" });
    }
    if (!comment || !comment.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: "Review comment is required" });
    }

    const reviewData = {
      userId: req.user.id,
      rating: Number(rating),
      title: null,
      comment: comment.trim(),
      authorName: req.user.username || req.user.name || "User", // Fallback if username is undefined
      isVerifiedPurchase: true, // Always verified since user is logged in
    };

    const reviewId = await productModel.createReview(id, reviewData);

    res.status(201).json({
      ok: true,
      message: "Review created successfully",
      data: { reviewId },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * [PATCH] /api/products/:productId/reviews/:reviewId
 * Update a review (only by the author)
 */
export async function updateReview(req, res, next) {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ ok: false, message: "Rating must be between 1 and 5" });
    }
    if (!comment || !comment.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: "Review comment is required" });
    }

    // Check if review exists and belongs to the user
    const review = await productModel.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ ok: false, message: "Review not found" });
    }

    if (review.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ ok: false, message: "You can only edit your own reviews" });
    }

    // Update review
    const success = await productModel.updateReview(reviewId, {
      rating: Number(rating),
      comment: comment.trim(),
    });

    if (!success) {
      return res
        .status(500)
        .json({ ok: false, message: "Failed to update review" });
    }

    // Update product rating stats
    await productModel.updateProductRating(productId);

    res.json({
      ok: true,
      message: "Review updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * [DELETE] /api/products/:productId/reviews/:reviewId
 * Delete a review (only by the author)
 */
export async function deleteReview(req, res, next) {
  try {
    const { productId, reviewId } = req.params;

    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // Check if review exists and belongs to the user
    const review = await productModel.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ ok: false, message: "Review not found" });
    }

    if (review.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ ok: false, message: "You can only delete your own reviews" });
    }

    // Delete review
    const success = await productModel.deleteReview(reviewId);

    if (!success) {
      return res
        .status(500)
        .json({ ok: false, message: "Failed to delete review" });
    }

    // Update product rating stats
    await productModel.updateProductRating(productId);

    res.json({
      ok: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

/* ========== ADMIN FUNCTIONS ========== */

/**
 * [POST] /api/products/admin
 * Create a new product (admin only)
 */
export async function createProduct(req, res, next) {
  try {
    const {
      sku,
      name,
      model,
      description,
      price,
      sale_price,
      category_id,
      sub_category_id,
      stock_qty,
      is_trending,
      is_bestseller,
      specifications,
      images,
    } = req.body;

    // Validation
    if (!sku || !name || !price || !category_id) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields: sku, name, price, category_id",
      });
    }

    // Insert product
    const [result] = await pool.execute(
      `INSERT INTO products 
       (sku, name, model, description, price, sale_price, category_id, sub_category_id, 
        stock_qty, is_trending, is_bestseller) 
       VALUES (:sku, :name, :model, :description, :price, :sale_price, :category_id, 
               :sub_category_id, :stock_qty, :is_trending, :is_bestseller)`,
      {
        sku,
        name,
        model: model || null,
        description: description || null,
        price,
        sale_price: sale_price || null,
        category_id,
        sub_category_id: sub_category_id || null,
        stock_qty: stock_qty || 0,
        is_trending: is_trending ? 1 : 0,
        is_bestseller: is_bestseller ? 1 : 0,
      }
    );

    const productId = result.insertId;

    // Insert specifications if provided
    if (specifications && Array.isArray(specifications)) {
      for (const spec of specifications) {
        await pool.execute(
          `INSERT INTO product_specifications (product_id, spec_key, spec_value) 
           VALUES (:product_id, :spec_key, :spec_value)`,
          {
            product_id: productId,
            spec_key: spec.key,
            spec_value: spec.value,
          }
        );
      }
    }

    // Insert images if provided
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await pool.execute(
          `INSERT INTO product_images (product_id, image_url, is_thumbnail, display_order) 
           VALUES (:product_id, :image_url, :is_thumbnail, :display_order)`,
          {
            product_id: productId,
            image_url: images[i],
            is_thumbnail: i === 0 ? 1 : 0,
            display_order: i,
          }
        );
      }
    }

    res.status(201).json({
      ok: true,
      message: "Product created successfully",
      data: { productId },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * [PATCH] /api/products/admin/:id
 * Update a product (admin only)
 */
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      sku,
      name,
      model,
      description,
      price,
      sale_price,
      category_id,
      sub_category_id,
      stock_qty,
      is_trending,
      is_bestseller,
      specifications,
      images,
    } = req.body;

    // Check if product exists
    const [rows] = await pool.execute(
      `SELECT id FROM products WHERE id = :id`,
      { id }
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Product not found" });
    }

    // Build dynamic update query
    const updates = [];
    const params = { id };

    if (sku !== undefined) {
      updates.push("sku = :sku");
      params.sku = sku;
    }
    if (name !== undefined) {
      updates.push("name = :name");
      params.name = name;
    }
    if (model !== undefined) {
      updates.push("model = :model");
      params.model = model;
    }
    if (description !== undefined) {
      updates.push("description = :description");
      params.description = description;
    }
    if (price !== undefined) {
      updates.push("price = :price");
      params.price = price;
    }
    if (sale_price !== undefined) {
      updates.push("sale_price = :sale_price");
      params.sale_price = sale_price;
    }
    if (category_id !== undefined) {
      updates.push("category_id = :category_id");
      params.category_id = category_id;
    }
    if (sub_category_id !== undefined) {
      updates.push("sub_category_id = :sub_category_id");
      params.sub_category_id = sub_category_id;
    }
    if (stock_qty !== undefined) {
      updates.push("stock_qty = :stock_qty");
      params.stock_qty = stock_qty;
    }
    if (is_trending !== undefined) {
      updates.push("is_trending = :is_trending");
      params.is_trending = is_trending ? 1 : 0;
    }
    if (is_bestseller !== undefined) {
      updates.push("is_bestseller = :is_bestseller");
      params.is_bestseller = is_bestseller ? 1 : 0;
    }

    if (updates.length > 0) {
      await pool.execute(
        `UPDATE products SET ${updates.join(", ")} WHERE id = :id`,
        params
      );
    }

    // Update specifications if provided
    if (specifications && Array.isArray(specifications)) {
      // Delete old specs
      await pool.execute(
        `DELETE FROM product_specifications WHERE product_id = :id`,
        { id }
      );
      // Insert new specs
      for (const spec of specifications) {
        await pool.execute(
          `INSERT INTO product_specifications (product_id, spec_key, spec_value) 
           VALUES (:product_id, :spec_key, :spec_value)`,
          { product_id: id, spec_key: spec.key, spec_value: spec.value }
        );
      }
    }

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete old images
      await pool.execute(`DELETE FROM product_images WHERE product_id = :id`, {
        id,
      });
      // Insert new images
      for (let i = 0; i < images.length; i++) {
        await pool.execute(
          `INSERT INTO product_images (product_id, image_url, is_thumbnail, display_order) 
           VALUES (:product_id, :image_url, :is_thumbnail, :display_order)`,
          {
            product_id: id,
            image_url: images[i],
            is_thumbnail: i === 0 ? 1 : 0,
            display_order: i,
          }
        );
      }
    }

    res.json({ ok: true, message: "Product updated successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * [DELETE] /api/products/admin/:id
 * Delete a product (admin only)
 */
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    // Check if product exists
    const [rows] = await pool.execute(
      `SELECT id FROM products WHERE id = :id`,
      { id }
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Product not found" });
    }

    // Delete related data (cascade will handle most, but explicit for clarity)
    await pool.execute(`DELETE FROM product_images WHERE product_id = :id`, {
      id,
    });
    await pool.execute(
      `DELETE FROM product_specifications WHERE product_id = :id`,
      { id }
    );
    await pool.execute(`DELETE FROM reviews WHERE product_id = :id`, { id });
    await pool.execute(`DELETE FROM products WHERE id = :id`, { id });

    res.json({ ok: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * [PATCH] /api/products/admin/:id/stock
 * Update product stock (admin & staff)
 */
export async function updateProductStock(req, res, next) {
  try {
    const { id } = req.params;
    const { stock_qty } = req.body;

    if (stock_qty === undefined || stock_qty < 0) {
      return res.status(400).json({
        ok: false,
        message: "Invalid stock_qty (must be >= 0)",
      });
    }

    const [result] = await pool.execute(
      `UPDATE products SET stock_qty = :stock_qty WHERE id = :id`,
      { id, stock_qty }
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Product not found" });
    }

    res.json({ ok: true, message: "Stock updated successfully" });
  } catch (err) {
    next(err);
  }
}

