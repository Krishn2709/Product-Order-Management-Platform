const db = require('../config/db');

// Create the product table if it doesn't exist
const createProductTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        ws_code INTEGER NOT NULL CHECK (ws_code >= 0),
        sales_price NUMERIC(10, 2) NOT NULL CHECK (sales_price > 0),
        mrp NUMERIC(10, 2) NOT NULL CHECK (mrp > 0),
        package_size NUMERIC(10, 2) NOT NULL CHECK (package_size > 0),
        images TEXT[], -- Array of image URLs
        tags TEXT[], -- Array of tags
        categories TEXT[], -- Array of categories
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await db.query(query);
};

const addnewProduct = async ({ name, ws_code, price, mrp, package_size, tags, category, is_active }) => {
    const query = `
        INSERT INTO products (name, ws_code, sales_price, mrp, package_size, tags, categories, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [name, ws_code, price, mrp, package_size, tags, category, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
};

const getallProducts = async ({ search = null, category = null, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM products
        WHERE is_active = TRUE
        AND ($1::TEXT IS NULL OR name ILIKE '%' || $1 || '%')
        AND ($2::TEXT IS NULL OR categories @> ARRAY[$2]::TEXT[])
        LIMIT $3 OFFSET $4;
    `;
    const values = [search, category, limit, offset];
    const result = await db.query(query, values);
    return result.rows;
};

const updateselectedProduct = async (id, { product_name, ws_code, price, mrp, package_size, tags, category, is_active }) => {
    const query = `
        UPDATE products
        SET product_name = $1, ws_code = $2, price = $3, mrp = $4,
            package_size = $5, tags = $6, category = $7, is_active = $8
        WHERE id = $9
        RETURNING *;
    `;
    const values = [product_name, ws_code, price, mrp, package_size, tags, category, is_active, id];
    const result = await db.query(query, values);
    return result.rows[0];
};

const deleteselectedProduct = async (id) => {
    const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const deactivateselectedProduct = async (id) => {
    const query = `
        UPDATE products
        SET is_active = FALSE
        WHERE id = $1
        RETURNING *;
    `;
    const result = await db.query(query, [id]);

    // If no product is found, return null
    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0]; // Return the deactivated product
};

module.exports = {
    createProductTable,
    addnewProduct,
    getallProducts,
    updateselectedProduct,
    deleteselectedProduct,
    deactivateselectedProduct
};
