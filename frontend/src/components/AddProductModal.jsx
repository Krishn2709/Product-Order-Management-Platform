import React from "react";
import ImageUpload from "./ImageUpload";

const AddProductModal = ({
  showModal,
  setShowModal,
  newProduct,
  setNewProduct,
  handleAddProduct,
  categories,
  errors,
  setErrors,
  isUploading,
  handleImageUpload,
  removeImage,
}) => {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="text-xl font-semibold mb-4 modalTitle">
              Add New Product
            </h2>
            <button
              onClick={() => setShowModal(false)}
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

          <form onSubmit={handleAddProduct} className="modal-form">
            {/* Product Name */}
            <div>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="input-field11"
              />
            </div>

            {/* WS Code */}
            <div className="relative">
              <input
                type="number"
                placeholder="WS Code"
                value={newProduct.ws_code}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewProduct({ ...newProduct, ws_code: value });
                  setErrors((prev) => ({
                    ...prev,
                    ws_code:
                      value <= 0 ? "WS Code must be a positive number" : "",
                  }));
                }}
                className="input-field11"
              />
              {errors.ws_code && (
                <div className="tooltip">{errors.ws_code}</div>
              )}
            </div>

            {/* MRP */}
            <div className="relative">
              <input
                type="number"
                placeholder="MRP"
                value={newProduct.mrp}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewProduct({ ...newProduct, mrp: value });
                  setErrors((prev) => ({
                    ...prev,
                    mrp: value <= 0 ? "MRP must be a positive number" : "",
                  }));
                }}
                className="input-field11"
              />
              {errors.mrp && <div className="tooltip">{errors.mrp}</div>}
            </div>
            {/* Sales Price */}
            <div className="relative">
              <input
                type="number"
                placeholder="Sales Price"
                value={newProduct.sales_price}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewProduct({ ...newProduct, sales_price: value });
                  setErrors((prev) => ({
                    ...prev,
                    sales_price:
                      value <= 0
                        ? "Sales price must be positive"
                        : value >= newProduct.mrp
                        ? "Sales price must be less than MRP"
                        : "",
                  }));
                }}
                className="input-field11"
              />
              {errors.sales_price && (
                <div className="tooltip">{errors.sales_price}</div>
              )}
            </div>

            {/* Package Size */}
            <div className="relative">
              <input
                type="number"
                placeholder="Package Size"
                value={newProduct.package_size}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewProduct({ ...newProduct, package_size: value });
                  setErrors((prev) => ({
                    ...prev,
                    package_size:
                      value <= 0
                        ? "Package size must be a positive number"
                        : !Number.isInteger(value)
                        ? "Package size must be a whole number"
                        : "",
                  }));
                }}
                className="input-field11"
              />
              {errors.package_size && (
                <div className="tooltip">{errors.package_size}</div>
              )}
            </div>

            {/* stock_quantity */}
            <div className="relative">
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stock_quantity}
                onChange={(e) => {
                  const value = +e.target.value;
                  setNewProduct({ ...newProduct, stock_quantity: value });
                  setErrors((prev) => ({
                    ...prev,
                    stock_quantity:
                      value <= 0
                        ? "Stock Quantity must be a positive number"
                        : !Number.isInteger(value)
                        ? "Stock Quantity must be a whole number"
                        : "",
                  }));
                }}
                className="input-field11"
              />
              {errors.package_size && (
                <div className="tooltip">{errors.package_size}</div>
              )}
            </div>

            {/* Tags */}
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newProduct.tags.join(", ")}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  tags: e.target.value.split(", "),
                })
              }
              className="input-field11"
            />
            {/* Rest of the form fields... */}
            {/* Include all the input fields from the original form */}

            <ImageUpload
              isUploading={isUploading}
              handleImageUpload={handleImageUpload}
              images={newProduct.images}
              removeImage={removeImage}
            />

            <select
              value={newProduct.category_id}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category_id: parseInt(e.target.value),
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
              Add Product
            </button>
          </form>
        </div>
      </div>
    )
  );
};
export default AddProductModal;
