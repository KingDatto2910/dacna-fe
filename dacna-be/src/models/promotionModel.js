import { pool } from "../db.js";

/**
 * Get all promotions with pagination and filters
 */
export async function list(options = {}) {
  const { page = 1, limit = 20, is_active, search, sort_by, sort_dir } = options;

  const whereClauses = [];
  const params = {};

  if (is_active !== undefined) {
    whereClauses.push("is_active = :is_active");
    params.is_active = is_active ? 1 : 0;
  }

  if (search) {
    whereClauses.push("(code LIKE :search OR description LIKE :search)");
    params.search = `%${search}%`;
  }

  let whereSQL = "";
  if (whereClauses.length > 0) {
    whereSQL = "WHERE " + whereClauses.join(" AND ");
  }

  // Count total
  const countSQL = `SELECT COUNT(*) as total FROM promotions ${whereSQL}`;
  const [countRows] = whereClauses.length > 0
    ? await pool.execute(countSQL, params)
    : await pool.query(countSQL);
  const total = countRows[0].total;

  // Sorting
  const allowedSort = {
    id: 'id',
    code: 'code',
    discount_value: 'discount_value',
    start_date: 'start_date',
    end_date: 'end_date',
    usage_count: 'usage_count',
    created_at: 'created_at'
  };
  const column = allowedSort[String(sort_by)] || 'created_at';
  const direction = String(sort_dir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const offset = (page - 1) * limit;

  let rows;
  if (whereClauses.length > 0) {
    const dataSQL = `
      SELECT * FROM promotions 
      ${whereSQL}
      ORDER BY ${column} ${direction}
      LIMIT ${parseInt(limit)} OFFSET ${offset}
    `;
    [rows] = await pool.execute(dataSQL, params);
  } else {
    const dataSQL = `
      SELECT * FROM promotions 
      ORDER BY ${column} ${direction}
      LIMIT ${parseInt(limit)} OFFSET ${offset}
    `;
    [rows] = await pool.query(dataSQL);
  }

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get promotion by ID
 */
export async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT * FROM promotions WHERE id = :id`,
    { id }
  );
  return rows[0] || null;
}

/**
 * Get promotion by code
 */
export async function getByCode(code) {
  const [rows] = await pool.execute(
    `SELECT * FROM promotions WHERE code = :code`,
    { code: code.toUpperCase() }
  );
  return rows[0] || null;
}

/**
 * Validate promotion code for a user and order
 */
export async function validatePromotion(code, userId, orderAmount) {
  const promo = await getByCode(code);
  
  if (!promo) {
    return { valid: false, message: "Invalid promotion code" };
  }

  if (!promo.is_active) {
    return { valid: false, message: "This promotion is no longer active" };
  }

  const now = new Date();
  const startDate = new Date(promo.start_date);
  const endDate = new Date(promo.end_date);

  if (now < startDate) {
    return { valid: false, message: "This promotion has not started yet" };
  }

  if (now > endDate) {
    return { valid: false, message: "This promotion has expired" };
  }

  if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
    return { valid: false, message: "This promotion has reached its usage limit" };
  }

  if (promo.min_order_amount && orderAmount < promo.min_order_amount) {
    return { 
      valid: false, 
      message: `Minimum order amount of $${promo.min_order_amount} required` 
    };
  }

  // Check user usage limit
  if (userId && promo.per_user_limit) {
    const [userUsage] = await pool.execute(
      `SELECT COUNT(*) as count FROM user_promotions 
       WHERE user_id = :userId AND promotion_id = :promoId`,
      { userId, promoId: promo.id }
    );

    if (userUsage[0].count >= promo.per_user_limit) {
      return { valid: false, message: "You have already used this promotion" };
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (promo.discount_type === 'percentage') {
    discountAmount = (orderAmount * promo.discount_value) / 100;
    if (promo.max_discount_amount && discountAmount > promo.max_discount_amount) {
      discountAmount = promo.max_discount_amount;
    }
  } else {
    discountAmount = promo.discount_value;
  }

  return {
    valid: true,
    promotion: promo,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
  };
}

/**
 * Create a new promotion
 */
export async function create(data) {
  const {
    code,
    description,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount_amount,
    usage_limit,
    per_user_limit,
    start_date,
    end_date,
    is_active,
  } = data;

  const [result] = await pool.execute(
    `INSERT INTO promotions 
     (code, description, discount_type, discount_value, min_order_amount, 
      max_discount_amount, usage_limit, per_user_limit, start_date, end_date, is_active)
     VALUES (:code, :description, :discount_type, :discount_value, :min_order_amount,
             :max_discount_amount, :usage_limit, :per_user_limit, :start_date, :end_date, :is_active)`,
    {
      code: code.toUpperCase(),
      description: description || null,
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || null,
      max_discount_amount: max_discount_amount || null,
      usage_limit: usage_limit || null,
      per_user_limit: per_user_limit || 1,
      start_date,
      end_date,
      is_active: is_active ? 1 : 0,
    }
  );

  return result.insertId;
}

/**
 * Update a promotion
 */
export async function update(id, data) {
  const updates = [];
  const params = { id };

  const fields = [
    'code', 'description', 'discount_type', 'discount_value',
    'min_order_amount', 'max_discount_amount', 'usage_limit',
    'per_user_limit', 'start_date', 'end_date', 'is_active'
  ];

  fields.forEach(field => {
    if (data[field] !== undefined) {
      updates.push(`${field} = :${field}`);
      if (field === 'code') {
        params[field] = data[field].toUpperCase();
      } else if (field === 'is_active') {
        params[field] = data[field] ? 1 : 0;
      } else {
        params[field] = data[field];
      }
    }
  });

  if (updates.length === 0) return false;

  const [result] = await pool.execute(
    `UPDATE promotions SET ${updates.join(", ")} WHERE id = :id`,
    params
  );

  return result.affectedRows > 0;
}

/**
 * Delete a promotion
 */
export async function deletePromotion(id) {
  const [result] = await pool.execute(
    `DELETE FROM promotions WHERE id = :id`,
    { id }
  );
  return result.affectedRows > 0;
}

/**
 * Record promotion usage
 */
export async function recordUsage(promotionId, userId, orderId) {
  // Increment usage count
  await pool.execute(
    `UPDATE promotions SET usage_count = usage_count + 1 WHERE id = :promotionId`,
    { promotionId }
  );

  // Record user usage if user is logged in
  if (userId) {
    await pool.execute(
      `INSERT INTO user_promotions (user_id, promotion_id, order_id) 
       VALUES (:userId, :promotionId, :orderId)`,
      { userId, promotionId, orderId: orderId || null }
    );
  }
}

/**
 * Get user's promotion usage history
 */
export async function getUserUsage(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.execute(
    `SELECT 
       up.id, up.used_at,
       p.code, p.description, p.discount_type, p.discount_value,
       o.order_code, o.grand_total
     FROM user_promotions up
     JOIN promotions p ON up.promotion_id = p.id
     LEFT JOIN orders o ON up.order_id = o.id
     WHERE up.user_id = :userId
     ORDER BY up.used_at DESC
     LIMIT ${parseInt(limit)} OFFSET ${offset}`,
    { userId }
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) as total FROM user_promotions WHERE user_id = :userId`,
    { userId }
  );

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit),
    },
  };
}
