import {pool} from "../db.js";

/** Get current user's profile (requires auth) */
export async function getUserProfile(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({error: "Unauthorized"});

        const [rows] = await pool.execute(
            `SELECT id, username, email, phone, roles, verified, 
              full_name, address_street, address_district, address_ward, address_city, avatar_url,
              created_at, updated_at
       FROM users WHERE id = ?`,
            [userId]
        );

        if (rows.length === 0)
            return res.status(404).json({error: "User not found"});

        const user = rows[0];
        return res.json(user);
    } catch (error) {
        console.error("Get user profile error:", error);
        return res.status(500).json({error: "Internal server error"});
    }
}

/** Update current user's profile (requires auth) */
export async function updateUserProfile(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({error: "Unauthorized"});

        const {
            username,
            phone,
            full_name,
            address_street,
            address_district,
            address_ward,
            address_city,
            avatar_url,
        } = req.body;

        // Build dynamic UPDATE query for provided fields only
        const updates = [];
        const params = [];

        if (username !== undefined) {
            updates.push("username = ?");
            params.push(username);
        }
        if (phone !== undefined) {
            updates.push("phone = ?");
            params.push(phone || null);
        }
        if (full_name !== undefined) {
            updates.push("full_name = ?");
            params.push(full_name || null);
        }
        if (address_street !== undefined) {
            updates.push("address_street = ?");
            params.push(address_street || null);
        }
        if (address_district !== undefined) {
            updates.push("address_district = ?");
            params.push(address_district || null);
        }
        if (address_ward !== undefined) {
            updates.push("address_ward = ?");
            params.push(address_ward || null);
        }
        if (address_city !== undefined) {
            updates.push("address_city = ?");
            params.push(address_city || null);
        }
        if (avatar_url !== undefined) {
            updates.push("avatar_url = ?");
            params.push(avatar_url || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({error: "No fields to update"});
        }

        params.push(userId);

        const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
        await pool.execute(query, params);

        return res.json({message: "Profile updated successfully"});
    } catch (error) {
        console.error("Update user profile error:", error);
        // Handle unique constraint violations
        if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(400)
                .json({error: "Username or phone already exists"});
        }
        return res.status(500).json({error: "Internal server error"});
    }
}

/* ========== ADMIN FUNCTIONS ========== */

/**
 * [POST] /api/users/admin
 * Create a new user (admin only)
 */
export async function createUser(req, res, next) {
    try {
        const {username, email, password, roles = "customer", verified = true, phone, full_name} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ok: false, message: "Missing required fields: username, email, password"});
        }

        const bcrypt = (await import("bcrypt")).default;
        const hashed = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            `INSERT INTO users (username, email, pw, roles, verified, auth_provider, phone, full_name)
       VALUES (:username, :email, :pw, :roles, :verified, 'local', :phone, :full_name)`,
            {
                username,
                email,
                pw: hashed,
                roles,
                verified: verified ? 1 : 0,
                phone: phone || null,
                full_name: full_name || null
            }
        );

        res.status(201).json({ok: true, message: "User created successfully", data: {userId: result.insertId}});
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ok: false, message: "Email or phone already exists"});
        }
        next(err);
    }
}

/**
 * [GET] /api/users/admin
 * List all users with filters and pagination (admin only)
 */
