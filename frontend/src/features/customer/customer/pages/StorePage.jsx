// src/features/stores/pages/StorePage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreById, fetchStoreProducts } from "../storesSlice";
import StoreDetails from "../components/StoreDetails";
import ProductCard from "../components/ProductCard";
import { fetchCart } from "../cartSlice";
import ReviewSection from "../../review/ReviewSection";
import {
  addReviewThunk,
  fetchAverageRatingThunk,
  fetchReviewsThunk,
} from "../../review/reviewSlice";

import customerAPI from "../services/customerAPI";

const StorePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ===== Store data =====
  const { selectedStore, storeProducts, loading, error } = useSelector(
    (state) => state.stores
  );

  // ===== Reviews data =====
  const { reviews, averageRating } = useSelector((state) => state.reviews);

  // ===== Current user data =====
  const userProfile = useSelector((state) => state.profile.data);
  const currentUserId = userProfile?.id;

  // ===== Find if user already reviewed this store =====
  // const userReview = reviews.find((r) => r.user_id === currentUserId);

  // ===== Calculate display rating =====
  const displayRating = averageRating || 0;

  // ===== Count unique reviews by user_id =====
  const uniqueReviewsCount = reviews.reduce(
    (acc, review) => {
      if (!acc.userIds.includes(review.user_id)) {
        acc.userIds.push(review.user_id);
        acc.count++;
      }
      return acc;
    },
    { userIds: [], count: 0 }
  ).count;

  // ===== Fetch store, products, reviews, average rating =====
  useEffect(() => {
    if (!id) return;
    dispatch(fetchStoreById(id));
    dispatch(fetchStoreProducts(id));
    dispatch(fetchReviewsThunk(id));
    dispatch(fetchAverageRatingThunk(id));
  }, [dispatch, id]);

  // ===== Add to cart =====
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const cartResponse = await customerAPI.getOrCreateCart();
      const cartId = cartResponse?.id || cartResponse?.data?.id;

      if (!cartId) {
        console.error("No cart ID found!");
        return;
      }

      await customerAPI.addItem({
        cartId,
        product,
        quantity,
        variant: product.variant || {},
      });ئ

      dispatch(fetchCart());
      console.log("Item added to cart!");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!selectedStore)
    return <p className="text-center mt-10">Store not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <StoreDetails store={selectedStore} />

      <ReviewSection
        rating={displayRating}
        totalReviews={uniqueReviewsCount}
        readOnly={false}
        onRate={(value) => {
          if (!selectedStore?.store_id) {
            console.error(
              "No store_id found in selectedStore:",
              selectedStore
            );
            return;
          }

          dispatch(
            addReviewThunk({
              vendor_id: selectedStore.store_id,
              rating: value,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(fetchReviewsThunk(selectedStore.store_id));
              dispatch(fetchAverageRatingThunk(selectedStore.store_id));
            })
            .catch((err) => console.error("Add review failed:", err));
        }}
      />


      <h2 className="text-2xl font-bold mt-8 mb-4">Products</h2>
      {storeProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;
