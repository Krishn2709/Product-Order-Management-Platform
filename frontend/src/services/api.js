import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend's URL

// Get all products
export const getProducts = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/products`, { params });
  return response.data;
};

// Add a product
export const addProduct = async (product) => {
  const response = await axios.post(`${API_BASE_URL}/products/add`, product);
  return response.data;
};

// More API methods like editProduct, deleteProduct, placeOrder, etc.
