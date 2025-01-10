const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Place a new order (Customer)
router.post("/place", async (req, res) => {
  const { user_id, product_ids, quantities, total_price } = req.body;

  if (!user_id || !product_ids || !quantities || !total_price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, product_ids, quantities, total_price) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, product_ids, quantities, total_price]
    );

    res.status(201).json({ message: "Order placed successfully", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// View orders (Customer)
router.get("/my-orders/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) return res.status(404).json({ message: "No orders found" });

    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// View all orders (Admin)
router.get("/all-orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");

    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Confirm order (Admin)
router.patch("/confirm/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE orders SET status = 'Confirmed' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order confirmed successfully", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (Admin)
router.patch("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
