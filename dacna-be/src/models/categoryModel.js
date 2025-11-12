import { pool } from "../db.js";

/** Get all categories with nested subcategories */
export async function getAll() {
  const [categories] = await pool.execute(
    "SELECT id, name, slug, image_url FROM categories ORDER BY name ASC"
  );

  const [subCategories] = await pool.execute(
    "SELECT id, category_id, name, slug FROM sub_categories ORDER BY name ASC"
  );

  // Nest subcategories under their parent category
  return categories.map((cat) => ({
    ...cat,
    subCategories: subCategories.filter((sub) => sub.category_id === cat.id),
  }));
}

/** Get single category by slug with subcategories */
export async function getBySlug(slug) {
  const [rows] = await pool.execute(
    "SELECT id, name, slug, image_url FROM categories WHERE slug = :slug LIMIT 1",
    { slug }
  );

  if (rows.length === 0) return null;

  const category = rows[0];

  const [subCategories] = await pool.execute(
    "SELECT id, category_id, name, slug FROM sub_categories WHERE category_id = :categoryId ORDER BY name ASC",
    { categoryId: category.id }
  );

  return { ...category, subCategories };
}
