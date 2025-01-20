import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/cart.css";
import axiosInstance from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../components/Footer";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // Remove Item From Cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Cart Quantity Handlers
  const handleIncrement = (productId) => {
    const updatedCart = cart.map((product) => {
      if (product.id === productId) {
        product.quantity += 1;
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const handleDecrement = (productId) => {
    const updatedCart = cart.map((product) => {
      if (product.id === productId && product.quantity > 1) {
        product.quantity -= 1;
      }
      return product;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate the total price of all products in the cart
  const totalPrice = cart.reduce((total, product) => {
    return total + product.sales_price * product.quantity;
  }, 0);

  // Place Order Handler
  const handlePlaceOrder = async () => {
    try {
      const product_ids = cart.map((product) => product.id);
      const quantities = cart.map((product) => product.quantity);
      const total_price = cart.reduce(
        (total, product) => total + product.sales_price * product.quantity,
        0
      );
      console.log({
        product_ids,
        quantities,
        total_price,
      });

      const response = await axiosInstance.post("/orders/place", {
        product_ids,
        quantities,
        total_price,
      });

      if (response.status === 201) {
        // Clear the cart locally after order placement
        localStorage.removeItem("cart");
        setCart([]);
      }

      toast("Order Placed Successfully");
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  return (
    <>
      <Navbar />
      <h1>Your Cart</h1>
      <div className="cart-container">
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={product.images || "/placeholder-image.png"}
                    alt={product.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="name">{product.name}</h3>
                  <p className="price">
                    Price: ₹
                    {(product.sales_price * product.quantity).toFixed(2)}
                  </p>
                  <div className="quantity-control ">
                    <button
                      className="quantity-btn1"
                      onClick={() => handleDecrement(product.id)}
                    >
                      -
                    </button>
                    <span className="quant">{product.quantity}</span>
                    <button
                      className="quantity-btn1"
                      onClick={() => handleIncrement(product.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p className="sumPrice">Total Price: ₹{totalPrice.toFixed(2)}</p>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default CartPage;
