const orderModel = require('../models/orderModel');

// Place an order
const placeOrder = async (req, res) => {
    const { product_ids, quantities, total_price } = req.body;
    const user_id = req.user.id;

    if (!product_ids || !quantities || !total_price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Insert order into orders table
        const order = await orderModel.placeOrder(user_id, total_price);

        // Insert order details into order_items
        for (let i = 0; i < product_ids.length; i++) {
            await orderModel.addOrderItem(order.id, product_ids[i], quantities[i]);
        }

        // Clear the user's cart
        await orderModel.clearCart(user_id);

        res.status(201).json({ message: 'Order placed successfully', order });
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

module.exports = { placeOrder, getOrders };
