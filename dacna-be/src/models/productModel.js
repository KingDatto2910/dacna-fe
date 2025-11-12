import { pool } from "../db.js";

/**
 * Get products with filters: category, price range, search, sort
 * Supports: slug filters, trending/bestseller flags, price min/max, sorting
 */
export async function list(options = {}) {
  const {
    categorySlug,
    subCategorySlug,
    isTrending,
    isBestSeller,
    isTopRated,
    q,
    minPrice,
    maxPrice,
    sortBy,
  } = options;

  // Base query with JOINs for categories and thumbnail
  let sql = `
    SELECT
      p.id, p.sku, p.name, p.model, p.price, p.sale_price,
      p.is_trending, p.is_bestseller, p.average_rating, p.review_count,
      c.name AS category_name, c.slug AS category_slug,
      sc.name AS sub_category_name, sc.slug AS sub_category_slug,
      (SELECT img.image_url FROM product_images img 
       WHERE img.product_id = p.id 
       ORDER BY img.is_thumbnail DESC, img.display_order ASC
       LIMIT 1) AS thumbnail_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
  `;

  const whereClauses = [];
  const params = {};

  // Dynamic WHERE clauses based on filters
  if (categorySlug) {
    whereClauses.push("c.slug = :categorySlug");
    params.categorySlug = categorySlug;
  }
  if (subCategorySlug) {
    whereClauses.push("sc.slug = :subCategorySlug");
    params.subCategorySlug = subCategorySlug;
  }
  if (isTrending) whereClauses.push("p.is_trending = 1");
  if (isBestSeller) whereClauses.push("p.is_bestseller = 1");
  if (isTopRated) whereClauses.push("p.average_rating >= 4.5");

  if (q) {
    whereClauses.push("(p.name LIKE :q OR p.model LIKE :q OR p.sku LIKE :q)");
    params.q = `%${q}%`;
  }

  // Price range: COALESCE prioritizes sale_price over regular price
  if (minPrice !== undefined) {
    whereClauses.push("COALESCE(p.sale_price, p.price) >= :minPrice");
    params.minPrice = minPrice;
  }
  if (maxPrice !== undefined) {
    whereClauses.push("COALESCE(p.sale_price, p.price) <= :maxPrice");
    params.maxPrice = maxPrice;
  }

  if (whereClauses.length > 0) {
    sql += " WHERE " + whereClauses.join(" AND ");
  }

  // Sorting options: price-asc, price-desc, rating, newest (default)
  if (sortBy === "price-asc") {
    sql += " ORDER BY COALESCE(p.sale_price, p.price) ASC";
  } else if (sortBy === "price-desc") {
    sql += " ORDER BY COALESCE(p.sale_price, p.price) DESC";
  } else if (sortBy === "rating") {
    sql += " ORDER BY p.average_rating DESC, p.review_count DESC";
  } else if (sortBy === "newest" || isTopRated) {
    sql += " ORDER BY p.created_at DESC";
  } else {
    sql += " ORDER BY p.created_at DESC";
  }

  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * [GET] /api/products/:id
 * Lấy chi tiết 1 sản phẩm.
 * Đây là một truy vấn phức tạp, gom dữ liệu từ 4 bảng con
 */
export async function getById(id) {
  /*
   Sử dụng JSON_ARRAYAGG và JSON_OBJECT để gom nhóm ảnh, thông số, 
   và đánh giá thành các mảng JSON ngay trong SQL.
   COALESCE(..., '[]') để đảm bảo trả về mảng rỗng thay vì NULL nếu không có.
  */
  const sql = `
    SELECT
      p.id, p.sku, p.name, p.model, p.description, p.price, p.sale_price,
      p.stock_qty, p.is_trending, p.is_bestseller, p.average_rating, p.review_count,
      
      -- 1. Thông tin Category & Sub-Category
      c.name AS category_name,
      c.slug AS category_slug,
      sc.name AS sub_category_name,
      sc.slug AS sub_category_slug,
      
      -- 2. Gom nhóm mảng Ảnh (sắp xếp theo display_order)
      COALESCE(
        (SELECT JSON_ARRAYAGG(img.image_url)
         FROM product_images img 
         WHERE img.product_id = p.id
         ORDER BY img.is_thumbnail DESC, img.display_order ASC),
      '[]') AS images,
      
      -- 3. Gom nhóm mảng Thông số
      COALESCE(
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('key', spec.spec_key, 'value', spec.spec_value))
         FROM product_specifications spec 
         WHERE spec.product_id = p.id),
      '[]') AS specifications,
      
      -- 4. Gom nhóm mảng Đánh giá (sắp xếp theo ngày mới nhất)
      COALESCE(
        (SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'id', r.id,
          'rating', r.rating,
          'title', r.title,
          'comment', r.comment,
          'author', r.author_name_snapshot,
          'date', r.created_at,
          'isVerified', r.is_verified_purchase,
          'user_id', r.user_id
         ))
         FROM (SELECT * FROM reviews WHERE product_id = p.id ORDER BY created_at DESC) r),
      '[]') AS reviews
      
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
    
    WHERE p.id = :id
    
    GROUP BY p.id, c.id, sc.id; 
  `;

  const [rows] = await pool.execute(sql, { id });

  if (!rows.length) return null;

  // Parse các chuỗi JSON trả về từ CSDL
  const product = rows[0];
  product.images = JSON.parse(product.images);
  product.specifications = JSON.parse(product.specifications);
  product.reviews = JSON.parse(product.reviews);

  return product;
}

/**
 * Create a new review for a product
 */
export async function createReview(productId, reviewData) {
  const { userId, rating, title, comment, authorName, isVerifiedPurchase } =
    reviewData;

  const sql = `
    INSERT INTO reviews (product_id, user_id, rating, title, comment, author_name_snapshot, is_verified_purchase)
    VALUES (:productId, :userId, :rating, :title, :comment, :authorName, :isVerifiedPurchase)
  `;

  const [result] = await pool.execute(sql, {
    productId,
    userId: userId ?? null, // Use nullish coalescing to ensure null instead of undefined
    rating,
    title: title ?? null,
    comment: comment ?? null,
    authorName: authorName ?? "Anonymous",
    isVerifiedPurchase: isVerifiedPurchase ?? false,
  });

  // Update product average rating and review count
  await updateProductRating(productId);

  return result.insertId;
}

/**
 * Update product's average rating and review count
 * Only updates if there are reviews, otherwise keeps current rating
 */
export async function updateProductRating(productId) {
  const sql = `
    UPDATE products p
    SET 
      average_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = :productId), p.average_rating),
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = :productId)
    WHERE p.id = :productId
  `;

  await pool.execute(sql, { productId });
}

/**
 * Get a review by ID
 */
export async function getReviewById(reviewId) {
  const sql = `SELECT * FROM reviews WHERE id = :reviewId`;
  const [rows] = await pool.execute(sql, { reviewId });
  return rows.length ? rows[0] : null;
}

/**
 * Update a review
 */
export async function updateReview(reviewId, updateData) {
  const { rating, comment } = updateData;

  const sql = `
    UPDATE reviews 
    SET rating = :rating, comment = :comment, created_at = NOW()
    WHERE id = :reviewId
  `;

  const [result] = await pool.execute(sql, {
    reviewId,
    rating: Number(rating),
    comment: comment ?? null,
  });

  return result.affectedRows > 0;
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId) {
  const sql = `DELETE FROM reviews WHERE id = :reviewId`;
  const [result] = await pool.execute(sql, { reviewId });
  return result.affectedRows > 0;
}
