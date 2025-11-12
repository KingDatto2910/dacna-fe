import * as productModel from "../models/productModel.js";

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
      stock: { level: "in-stock", storeAddress: "" },
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
