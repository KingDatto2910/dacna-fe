import * as Order from "../models/orderModel.js";
import {pool} from "../db.js";
import * as promotionModel from "../models/promotionModel.js";

/** Normalize and validate address fields from request body */
function normalizeAddressFields(body) {
    let {address_street, address_district, address_ward, address_city} = body;
    if (!address_street || !address_city) return null;
    address_street = address_street.toString().trim();
    address_city = address_city.toString().trim();
    const district =
        typeof address_district === "string" && address_district.trim()
            ? address_district.trim()
            : null;
    const ward =
        typeof address_ward === "string" && address_ward.trim()
            ? address_ward.trim()
            : null;
    return {
        address_street,
        address_city,
        address_district: district,
        address_ward: ward,
    };
}

/** Check if user has permission to modify order (guest vs registered user) */
function ensureCanActOnOrder(order, req) {
    if (!req.user && order.user_id != null) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
    }
    if (
        req.user &&
        req.user.role === "customer" &&
        order.user_id !== req.user.id
    ) {
        const err = new Error("Không có quyền thao tác với đơn hàng này");
        err.status = 403;
        throw err;
    }
}

/** Create order for authenticated user */
export async function create(req, res, next) {
    try {
        if (!req.user)
            return res.status(401).json({ok: false, error: "Unauthorized"});

        const normalized = normalizeAddressFields(req.body);
        if (!normalized)
            return res
                .status(400)
                .json({ok: false, error: "Thiếu thông tin địa chỉ giao hàng"});

        const data = await Order.createOrder({
            user_id: req.user.id,
            ...normalized,
        });
        res
            .status(201)
            .json({ok: true, message: "Đơn hàng được tạo thành công", data});
    } catch (err) {
        next(err);
    }
}

/** Get order details by ID */
export async function detail(req, res, next) {
    try {
        if (!req.user)
            return res.status(401).json({ok: false, error: "Unauthorized"});

        const id = +req.params.id;
        const order = await Order.getOrderDetail(id);

        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});
        if (req.user.role === "customer" && order.user_id !== req.user.id)
            return res
                .status(403)
                .json({ok: false, error: "Không có quyền xem đơn hàng này"});

        res.json({ok: true, data: order});
    } catch (err) {
        next(err);
    }
}

/** Add or update product quantity in cart */
export async function addItem(req, res, next) {
    try {
        const id = +req.params.id;
        const {product_id, qty} = req.body;

        if (!product_id || !qty || qty <= 0)
            return res
                .status(400)
                .json({ok: false, error: "Số lượng không hợp lệ"});

        const order = await Order.getOrderById(id);
        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});

        ensureCanActOnOrder(order, req);

        if (order.order_status !== "cart")
            return res
                .status(400)
                .json({
                    ok: false,
                    error: "Không thể thêm sản phẩm sau khi đã checkout",
                });

        await Order.upsertItem(id, product_id, qty);
        await Order.recalculateTotals(id);

        res.json({ok: true, message: "Thêm hoặc cập nhật sản phẩm thành công"});
    } catch (err) {
        next(err);
    }
}

/** Remove product from cart */
export async function removeItem(req, res, next) {
    try {
        const {id, productId} = req.params;

        const order = await Order.getOrderById(+id);
        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});

        ensureCanActOnOrder(order, req);

        if (order.order_status !== "cart")
            return res
                .status(400)
                .json({
                    ok: false,
                    error: "Không thể xoá item trong đơn hàng đã checkout",
                });

        await Order.removeItem(+id, +productId);
        await Order.recalculateTotals(+id);

        res.json({ok: true, message: "Xóa sản phẩm khỏi đơn hàng thành công"});
    } catch (err) {
        next(err);
    }
}

/** Move cart to awaiting payment status */
export async function checkout(req, res, next) {
    try {
        const id = +req.params.id;
        const {promotion_code} = req.body;

        const order = await Order.getOrderById(id);
        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});
        ensureCanActOnOrder(order, req);

        const items = await Order.getOrderItems(id);
        if (!items.length)
            return res
                .status(400)
                .json({ok: false, error: "Không thể checkout đơn hàng trống"});

        // Apply promotion if provided
        if (promotion_code) {
            const orderTotals = await Order.getOrderDetail(id);
            const orderAmount = (orderTotals.subtotal || 0) + (orderTotals.shipping_fee || 0);
            const validation = await promotionModel.validatePromotion(
                promotion_code,
                order.user_id || null,
                orderAmount
            );
            if (!validation.valid) {
                return res.status(400).json({ok: false, error: validation.message});
            }
            await Order.applyPromotion(id, {
                id: validation.promotion.id,
                code: validation.promotion.code,
                discount_amount: validation.discountAmount,
            });
        }

        await Order.checkoutOrder(id);
        await Order.recalculateTotals(id);

        res.json({ok: true, message: "Checkout thành công"});
    } catch (err) {
        next(err);
    }
}

