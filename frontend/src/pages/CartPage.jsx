import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

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

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    // Redirect to order confirmation page or handle order submission
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={product.image || "/placeholder-image.png"}
                    alt={product.name}
                  />
                </div>
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p>
                    Price: ₹
                    {(product.sales_price * product.quantity).toFixed(2)}
                  </p>
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => handleDecrement(product.id)}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      className="quantity-btn"
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
            <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
