import React, { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

const ProductCard = ({ product, onAddToCart }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Lightbox
  const images = Array.isArray(product.images) ? product.images : [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    setIsOpen(true);
  };

  return (
    <div className="p-4 border rounded shadow hover:shadow-lg transition flex flex-col justify-between">
      {/* الصور داخل الكارد مع السهمين */}
      <div className="h-48 w-full mb-2 overflow-hidden rounded relative cursor-pointer">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onClick={openLightbox} // يفتح Lightbox عند الضغط
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded opacity-50 hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded opacity-50 hover:opacity-100"
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div>
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-blue-600 font-semibold">${product.price}</p>
      </div>

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => onAddToCart && onAddToCart(product)}
      >
        Add to Cart
      </button>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map((img) => ({ src: img }))}
          index={currentImage}
          onIndexChange={setCurrentImage} // يضمن مزامنة التنقل بين الصور
        />
      )}
    </div>
  );
};

export default ProductCard;
