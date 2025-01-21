import React from "react";

const AddCategoryModal = ({
  showModalCat,
  setShowModalCat,
  newCat,
  setNewCat,
  handleAddCat,
}) => {
  return (
    showModalCat && (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="text-xl font-semibold mb-4 modalTitle">
              Add New Category
            </h2>
            <button
              onClick={() => setShowModalCat(false)}
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

          <form onSubmit={handleAddCat} className="modal-form">
            <input
              type="text"
              placeholder="Category Name"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddCategoryModal;
