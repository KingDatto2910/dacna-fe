import { pool } from "../db.js";

/** Get current user's profile (requires auth) */
export async function getUserProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const [rows] = await pool.execute(
      `SELECT id, username, email, phone, roles, verified, 
              full_name, address_street, address_district, address_ward, address_city, avatar_url,
              created_at, updated_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    return res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/** Update current user's profile (requires auth) */
export async function updateUserProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
      return res.status(400).json({ error: "No fields to update" });
    }

    params.push(userId);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await pool.execute(query, params);

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update user profile error:", error);
    // Handle unique constraint violations
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Username or phone already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