/** Process payment for order */
export async function pay(req, res, next) {
    try {
        const id = +req.params.id;
        const {method} = req.body;

        const order = await Order.getOrderById(id);
        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});
        ensureCanActOnOrder(order, req);

        if (!method)
            return res
                .status(400)
                .json({ok: false, error: "Thiếu phương thức thanh toán"});

        const allowed = ["cod", "card"]; // Must match DB ENUM
        if (!allowed.includes(method))
            return res
                .status(400)
                .json({ok: false, error: "Phương thức thanh toán không hợp lệ"});

        await Order.payOrder(id, method);
        res.json({ok: true, message: "Thanh toán thành công"});
    } catch (err) {
        next(err);
    }
}

/** Update order status (admin/staff only) */
export async function updateStatus(req, res, next) {
    try {
        const id = +req.params.id;
        const {order_status} = req.body;

        if (!order_status)
            return res.status(400).json({ok: false, error: "Thiếu trạng thái mới"});
        try {
            await Order.updateStatus(id, order_status);
            res.json({ok: true, message: "Cập nhật trạng thái thành công"});
        } catch (e) {
            return res.status(400).json({ok: false, error: e.message || 'Không thể cập nhật trạng thái'});
        }
    } catch (err) {
        next(err);
    }
}

/** Get authenticated user's cart (create if not exists) */
export async function getMyCart(req, res, next) {
    try {
        if (!req.user)
            return res.status(401).json({ok: false, error: "Unauthorized"});
        const cart = await Order.findOrCreateCart(req.user.id);
        res.json({ok: true, data: cart});
    } catch (err) {
        next(err);
    }
}

/** Get authenticated user's order history */
export async function getMyOrders(req, res, next) {
    try {
        if (!req.user)
            return res.status(401).json({ok: false, error: "Unauthorized"});
        const orders = await Order.getOrdersByUserId(req.user.id);
        res.json({ok: true, data: orders});
    } catch (err) {
        next(err);
    }
}

/** Create order for guest (no login required) */
export async function createGuestOrder(req, res, next) {
    try {
        let {
            address_street,
            address_district,
            address_ward,
            address_city,
            items,
            payment_method,
            subtotal,
            shipping_fee,
            grand_total,
            promotion_code,
        } = req.body;

        const normalized = normalizeAddressFields({
            address_street,
            address_district,
            address_ward,
            address_city,
        });
        if (!normalized)
            return res
                .status(400)
                .json({ok: false, error: "Thiếu thông tin địa chỉ giao hàng"});

        if (!Array.isArray(items) || items.length === 0)
            return res
                .status(400)
                .json({ok: false, error: "Đơn hàng phải có ít nhất 1 sản phẩm"});

        const allowed = ["cod", "card"];
        if (!payment_method || !allowed.includes(payment_method))
            return res
                .status(400)
                .json({ok: false, error: "Phương thức thanh toán không hợp lệ"});

        // Validate item structure
        for (const it of items) {
            if (
                typeof it.product_id !== "number" ||
                typeof it.quantity !== "number" ||
                it.quantity <= 0
            ) {
                return res.status(400).json({ok: false, error: "Item không hợp lệ"});
            }
        }

        const totals = {
            subtotal: Number.isFinite(+subtotal) ? +subtotal : 0,
            shipping_fee: Number.isFinite(+shipping_fee) ? +shipping_fee : 0,
            grand_total: Number.isFinite(+grand_total) ? +grand_total : 0,
        };

        const order = await Order.createGuestOrder({
            ...normalized,
            ...totals,
            payment_method,
        });

        for (const item of items) {
            await Order.upsertItem(order.id, item.product_id, item.quantity);
        }

        // Initial totals after items
        await Order.recalculateTotals(order.id);

        // Apply promotion for guest if provided
        if (promotion_code) {
            try {
                const current = await Order.getOrderDetail(order.id);
                const orderAmount = (current.subtotal || 0) + (current.shipping_fee || 0);
                const validation = await promotionModel.validatePromotion(
                    promotion_code,
                    null,
                    orderAmount
                );
                if (!validation.valid) {
                    return res.status(400).json({ok: false, error: validation.message});
                }
                await Order.applyPromotion(order.id, {
                    id: validation.promotion.id,
                    code: validation.promotion.code,
                    discount_amount: validation.discountAmount,
                });
                await Order.recalculateTotals(order.id);
            } catch (e) {
                return res.status(400).json({ok: false, error: e.message || 'Không thể áp dụng mã khuyến mãi'});
            }
        }

        await Order.checkoutOrder(order.id);
        await Order.payOrder(order.id, payment_method);

        res.status(201).json({
            ok: true,
            message: "Đơn hàng guest được tạo thành công",
            data: order,
        });
    } catch (err) {
        next(err);
    }
}

