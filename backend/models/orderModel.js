const db = require("../config/db");

// Create the orders table if it doesn't exist
const createOrdersTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            product_ids INTEGER[] NOT NULL, -- Array of product IDs
            quantities INTEGER[] NOT NULL, -- Corresponding quantities for each product
            status VARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Delivered
            total_price NUMERIC(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  await db.query(query);
};

// Create the order details table if it doesn't exist
const createOrderDetailsTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS order_details (
            id SERIAL PRIMARY KEY,
            order_id INT REFERENCES orders(id),
            product_id INT REFERENCES products(id),
            quantity INT NOT NULL CHECK(quantity > 0)
        );
    `;
  await db.query(query);
};

// Place a new order
const placeOrder = async (user_id, product_ids, total_price, quantities) => {
  const query = `
    INSERT INTO orders (user_id, product_ids, status, total_price, quantities)
    VALUES ($1, $2, 'Pending', $3, $4)
    RETURNING *;
`;
  const result = await db.query(query, [
    user_id,
    product_ids,
    total_price,
    quantities,
  ]);
  return result.rows[0];
};

// Insert order item
const addOrderItem = async (order_id, product_id, quantity) => {
  const query = `
        INSERT INTO order_details (order_id, product_id, quantity)
        VALUES ($1, $2, $3);
    `;
  await db.query(query, [order_id, product_id, quantity]);
};

// Clear user's cart after order
const clearCart = async (user_id) => {
  const query = "DELETE FROM cart WHERE user_id = $1";
  await db.query(query, [user_id]);
};

// Get orders for Admin/Customer
const getOrders = async (role, user_id) => {
  let query;
  if (role === "admin") {
    query = "SELECT * FROM orders";
  } else {
    query = "SELECT * FROM orders WHERE user_id = $1";
  }
  const result = await db.query(query, [user_id]);
  return result.rows;
};

const getAllOrders = async (role) => {
  let query;
  query = "SELECT * FROM orders";

  const result = await db.query(query);
  return result.rows;
};

const updateOrderStatus = async (order_id, status) => {
  // First, get the order details (product IDs and quantities)
  const orderQuery = `
    SELECT product_ids, quantities
    FROM orders
    WHERE id = $1;
  `;
  const orderResult = await db.query(orderQuery, [order_id]);
  const order = orderResult.rows[0];

  if (order) {
    const { product_ids, quantities } = order;

    // If the status is "Dispatched", reduce the stock quantity for each product
    if (status === "Dispatched" || status === "Delivered") {
      // Loop through each product and update the stock quantity
      for (let i = 0; i < product_ids.length; i++) {
        const product_id = product_ids[i];
        const quantity = quantities[i];

        // Update the stock of the product by decreasing the quantity ordered
        const updateStockQuery = `
          UPDATE products
          SET stock_quantity = stock_quantity - $1
          WHERE id = $2 AND stock_quantity >= $1
          RETURNING *;
        `;
        const updateStockResult = await db.query(updateStockQuery, [
          quantity,
          product_id,
        ]);

        // If stock is not enough, return an error
        if (updateStockResult.rowCount === 0) {
          throw new Error(`Insufficient stock for product ID ${product_id}`);
        }
      }
    }

    // Update the order status
    const updateStatusQuery = `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await db.query(updateStatusQuery, [status, order_id]);
    return result.rows[0];
  }

  throw new Error("Order not found");
};

module.exports = {
  createOrdersTable,
  createOrderDetailsTable,
  placeOrder,
  addOrderItem,
  clearCart,
  getOrders,
  updateOrderStatus,
  getAllOrders,
};
