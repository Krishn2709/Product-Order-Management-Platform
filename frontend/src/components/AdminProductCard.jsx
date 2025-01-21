import React from "react";

const AdminProductCard = ({
  product,
  getCategoryName,
  toggleProductActiveStatus,
  toggleProductDeletedStatus,
  setEditProduct,
  setShowEditModal,
}) => {
  return (
    <div className="card">
      <div className="product-image">
        <img src={product.images} alt={product.name} />
      </div>
      <h2 className="prodName">{product.name}</h2>
      <p>WS Code: {product.ws_code}</p>
      <p>MRP: ₹{product.mrp}</p>
      <p>Sales Price: ₹{product.sales_price}</p>
      <p>Package Size: {product.package_size}</p>
      <p>Available Stock: {product.stock_quantity}</p>
      <p>
        Categories:{" "}
        {product.category_id
          ? getCategoryName(product.category_id)
          : "No Categories"}
      </p>
      <p>Tags: {product.tags ? product.tags.join(", ") : "No Tags"}</p>
      <p
        className={`text-sm font-semibold ${
          product.is_active ? "text-green-600" : "text-red-600"
        }`}
      >
        Status: {product.is_active ? "Active" : "Inactive"}
      </p>

      <div className="space-y-2 buttonsedit">
        <button
          onClick={() => {
            setEditProduct({
              id: product.id,
              name: product.name,
              sales_price: product.sales_price,
              ws_code: product.ws_code,
              mrp: product.mrp,
              package_size: product.package_size,
              stock_quantity: product.stock_quantity,
              tags: product.tags,
              category_id: product.category_id,
              images: product.images,
              is_active: product.is_active,
            });
            setShowEditModal(true);
          }}
          className="bg-yellow-500 deactivate text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() =>
            toggleProductActiveStatus(product.id, product.is_active)
          }
          className={`${
            product.is_active ? "bg-red-500" : "bg-green-500"
          } text-white deactivate rounded hover:bg-opacity-90`}
        >
          {product.is_active ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() =>
            toggleProductDeletedStatus(product.id, product.is_deleted)
          }
          className="cancel"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
