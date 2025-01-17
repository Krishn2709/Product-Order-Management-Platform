import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/customerProductPage.css";
import { Search } from "lucide-react";

const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      console.log("Fetched products:", response.data); // Debug log
      setProducts(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantities[product.id] || 1;
    } else {
      product.quantity = quantities[product.id] || 1;
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error fetching categories"
      );
    }
  };

  const getFilteredProducts = () => {
    let filteredProducts = products;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const wsCodeMatch = product.ws_code.toString().includes(searchLower);
        return nameMatch || wsCodeMatch;
      });
    }

    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id === parseInt(categoryFilter)
      );
    }

    return filteredProducts;
  };

  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[productId] || 1) - 1;
      return {
        ...prevQuantities,
        [productId]: newQuantity > 0 ? newQuantity : 0,
      };
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Debug log for filtered products
  const filteredProducts = getFilteredProducts();
  console.log("Filtered products:", filteredProducts);

  return (
    <>
      <Navbar />
      <div className="customer-product-page">
        <div className=" searchFilter2 ">
          <input
            type="text"
            placeholder="Search by name or WS code"
            className="search-bar1"
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update search state
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="categoryfilter"
            style={{
              marginLeft: "8px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={
                      "https://picsum.photos/200/300?grayscale" ||
                      "/placeholder-image.png"
                    }
                    alt={product.name}
                  />
                </div>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-code">WS Code: {product.ws_code}</p>
                <p className="product-price">
                  Price: ₹{product.sales_price * (quantities[product.id] || 1)}
                </p>
                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(product.id)}
                  >
                    -
                  </button>
                  <span className="quantity-value">
                    {quantities[product.id] || 0}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(product.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="no-products-message">No products match your search</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerProductPage;
