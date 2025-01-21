import React from "react";
import "../styles/pagination.css";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="pagination-controls1">
      <button
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange("next")}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
