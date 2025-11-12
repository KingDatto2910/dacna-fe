import * as categoryModel from "../models/categoryModel.js";

/** Get all categories with nested subcategories */
export async function listCategories(req, res, next) {
  try {
    const data = await categoryModel.getAll();
    res.json({ ok: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}

/** Get single category details by slug */
export async function getCategoryDetails(req, res, next) {
  try {
    const { slug } = req.params;
    const data = await categoryModel.getBySlug(slug);

    if (!data) {
      return res
        .status(404)
        .json({ ok: false, message: "Không tìm thấy danh mục" });
    }

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
