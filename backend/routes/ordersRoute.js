const express = require("express");
const router = express.Router();
const { placeOrder, getOrders } = require("../controllers/orderController");

// Place a new order (Customer)
router.post("/place", placeOrder);

// View orders (Customer/ Admin)
router.get("/my-orders", getOrders);

module.exports = router;
