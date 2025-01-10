const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Add a new product (Admin only)
router.post("/add", async (req, res) => {
  const { name, ws_code, sales_price, mrp, package_size, images, tags, categories } = req.body;

  if (!name || !ws_code || !sales_price || !mrp || !package_size || !images || !tags || !categories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, ws_code, sales_price, mrp, package_size, images, tags, categories) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, ws_code, sales_price, mrp, package_size, images, tags, categories]
    );

    res.status(201).json({ message: "Product added successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit an existing product (Admin only)
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, ws_code, sales_price, mrp, package_size, images, tags, categories } = req.body;

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, ws_code = $2, sales_price = $3, mrp = $4, package_size = $5, images = $6, tags = $7, categories = $8 WHERE id = $9 RETURNING *",
      [name, ws_code, sales_price, mrp, package_size, images, tags, categories, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a product (Admin only)
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Deactivate a product (Admin only)
router.patch("/deactivate/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE products SET is_active = FALSE WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deactivated successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
