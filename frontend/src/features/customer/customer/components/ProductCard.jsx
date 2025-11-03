import React, { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { ImHeart } from "react-icons/im";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AddWishlist, RemoveWishlist } from "../../wishlist/wishlistApi";
import customerAPI from "../services/customerAPI";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast"; // تأكد من المسار الصحيح

const ProductCard = ({ product, onAddToCart, onToggleWishlistFromPage, isLoggedIn }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState(product.isInWishlist || false);
  const [wishlistId, setWishlistId] = useState(product.wishlist_id || null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toast, setToast] = useState(null);
  const userId = useSelector((state) => state.cart.user?.id);
  const navigate = useNavigate();
  const themeMode = useSelector((state) => state.customerTheme.mode); 

  // تحويل الصور إذا كانت نص JSON
  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
    ? JSON.parse(product.images)
    : [];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  const openLightbox = () => setIsOpen(true);

  

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

const handleAddToCart = (e) => {
  e.stopPropagation();
  
  if (isAnimating) return;
  
  setIsAnimating(true);
  
  const buttonRect = e.target.getBoundingClientRect();
  const animationElement = document.createElement('div');
  
  // 🔽 البحث المتقدم عن زر السلة
  const findCartButton = () => {
    // المحاولة 1: البحث عن data attribute
    const byDataAttr = document.querySelector('[data-cart-icon]');
    if (byDataAttr) return byDataAttr;
    
    // المحاولة 2: البحث عن class محدد
    const byClass = document.querySelector('.cart-icon-button');
    if (byClass) return byClass;
    
    // المحاولة 3: البحث في الـ nav عن زر يحتوي على أيقونة
    const navButtons = document.querySelectorAll('nav button, nav .relative button');
    for (let btn of navButtons) {
      if (btn.innerHTML.includes('fa-shopping-cart') || 
          btn.innerHTML.includes('FaShoppingCart') ||
          btn.querySelector('svg')) {
        return btn;
      }
    }
    
    // المحاولة 4: البحث في جميع الأزرار
    const allButtons = document.querySelectorAll('button');
    for (let btn of allButtons) {
      const btnText = btn.textContent?.toLowerCase() || '';
      const btnHTML = btn.innerHTML?.toLowerCase() || '';
      const onClick = btn.onclick?.toString() || '';
      
      if (btnText.includes('cart') || 
          btnHTML.includes('shopping-cart') ||
          onClick.includes('Cart') ||
          onClick.includes('cart')) {
        return btn;
      }
    }
    
    return null;
  };
  
  const cartButton = findCartButton();
  let finalLeft = '10%';
  let finalTop = '25px';
  
  if (cartButton) {
    const cartRect = cartButton.getBoundingClientRect();
    finalLeft = `${cartRect.left + cartRect.width / 2- 20}px`;
    finalTop = `${cartRect.top + cartRect.height / 2}px`;
    console.log('Found cart button at:', finalLeft, finalTop);
  } else {
    console.log(' Cart button not found, using default position');
  }
  
  // إعداد عنصر الأنيميشن
  animationElement.style.position = 'fixed';
  animationElement.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
  animationElement.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
  animationElement.style.width = '50px';
  animationElement.style.height = '50px';
  animationElement.style.backgroundImage = `url(${images[0] || ''})`;
  animationElement.style.backgroundSize = 'cover';
  animationElement.style.backgroundPosition = 'center';
  animationElement.style.borderRadius = '10px';
  animationElement.style.zIndex = '10000';
  animationElement.style.pointerEvents = 'none';
  animationElement.style.transition = 'all 0.7s linear';
  animationElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
  animationElement.style.border = '2px solid white';
  
  document.body.appendChild(animationElement);
  
  // بدء الأنيميشن
  setTimeout(() => {
    animationElement.style.left = finalLeft;
    animationElement.style.top = finalTop;
    animationElement.style.transform = 'scale(0.15)';
    animationElement.style.opacity = '0.6';
  }, 10);
  
  // التنظيف بعد الأنيميشن
  setTimeout(() => {
    if (document.body.contains(animationElement)) {
      document.body.removeChild(animationElement);
    }
    setIsAnimating(false);
    onAddToCart?.(product);
    showToast(`${product.name} added to cart!`, 'success');
  }, 720);
};

  // Toggle wishlist
  const onToggleWishlist = async () => {
    if (loading) return;
    setLoading(true);
    setHeartAnimation(true);

    try {
      const productId = product.id || product.product_id;
      if (!productId) throw new Error("Product ID not found");

      if (wishlist) {
        if (!wishlistId) throw new Error("Cannot remove wishlist: wishlistId not found");
        await RemoveWishlist(wishlistId);
        setWishlist(false);
        setWishlistId(null);
        onToggleWishlistFromPage?.(productId, false, wishlistId);
        if (isLoggedIn && userId) await customerAPI.logInteraction(userId, productId, "unlike");
        showToast('Removed from wishlist', 'info');
      } else {
        const added = await AddWishlist(productId);
        setWishlist(true);
        setWishlistId(added.id);
        onToggleWishlistFromPage?.(productId, true, added.id);
        if (isLoggedIn && userId) await customerAPI.logInteraction(userId, productId, "like");
        showToast('Added to wishlist!', 'success');
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
      setTimeout(() => setHeartAnimation(false), 600);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <>
      <div
        className="group bg-transparent flex flex-col justify-between cursor-pointer overflow-hidden"
        onClick={(e) => {
          if (!["BUTTON", "svg", "path"].includes(e.target.tagName)) {
            const productId = product.id || product.product_id;
            if (productId) navigate(`/customer/product/${productId}`);
          }
        }}
      >
        {/* صور المنتج */}
        <div className="h-48 w-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-[var(--div)] to-[var(--bg)] rounded-xl">
          {images.length > 0 ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[var(--button)] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={images[currentImage]}
                alt={product.name}
                loading="lazy"
                className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onClick={openLightbox}
                onLoad={handleImageLoad}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--div)] to-[var(--bg)] flex items-center justify-center text-[var(--light-gray)] rounded-xl">
              No Image
            </div>
          )}

          {/* أزرار التنقل بين الصور */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--mid-dark)]/70 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--mid-dark)] backdrop-blur-sm flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--mid-dark)]/70 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--mid-dark)] backdrop-blur-sm flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}

          {/* مؤشر الصور */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImage 
                      ? "bg-[var(--button)]" 
                      : "bg-[var(--light-gray)]/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* بيانات المنتج */}
        <div className="p-4 flex-1 flex flex-col bg-transparent">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className="text-lg font-bold line-clamp-2 flex-1"
              style={{
                color: themeMode === 'dark' ? 'var(--textbox)' : 'var(--button)'
              }}
            >
              {product.name}
            </h3>
            {/* زر اللايك بجانب الاسم */}
            {isLoggedIn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist();
                }}
                className={`ml-2 p-2 transition-all duration-300 ${
                  wishlist 
                    ? "text-red-500" 
                    : "text-[var(--light-gray)] hover:text-red-500"
                } ${loading ? "opacity-50" : ""} ${
                  heartAnimation ? "scale-125" : "scale-100"
                }`}
                disabled={loading}
              >
                <ImHeart 
                  className={`text-lg transition-all duration-300 ${
                    wishlist ? "fill-current" : ""
                  } ${
                    heartAnimation ? "scale-110" : "scale-100"
                  }`} 
                />
              </button>
            )}
          </div>
          
          {product.description && (
            <p className="text-[var(--light-gray)] text-sm mb-3 line-clamp-2 flex-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <p 
              className="font-bold text-lg"
              style={{
                color: themeMode === 'dark' ? 'var(--textbox)' : 'var(--button)'
              }}
            >
              ${product.price}
            </p>
            
            {/* زر إضافة للسلة كأيقونة */}
            <div className="relative">
              <button
                className={`text-[var(--button)] hover:text-[var(--button)]/80 transition-all duration-300 flex items-center justify-center group/cart ${
                  isAnimating ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={handleAddToCart}
                disabled={isAnimating}
              >
                <FaShoppingCart className="text-xl" />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/cart:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                Add to Cart
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={images.map((img) => ({ src: img }))}
            index={currentImage}
            onIndexChange={setCurrentImage}
          />
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ProductCard;