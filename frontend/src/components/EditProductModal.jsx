import React from "react";
import ImageUpload from "./ImageUpload";

const EditProductModal = ({
  showEditModal,
  editProduct,
  setEditProduct,
  handleUpdateProduct,
  categories,
  isUploading,
  handleEditImageUpload,
  removeEditImage,
}) => {
  return (
    editProduct &&
    showEditModal && (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="text-xl font-semibold mb-4 modalTitle">
              Edit Product
            </h2>
            <button
              onClick={() => setEditProduct(false)}
              className="Cancel-btn modalTitle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x cancel-svg"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleUpdateProduct} className="modal-form">
            {/* Product Name */}
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Product Name"
            />
            {/* WS Code */}
            <input
              type="number"
              value={editProduct.ws_code}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  ws_code: e.target.value,
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="WS Code"
            />
            {/* Price */}
            <input
              type="number"
              value={editProduct.sales_price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  sales_price: e.target.value,
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Price"
            />
            {/* MRP */}
            <input
              type="number"
              value={editProduct.mrp}
              onChange={(e) =>
                setEditProduct({ ...editProduct, mrp: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="MRP"
            />
            {/* pakage size */}
            <input
              type="number"
              value={editProduct.package_size}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  package_size: e.target.value,
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="MRP"
            />
            {/* Stock Quantity */}
            <input
              type="number"
              value={editProduct.stock_quantity}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  stock_quantity: e.target.value,
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Available Stock"
            />
            {/* Tags */}
            <input
              type="text"
              value={(editProduct.tags || []).join(", ")}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  tags: e.target.value.split(", "),
                })
              }
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
              placeholder="Tags (comma separated)"
            />

            <ImageUpload
              isUploading={isUploading}
              handleImageUpload={handleEditImageUpload}
              images={editProduct.images}
              removeImage={removeEditImage}
            />
            <select
              value={editProduct.category_id}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category_id: parseInt(e.target.value), // Parse the value to integer
                })
              }
              className="categories"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    )
  );
};
export default EditProductModal;