/** Track order by order code (public API, no auth required) */
export async function trackByCode(req, res, next) {
    try {
        const {code} = req.params;
        if (!code)
            return res.status(400).json({ok: false, error: "Thiếu mã đơn hàng"});

        const order = await Order.getOrderByCode(code);
        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng với mã này"});

        res.json({ok: true, data: order});
    } catch (err) {
        next(err);
    }
}

// ============ ADMIN ENDPOINTS ============

/**
 * [ADMIN/STAFF] Get all orders with filters and pagination
 * Query params: status, search (email/username), page, limit
 */
export async function listAllOrdersForAdmin(req, res, next) {
    try {
        const {
            status,
            search,
            page = 1,
            limit = 20,
            date_from,
            date_to,
            sort_by,
            sort_dir,
        } = req.query;

        // Build WHERE conditions
        const conditions = [];
        const params = {};

        if (status) {
            conditions.push("o.order_status = :status");
            params.status = status;
        }

        if (search) {
            conditions.push(
                "(u.email LIKE :search OR u.username LIKE :search OR o.order_code LIKE :search)"
            );
            params.search = `%${search}%`;
        }

        if (date_from) {
            conditions.push("o.created_at >= :date_from");
            params.date_from = date_from;
        }

        if (date_to) {
            conditions.push("o.created_at <= :date_to");
            params.date_to = date_to;
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        // Count total
        const countQuery = `SELECT COUNT(*) as total
                            FROM orders o
                                     LEFT JOIN users u ON o.user_id = u.id
                                ${whereClause}`;

        const [countRows] = conditions.length > 0
            ? await pool.execute(countQuery, params)
            : await pool.query(countQuery);
        const total = countRows[0].total;

        // Sorting whitelist for orders
        const allowedSort = {
            id: 'o.id',
            order_code: 'o.order_code',
            order_status: 'o.order_status',
            payment_status: 'o.payment_status',
            grand_total: 'o.grand_total',
            created_at: 'o.created_at'
        };
        const column = allowedSort[String(sort_by)] || 'o.created_at';
        const direction = String(sort_dir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get orders with user info
        const offset = (page - 1) * limit;

        let dataQuery;
        let orders;

        if (conditions.length > 0) {
            // Use named parameters when we have WHERE conditions
            dataQuery = `SELECT o.id,
                                o.order_code,
                                o.user_id,
                                u.username,
                                u.email,
                                o.order_status,
                                o.payment_status,
                                o.payment_method,
                                o.grand_total,
                                o.created_at,
                                o.updated_at
                         FROM orders o
                                  LEFT JOIN users u ON o.user_id = u.id
                             ${whereClause}
                         ORDER BY ${column} ${direction}
                             LIMIT ${parseInt(limit)}
                         OFFSET ${parseInt(offset)}`;
            [orders] = await pool.execute(dataQuery, params);
        } else {
            // No WHERE conditions - use pool.query()
            dataQuery = `SELECT o.id,
                                o.order_code,
                                o.user_id,
                                u.username,
                                u.email,
                                o.order_status,
                                o.payment_status,
                                o.payment_method,
                                o.grand_total,
                                o.created_at,
                                o.updated_at
                         FROM orders o
                                  LEFT JOIN users u ON o.user_id = u.id
                         ORDER BY ${column} ${direction}
       LIMIT ${parseInt(limit)}
                         OFFSET ${parseInt(offset)}`;
            [orders] = await pool.query(dataQuery);
        }

        res.json({
            ok: true,
            data: {
                orders,
                pagination: {
                    page: +page,
                    limit: +limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * [ADMIN/STAFF] Get order detail by ID (không cần check ownership)
 */
export async function getOrderDetailForAdmin(req, res, next) {
    try {
        const id = +req.params.id;
        const order = await Order.getOrderDetail(id);

        if (!order)
            return res
                .status(404)
                .json({ok: false, error: "Không tìm thấy đơn hàng"});

        // Get user info if order has user_id
        if (order.user_id) {
            const [users] = await pool.execute(
                "SELECT id, username, email, phone FROM users WHERE id = :user_id",
                {user_id: order.user_id}
            );
            order.user = users.length ? users[0] : null;
        }

        res.json({ok: true, data: order});
    } catch (err) {
        next(err);
    }
}
