import { pool } from "../db.js";

/** Create new order with unique order code */
export async function createOrder({
  user_id,
  address_street,
  address_district,
  address_ward,
  address_city,
}) {
  const order_code = `OD${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const [result] = await pool.execute(
    `INSERT INTO orders (order_code, user_id, address_street, address_district, address_ward, address_city, order_status)
     VALUES (:order_code, :user_id, :address_street, :address_district, :address_ward, :address_city, 'cart')`,
    {
      order_code,
      user_id,
      address_street,
      address_district,
      address_ward,
      address_city,
    }
  );

  return { id: result.insertId, order_code };
}

/** Get basic order info by ID */
export async function getOrderById(orderId) {
  const [rows] = await pool.execute(
    "SELECT id, user_id, order_code, order_status FROM orders WHERE id = :orderId",
    { orderId }
  );
  return rows.length ? rows[0] : null;
}

/** Get full order details with items and product info */
export async function getOrderDetail(orderId) {
  const [orders] = await pool.execute(
    "SELECT id, user_id, order_code, order_status, subtotal, shipping_fee, grand_total, payment_status, created_at, updated_at FROM orders WHERE id = :orderId",
    { orderId }
  );
  if (!orders.length) return null;

  const order = orders[0];

  // Join with products to get current product info and thumbnail
  const [items] = await pool.execute(
    `SELECT
      oi.product_id, oi.qty, oi.unit_price, oi.amount,
      p.name, p.model, p.sku,
      (SELECT img.image_url FROM product_images img 
       WHERE img.product_id = p.id 
       ORDER BY img.is_thumbnail DESC LIMIT 1) AS image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = :orderId`,
    { orderId }
  );
  order.items = items;
  return order;
}

/** Get all items in an order */
export async function getOrderItems(orderId) {
  const [rows] = await pool.execute(
    "SELECT * FROM order_items WHERE order_id = :orderId",
    { orderId }
  );
  return rows;
}

/** Add or update item quantity in order (uses INSERT ON DUPLICATE KEY) */
export async function upsertItem(orderId, productId, qty) {
  const [products] = await pool.execute(
    "SELECT name, price, sale_price FROM products WHERE id = :productId",
    { productId }
  );
  if (!products.length)
    throw new Error("Sản phẩm không tồn tại hoặc ngừng kinh doanh");

  const product = products[0];
  const unitPrice = product.sale_price ?? product.price; // Prioritize sale price

  await pool.execute(
    `INSERT INTO order_items (order_id, product_id, item_name_snapshot, unit_price, qty)
     VALUES (:orderId, :productId, :name, :unitPrice, :qty)
     ON DUPLICATE KEY UPDATE 
       qty = VALUES(qty), 
       unit_price = VALUES(unit_price),
       item_name_snapshot = VALUES(item_name_snapshot)`,
    { orderId, productId, name: product.name, unitPrice, qty }
  );
}

/** Remove item from order */
export async function removeItem(orderId, productId) {
  const [result] = await pool.execute(
    "DELETE FROM order_items WHERE order_id = :orderId AND product_id = :productId",
    { orderId, productId }
  );

  if (result.affectedRows === 0)
    throw new Error("Sản phẩm không tồn tại trong đơn hàng");
}

/** Recalculate order totals: subtotal, shipping fee, grand total */
export async function recalculateTotals(orderId) {
  const [rows] = await pool.execute(
    "SELECT SUM(amount) AS subtotal FROM order_items WHERE order_id = :orderId",
    { orderId }
  );

  const subtotal = rows[0].subtotal || 0;
  const shipping_fee = subtotal > 0 && subtotal < 500000 ? 30000 : 0; // Free shipping over 500k

  await pool.execute(
    `UPDATE orders
     SET subtotal = :subtotal, 
         shipping_fee = :shipping_fee, 
         grand_total = :subtotal + :shipping_fee
     WHERE id = :orderId`,
    { subtotal, shipping_fee, orderId }
  );
}

/** Move order from cart to awaiting_payment status */
export async function checkoutOrder(orderId) {
  const [orderRows] = await pool.execute(
    "SELECT order_status FROM orders WHERE id = :orderId",
    { orderId }
  );
  if (!orderRows.length) throw new Error("Không tìm thấy đơn hàng");

  const order = orderRows[0];
  if (order.order_status !== "cart")
    throw new Error("Đơn hàng đã được checkout");

  await pool.execute(
    "UPDATE orders SET order_status = 'awaiting_payment' WHERE id = :orderId",
    { orderId }
  );
}

/** Mark order as paid */
export async function payOrder(orderId, method) {
  const [orders] = await pool.execute(
    "SELECT order_status FROM orders WHERE id = :orderId",
    { orderId }
  );
  if (!orders.length) throw new Error("Không tìm thấy đơn hàng");

  const order = orders[0];
  if (!["awaiting_payment", "created"].includes(order.order_status))
    throw new Error("Không thể thanh toán đơn hàng ở trạng thái hiện tại");

  await pool.execute(
    `UPDATE orders 
     SET payment_method = :method, 
         payment_status = 'paid',
         order_status = 'paid',
         updated_at = NOW()
     WHERE id = :orderId`,
    { method, orderId }
  );
}

/** Update order status (admin/staff only) */
export async function updateStatus(orderId, newStatus) {
  await pool.execute(
    "UPDATE orders SET order_status = :newStatus, updated_at = NOW() WHERE id = :orderId",
    { newStatus, orderId }
  );
}

/** Find user's cart (order with status='cart') */
export async function getCartDetailByUserId(userId) {
  const [rows] = await pool.execute(
    "SELECT id FROM orders WHERE user_id = :userId AND order_status = 'cart' LIMIT 1",
    { userId }
  );
  if (!rows.length) return null;
  return getOrderDetail(rows[0].id);
}

/** Get or create cart for user */
export async function findOrCreateCart(userId) {
  let cart = await getCartDetailByUserId(userId);
  if (cart) return cart;

  const order_code = `CART${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const [result] = await pool.execute(
    `INSERT INTO orders (order_code, user_id, order_status) VALUES (:order_code, :userId, 'cart')`,
    { order_code, userId }
  );

  return getOrderDetail(result.insertId);
}

/** Get user's order history (excluding cart) */
export async function getOrdersByUserId(userId) {
  const [orders] = await pool.execute(
    `SELECT 
      id, order_code, order_status, subtotal, shipping_fee, grand_total, 
      payment_status, payment_method, created_at, updated_at
    FROM orders 
    WHERE user_id = :userId 
    AND order_status != 'cart'
    ORDER BY created_at DESC`,
    { userId }
  );
  return orders;
}

/** Create order for guest (user_id = NULL) */
export async function createGuestOrder({
  address_street,
  address_district,
  address_ward,
  address_city,
  subtotal,
  shipping_fee,
  grand_total,
  payment_method,
}) {
  const order_code = `OD${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const [result] = await pool.execute(
    `INSERT INTO orders (
      order_code, user_id, address_street, address_district, address_ward, address_city,
      subtotal, shipping_fee, grand_total, payment_method, order_status
    ) VALUES (
      :order_code, NULL, :address_street, :address_district, :address_ward, :address_city,
      :subtotal, :shipping_fee, :grand_total, :payment_method, 'cart'
    )`,
    {
      order_code,
      address_street,
      address_district,
      address_ward,
      address_city,
      subtotal: subtotal || 0,
      shipping_fee: shipping_fee || 0,
      grand_total: grand_total || 0,
      payment_method,
    }
  );

  return { id: result.insertId, order_code };
}

/** Track order by order code (public access) */
export async function getOrderByCode(orderCode) {
  const [rows] = await pool.execute(
    `SELECT 
      o.id, o.order_code, o.user_id, o.address_street, o.address_district, 
      o.address_ward, o.address_city, o.subtotal, o.shipping_fee, o.grand_total,
      o.payment_method, o.payment_status, o.order_status, 
      o.created_at, o.updated_at
    FROM orders o
    WHERE o.order_code = :orderCode`,
    { orderCode }
  );

  if (rows.length === 0) return null;

  const order = rows[0];

  const [items] = await pool.execute(
    `SELECT 
      oi.id, oi.product_id, oi.item_name_snapshot, oi.unit_price, oi.qty, oi.amount
    FROM order_items oi
    WHERE oi.order_id = :orderId`,
    { orderId: order.id }
  );

  return { ...order, items };
}
