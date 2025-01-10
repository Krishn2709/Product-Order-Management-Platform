const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));  // Ensure this path is correct
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
