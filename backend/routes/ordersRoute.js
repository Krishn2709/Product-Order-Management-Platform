const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrders,
  updateOrderStatusController,
  getAllOrders,
} = require("../controllers/orderController");
const {
  authenticateUser,
  authorizeCustomer,
  authorizeAdmin,
} = require("../middleware/authenticate");

// Place a new order (Customer)
router.post("/place", authenticateUser, authorizeCustomer, placeOrder);

// View orders (Customer/ Admin)
router.get("/my-orders", authenticateUser, authorizeCustomer, getOrders);

router.get("/allorders", authenticateUser, authorizeAdmin, getAllOrders);

router.put(
  "/:order_id/status",
  authenticateUser,
  authorizeAdmin,
  updateOrderStatusController
);

module.exports = router;
