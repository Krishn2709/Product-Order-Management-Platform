import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductCRUD from "./pages/ProductCRUD";
import Products from "./pages/Products";
import OrdersCustomer from "./pages/OrdersCustomer";
import OrdersAdmin from "./pages/OrdersAdmin";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/product-crud" element={<ProductCRUD />} />
      <Route path="/products" element={<Products />} />
      <Route path="/orders-customer" element={<OrdersCustomer />} />
      <Route path="/orders-admin" element={<OrdersAdmin />} />
    </Routes>
  );
};

export default App;
