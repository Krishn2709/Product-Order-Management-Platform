const db = require("../config/db");

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

const addProduct = async (productDetails) => {
  const {
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    tags,
    category,
    is_active,
  } = productDetails;

  const query = `
      INSERT INTO products (name, ws_code, sales_price, mrp, package_size, tags, categories, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
  const values = [
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    tags,
    category,
    is_active,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const editProduct = async (id, productDetails) => {
  const {
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    tags,
    categories,
    is_active,
  } = productDetails;

  const query = `
      UPDATE products
      SET name = $1, ws_code = $2, sales_price = $3, mrp = $4,
          package_size = $5, tags = $6, categories = $7, is_active = $8
      WHERE id = $9
      RETURNING *;
    `;
  const values = [
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    tags,
    categories,
    is_active,
    id,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteProduct = async (id) => {
  const query = "UPDATE products SET is_deleted = TRUE WHERE id = $1";
  await db.query(query, [id]);
};

const restoreDeletedProduct = async (id) => {
  const query = "UPDATE products SET is_deleted = FALSE WHERE id = $1";
  await db.query(query, [id]);
};

const getAllProducts = async () => {
  const query =
    "SELECT * FROM products WHERE is_deleted = FALSE AND is_active = TRUE";
  const result = await db.query(query);
  return result.rows;
};

const getAllProductsForAdmin = async () => {
  const query = "SELECT * FROM products";
  const result = await db.query(query);
  return result.rows;
};

const addCategoryToProduct = async (productId, categoryId) => {
  const query = `
      INSERT INTO product_categories (product_id, category_id)
      VALUES ($1, $2);
    `;
  await db.query(query, [productId, categoryId]);
};

module.exports = {
  createProductTable,
  addProduct,
  editProduct,
  deleteProduct,
  restoreDeletedProduct,
  getAllProducts,
  addCategoryToProduct,
  getAllProductsForAdmin,
};
