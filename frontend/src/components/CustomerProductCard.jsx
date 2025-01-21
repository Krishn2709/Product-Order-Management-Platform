import React from "react";
import { toast } from "react-toastify";

const CustomerProductCard = React.memo(
  ({ product, quantities, handleQuantityChange, handleAddToCart }) => (
    <div className="product-card" role="article">
      {product.stock_quantity <= 3 && (
        <div
          className="low-quantity-tag"
          role="status"
          aria-label="Low stock warning"
        >
          Low Quantity
        </div>
      )}
      <div className="product-image">
        <img
          src={product.images}
          alt={product.name}
          loading="lazy"
          width="200"
          height="200"
        />
      </div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-code">WS Code: {product.ws_code}</p>
      <p className="product-code" aria-label="Original price">
        MRP: <del>₹{product.mrp}</del>
      </p>
      <p className="product-price" aria-label="Current price">
        Price: ₹{product.sales_price * (quantities[product.id] || 1)}
      </p>

      <div
        className="quantity-container"
        role="group"
        aria-label="Quantity selector"
      >
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(product.id, "decrement")}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="quantity-value" aria-label="Current quantity">
          {quantities[product.id] || 0}
        </span>
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(product.id, "increment")}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        className="add-to-cart-btn"
        onClick={() => handleAddToCart(product)}
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  )
);

export default CustomerProductCard;