export async function listAllUsers(req, res, next) {
    try {
        const {role, search, page = 1, limit = 20, verified, sort_by, sort_dir} = req.query;

        const whereClauses = [];
        const params = {};

        if (role) {
            whereClauses.push("roles = :role");
            params.role = role;
        }

        if (verified !== undefined) {
            whereClauses.push("verified = :verified");
            params.verified = verified === "true" ? 1 : 0;
        }

        if (search) {
            whereClauses.push(
                "(username LIKE :search OR email LIKE :search OR full_name LIKE :search)"
            );
            params.search = `%${search}%`;
        }

        let whereSQL = "";
        if (whereClauses.length > 0) {
            whereSQL = "WHERE " + whereClauses.join(" AND ");
        }

        // Get total count
        const countSQL = `SELECT COUNT(*) as total FROM users ${whereSQL}`;
        const [countRows] = whereClauses.length > 0
            ? await pool.execute(countSQL, params)
            : await pool.query(countSQL);
        const total = countRows[0].total;

        // Sorting whitelist
        const allowedSort = {
            id: 'id',
            username: 'username',
            email: 'email',
            roles: 'roles',
            verified: 'verified',
            created_at: 'created_at'
        };
        const column = allowedSort[String(sort_by)] || 'created_at';
        const direction = String(sort_dir).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get paginated results
        const offset = (page - 1) * limit;
        let rows;
        if (whereClauses.length > 0) {
            const dataSQL = `
        SELECT id, username, email, phone, roles, verified, full_name, 
               address_city, avatar_url, created_at, updated_at
        FROM users
        ${whereSQL}
        ORDER BY ${column} ${direction}
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;
            [rows] = await pool.execute(dataSQL, params);
        } else {
            const dataSQL = `
        SELECT id, username, email, phone, roles, verified, full_name, 
               address_city, avatar_url, created_at, updated_at
        FROM users
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
 * [GET] /api/users/admin/:id
 * Get user details by ID (admin only)
 */
export async function getUserById(req, res, next) {
    try {
        const {id} = req.params;

        const [rows] = await pool.execute(
            `SELECT id, username, email, phone, roles, verified, 
              full_name, address_street, address_district, address_ward, address_city, 
              avatar_url, created_at, updated_at
       FROM users WHERE id = :id`,
            {id}
        );

        if (rows.length === 0) {
            return res.status(404).json({ok: false, message: "User not found"});
        }

        res.json({ok: true, data: rows[0]});
    } catch (err) {
        next(err);
    }
}

/**
 * [PATCH] /api/users/admin/:id
 * Update user (admin only) - can change role, verified status
 */
export async function updateUser(req, res, next) {
    try {
        const {id} = req.params;
        const {roles, verified, username, email, phone, full_name} = req.body;

        // Check if user exists
        const [rows] = await pool.execute(`SELECT id FROM users WHERE id = :id`, {
            id,
        });
        if (rows.length === 0) {
            return res.status(404).json({ok: false, message: "User not found"});
        }

        // Build dynamic update
        const updates = [];
        const params = {id};

        if (roles !== undefined) {
            updates.push("roles = :roles");
            params.roles = roles;
        }
        if (verified !== undefined) {
            updates.push("verified = :verified");
            params.verified = verified ? 1 : 0;
        }
        if (username !== undefined) {
            updates.push("username = :username");
            params.username = username;
        }
        if (email !== undefined) {
            updates.push("email = :email");
            params.email = email;
        }
        if (phone !== undefined) {
            updates.push("phone = :phone");
            params.phone = phone;
        }
        if (full_name !== undefined) {
            updates.push("full_name = :full_name");
            params.full_name = full_name;
        }

        if (updates.length > 0) {
            await pool.execute(
                `UPDATE users SET ${updates.join(", ")} WHERE id = :id`,
                params
            );
        }

        res.json({ok: true, message: "User updated successfully"});
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res
                .status(400)
                .json({ok: false, message: "Username or email already exists"});
        }
        next(err);
    }
}

/**
 * [DELETE] /api/users/admin/:id
 * Delete user (admin only)
 */
export async function deleteUser(req, res, next) {
    try {
        const {id} = req.params;

        // Check if user exists
        const [rows] = await pool.execute(`SELECT id FROM users WHERE id = :id`, {
            id,
        });
        if (rows.length === 0) {
            return res.status(404).json({ok: false, message: "User not found"});
        }

        // Delete user (cascade will handle related data in most cases)
        await pool.execute(`DELETE FROM users WHERE id = :id`, {id});

        res.json({ok: true, message: "User deleted successfully"});
    } catch (err) {
        next(err);
    }
}
