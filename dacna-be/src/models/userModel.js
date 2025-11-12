import { pool } from "../db.js";

/** Create new user with customer role */
export async function createUser({ username, email, pw, phone }) {
  const [result] = await pool.execute(
    `INSERT INTO Users (username, email, phone, pw, roles, created_at, updated_at)
     VALUES (:username, LOWER(:email), :phone, :pw, 'customer', NOW(), NOW())`,
    { username, email, phone, pw }
  );
  return result.insertId;
}

/** Find user by username or email (case-insensitive) */
export async function findUserByUsernameOrEmail(value) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE username = :value OR email = :value LIMIT 1",
    { value }
  );
  return rows.length ? rows[0] : null;
}
