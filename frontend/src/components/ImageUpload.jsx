import React from "react";

const ImageUpload = ({
  isUploading,
  handleImageUpload,
  images,
  removeImage,
}) => {
  return (
    <div className="upload-container">
      {isUploading && (
        <span className="upload-status">Uploading images...</span>
      )}
      <div className="upload-controls">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="file-input"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`upload-button ${
            isUploading ? "upload-button-disabled" : ""
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Images"}
        </label>
      </div>

      <div className="image-grid">
        {images.map((url, index) => (
          <div key={index} className="image-container">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="product-image"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="remove-button"
              title="Remove image"
            >
              <svg
                className="remove-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
