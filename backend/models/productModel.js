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
            category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            is_active BOOLEAN DEFAULT TRUE,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
  await db.query(query);
};

// Add a new product
// Add a new product with stock
const addProduct = async (
  name,
  ws_code,
  sales_price,
  mrp,
  package_size,
  images,
  tags,
  category_id,
  stock_quantity, // Add stock quantity parameter
  is_active = true
) => {
  const query = `
      INSERT INTO products (name, ws_code, sales_price, mrp, package_size, images, tags, category_id, stock_quantity, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
  `;
  const values = [
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    images, // Pass the array directly
    tags, // Pass the array directly
    category_id,
    stock_quantity, // Pass the stock quantity
    is_active,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Edit an existing product and update stock if necessary
const editProduct = async (id, productDetails) => {
  const {
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    images,
    tags,
    category_id,
    stock_quantity, // Add stock quantity to product details
    is_active,
  } = productDetails;

  const query = `
      UPDATE products
        SET
            name = COALESCE($1, name),
            ws_code = COALESCE($2, ws_code),
            sales_price = COALESCE($3, sales_price),
            mrp = COALESCE($4, mrp),
            package_size = COALESCE($5, package_size),
            images = COALESCE($6, images),
            tags = COALESCE($7, tags),
            category_id = COALESCE($8, category_id),
            stock_quantity = COALESCE($9, stock_quantity), -- Update stock quantity
            is_active = COALESCE($10, is_active)
        WHERE id = $11
        RETURNING *;
    `;
  const values = [
    name,
    ws_code,
    sales_price,
    mrp,
    package_size,
    images,
    tags,
    category_id,
    stock_quantity, // Pass the updated stock quantity
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
  const query = "SELECT * FROM products WHERE is_deleted = FALSE";
  const result = await db.query(query);
  return result.rows;
};

const addCategoryToProduct = async (productId, categoryId) => {
  const query = `
       UPDATE products
        SET category_id = $1
        WHERE id = $2
        RETURNING *;
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
