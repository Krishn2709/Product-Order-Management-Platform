import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProductPage from "./pages/AdminProductPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin-only route */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roles={["Admin"]}>
              {/* Admin Products Page */}
              <AdminProductPage />
            </ProtectedRoute>
          }
        />

        {/* Customer-only route */}
        <Route
          path="/customer/products"
          element={
            <ProtectedRoute roles={["Customer"]}>
              {/* Customer Products Page */}
            </ProtectedRoute>
          }
        />

        {/* Shared route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute>{/* Dashboard Page */}</ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
};

export default App;
