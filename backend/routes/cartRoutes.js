const express = require("express");
const {
  authenticateUser,
  authorizeCustomer,
} = require("../middleware/authenticate");
const {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  placeOrder,
} = require("../controllers/cartController");

const router = express.Router();

// Cart routes (Customer)
router.post("/", authenticateUser, authorizeCustomer, addToCart); // Add item to cart
router.put("/:itemId", authenticateUser, authorizeCustomer, updateCartItem); // Update item in cart
router.delete("/:itemId", authenticateUser, authorizeCustomer, removeCartItem); // Remove item from cart
router.get("/", authenticateUser, authorizeCustomer, getCart); // Get cart items
router.post("/place-order", authenticateUser, authorizeCustomer, placeOrder); // Place order from cart

module.exports = router;
