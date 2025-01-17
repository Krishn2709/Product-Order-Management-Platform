const orderModel = require("../models/orderModel");

// Place an order
const placeOrder = async (req, res) => {
  const { product_ids, quantities, total_price } = req.body;
  const user_id = req.user.id;

  if (!product_ids || !quantities || !total_price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Insert order into orders table
    const order = await orderModel.placeOrder(
      user_id,
      product_ids,
      total_price,
      quantities
    );

    // Insert order details into order_items
    for (let i = 0; i < product_ids.length; i++) {
      await orderModel.addOrderItem(order.id, product_ids[i], quantities[i]);
    }

    // Clear the user's cart
    await orderModel.clearCart(user_id);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders (Admin/Customer)
const getOrders = async (req, res) => {
  const { role } = req.user;
  const user_id = req.user.id;

  try {
    const orders = await orderModel.getOrders(role, user_id);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  const { role } = req.user;

  try {
    const orders = await orderModel.getAllOrders(role);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatusController = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  // Validate the input
  const validStatuses = ["Pending", "Dispatched", "Delivered", "Canceled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    // Update the order status
    const updatedOrder = await orderModel.updateOrderStatus(order_id, status);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  updateOrderStatusController,
  getAllOrders,
};
