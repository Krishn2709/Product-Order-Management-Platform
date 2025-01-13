const db = require('../config/db');

// Create the categories table if it doesn't exist
const createCategoryTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await db.query(query);
};

// Add a new category
const addCategory = async (name) => {
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    const result = await db.query(query, [name]);
    return result.rows[0];
};

// Get all categories
const getAllCategories = async () => {
    const query = 'SELECT * FROM categories';
    const result = await db.query(query);
    return result.rows;
};

module.exports = { createCategoryTable, addCategory, getAllCategories };
