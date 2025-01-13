const db = require('../config/db');

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
const placeOrder = async (user_id, total_price) => {
    const query = `
        INSERT INTO orders (user_id, status, total_price)
        VALUES ($1, 'Pending', $2)
        RETURNING *;
    `;
    const result = await db.query(query, [user_id, total_price]);
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
    const query = 'DELETE FROM cart WHERE user_id = $1';
    await db.query(query, [user_id]);
};

// Get orders for Admin/Customer
const getOrders = async (role, user_id) => {
    let query;
    if (role === 'admin') {
        query = 'SELECT * FROM orders';
    } else {
        query = 'SELECT * FROM orders WHERE user_id = $1';
    }
    const result = await db.query(query, [user_id]);
    return result.rows;
};

module.exports = { 
    createOrdersTable, 
    createOrderDetailsTable, 
    placeOrder, 
    addOrderItem, 
    clearCart, 
    getOrders 
};
