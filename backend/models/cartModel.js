const db = require('../config/db');

// Create the cart table if it doesn't exist
const createCartTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cart (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            product_id INT REFERENCES products(id),
            quantity INT NOT NULL CHECK(quantity > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_cart_item UNIQUE (customer_id, product_id)
        );
    `;
    await db.query(query);
};

const getProductById = async (productId) => {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await db.query(query, [productId]);
    return result.rows[0];
};

// Add or update cart item
const addOrUpdateCartItem = async (userId, productId, quantity) => {
    const query = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3
    `;
    await db.query(query, [userId, productId, quantity]);
};

// Get cart item
const getCartItem = async (userId, productId) => {
    const query = 'SELECT * FROM cart WHERE product_id = $1 AND user_id = $2';
    const result = await db.query(query, [productId, userId]);
    return result.rows[0];
};

// Update cart item quantity
const updateCartQuantity = async (productId, quantity) => {
    const query = 'UPDATE cart SET quantity = $1 WHERE product_id = $2';
    await db.query(query, [quantity, productId]);
};

// Remove cart item
const deleteCartItem = async (userId, productId) => {
    const query = 'DELETE FROM cart WHERE product_id = $1 AND user_id = $2';
    await db.query(query, [productId, userId]);
};

// Get all cart items for a user
const getCartItemsByUser = async (userId) => {
    const query = `
        SELECT c.id AS cart_item_id, p.*, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// Create a new order
const createOrder = async (userId, status) => {
    const query = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id';
    const result = await db.query(query, [userId, status]);
    return result.rows[0].id;
};

// Add order details
const addOrderDetails = async (orderId, productId, quantity) => {
    const query = 'INSERT INTO order_details (order_id, product_id, quantity) VALUES ($1, $2, $3)';
    await db.query(query, [orderId, productId, quantity]);
};

// Clear cart for a user
const clearCartByUser = async (userId) => {
    const query = 'DELETE FROM cart WHERE user_id = $1';
    await db.query(query, [userId]);
};

module.exports = {
    createCartTable,
    getProductById,
    addOrUpdateCartItem,
    getCartItem,
    updateCartQuantity,
    deleteCartItem,
    getCartItemsByUser,
    createOrder,
    addOrderDetails,
    clearCartByUser,
};