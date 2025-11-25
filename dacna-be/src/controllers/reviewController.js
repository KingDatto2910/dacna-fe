import {pool} from "../db.js";

/**
 * [GET] /api/reviews/admin
 * List all reviews with filters (admin only)
 */
export async function listAllReviews(req, res, next) {
    try {
        const {product_id, rating, search, page = 1, limit = 20, sort_by, sort_dir} = req.query;

        const whereClauses = [];
        const params = {};

        if (product_id) {
            whereClauses.push("r.product_id = :product_id");
            params.product_id = product_id;
        }

        if (rating) {
            whereClauses.push("r.rating = :rating");
            params.rating = rating;
        }

        if (search) {
            whereClauses.push(
                "(r.comment LIKE :search OR u.username LIKE :search OR p.name LIKE :search)"
            );
            params.search = `%${search}%`;
        }

        let whereSQL = "";
        if (whereClauses.length > 0) {
            whereSQL = "WHERE " + whereClauses.join(" AND ");
        }

        // Get total count
        const countSQL = `
      SELECT COUNT(*) as total 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ${whereSQL}
    `;

        const [countRows] = whereClauses.length > 0
            ? await pool.execute(countSQL, params)
            : await pool.query(countSQL);
        const total = countRows[0].total;

        // Sorting whitelist
        const allowedSort = {
            id: 'r.id',
            rating: 'r.rating',
            created_at: 'r.created_at',
            product_id: 'r.product_id'
        };
        const column = allowedSort[String(sort_by)] || 'r.created_at';
        const direction = String(sort_dir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get paginated results
        const offset = (page - 1) * limit;

        let rows;

        if (whereClauses.length > 0) {
            // Use named parameters when we have WHERE conditions
            const dataSQL = `
        SELECT 
          r.id, r.product_id, r.user_id, r.rating, r.title, r.comment,
          r.admin_reply, r.admin_reply_at,
          r.is_verified_purchase, r.created_at,
          u.username, u.email,
          p.name as product_name, p.sku as product_sku
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ${whereSQL}
        ORDER BY ${column} ${direction}
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;
            [rows] = await pool.execute(dataSQL, params);
        } else {
            // No WHERE conditions - use pool.query()
            const dataSQL = `
        SELECT 
          r.id, r.product_id, r.user_id, r.rating, r.title, r.comment,
          r.admin_reply, r.admin_reply_at,
          r.is_verified_purchase, r.created_at,
          u.username, u.email,
          p.name as product_name, p.sku as product_sku
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY ${column} ${direction}
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;
            [rows] = await pool.query(dataSQL);
        }

        res.json({
            ok: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * [DELETE] /api/reviews/admin/:id
 * Delete a review (admin only)
 */
export async function deleteReviewByAdmin(req, res, next) {
    try {
        const {id} = req.params;

        // Check if review exists
        const [rows] = await pool.execute(
            `SELECT id, product_id FROM reviews WHERE id = :id`,
            {id}
        );
        if (rows.length === 0) {
            return res.status(404).json({ok: false, message: "Review not found"});
        }

        const productId = rows[0].product_id;

        // Delete review
        await pool.execute(`DELETE FROM reviews WHERE id = :id`, {id});

        // Update product rating stats
        await updateProductRatingStats(productId);

        res.json({ok: true, message: "Review deleted successfully"});
    } catch (err) {
        next(err);
    }
}

/**
 * Helper function to recalculate product rating stats
 */
async function updateProductRatingStats(productId) {
    const [stats] = await pool.execute(
        `SELECT 
       COALESCE(AVG(rating), 0) as avg_rating,
       COUNT(*) as review_count
     FROM reviews 
     WHERE product_id = :productId`,
        {productId}
    );

    await pool.execute(
        `UPDATE products 
     SET average_rating = :avg_rating, review_count = :review_count 
     WHERE id = :productId`,
        {
            productId,
            avg_rating: stats[0].avg_rating,
            review_count: stats[0].review_count,
        }
    );
}

/**
 * [PATCH] /api/reviews/admin/:id/reply
 * Add or update admin reply to a review (admin/staff only)
 */
export async function updateReviewReply(req, res, next) {
    try {
        const {id} = req.params;
        const {admin_reply} = req.body;

        if (!admin_reply || !admin_reply.trim()) {
            return res.status(400).json({ok: false, message: "Reply text is required"});
        }

        // Check if review exists
        const [rows] = await pool.execute(
            `SELECT id FROM reviews WHERE id = :id`,
            {id}
        );
        if (rows.length === 0) {
            return res.status(404).json({ok: false, message: "Review not found"});
        }

        // Update admin reply
        await pool.execute(
            `UPDATE reviews 
       SET admin_reply = :admin_reply, admin_reply_at = NOW() 
       WHERE id = :id`,
            {id, admin_reply: admin_reply.trim()}
        );

        res.json({ok: true, message: "Reply saved successfully"});
    } catch (err) {
        next(err);
    }
}
