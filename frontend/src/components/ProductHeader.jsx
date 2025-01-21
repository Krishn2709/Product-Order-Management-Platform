import React from "react";
import { Link } from "react-router-dom";

const ProductHeader = ({ setShowModal, setShowModalCat }) => {
  return (
    <div className="headerbtn">
      <button onClick={() => setShowModal(true)} className="headerbtn1">
        + Add new Product
      </button>
      <button onClick={() => setShowModalCat(true)} className="headerbtn1">
        + Add new Category
      </button>
      <button className="headerbtn1">
        <Link className="allOrders" to="/admin/orders">
          All Orders
        </Link>
      </button>
    </div>
  );
};

export default ProductHeader;
