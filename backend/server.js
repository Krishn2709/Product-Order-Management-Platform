const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const { createUserTable } = require("./models/userModel");
const { createProductTable } = require("./models/productModel");
const { createCartTable } = require("./models/cartModel");
const {
  createOrdersTable,
  createOrderDetailsTable,
} = require("./models/orderModel");
const { createCategoryTable } = require("./models/categoryModel");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Initializing tables
(async () => {
  try {
    await createUserTable();
    await createProductTable();
    await createCartTable();
    await createOrdersTable();
    await createOrderDetailsTable();
    await createCategoryTable();
    console.log("Tables initialized successfully.");
  } catch (err) {
    console.error("Error initializing tables:", err);
  }
})();

// Routes
app.use("/api/auth", require("./routes/authRoute")); // Ensure this path is correct
app.use("/api/products", require("./routes/productsRoute"));
app.use("/api/orders", require("./routes/ordersRoute"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/categories", require("./routes/categoryRoute"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));