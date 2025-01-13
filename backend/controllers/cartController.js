const cartModel = require('../models/cartModel');

// Add item to cart
const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    try {
        const product = await cartModel.getProductById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await cartModel.addOrUpdateCartItem(user_id, product_id, quantity);
        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// Update item in cart
const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    try {
        const cartItem = await cartModel.getCartItem(user_id, itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartModel.updateCartQuantity(itemId, quantity);
        res.status(200).json({ message: 'Cart item updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
    const { itemId } = req.params;
    const user_id = req.user.id;

    try {
        await cartModel.deleteCartItem(user_id, itemId);
        res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing cart item', error: error.message });
    }
};

// Get cart items
const getCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        const cartItems = await cartModel.getCartItemsByUser(user_id);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
};

// Place order from cart
const placeOrder = async (req, res) => {
    const user_id = req.user.id;

    try {
        const cartItems = await cartModel.getCartItemsByUser(user_id);
        if (!cartItems.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderId = await cartModel.createOrder(user_id, 'Pending');
        const orderDetailsPromises = cartItems.map((item) =>
            cartModel.addOrderDetails(orderId, item.product_id, item.quantity)
        );
        await Promise.all(orderDetailsPromises);

        await cartModel.clearCartByUser(user_id);
        res.status(200).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
};

module.exports = { addToCart, updateCartItem, removeCartItem, getCart, placeOrder };
