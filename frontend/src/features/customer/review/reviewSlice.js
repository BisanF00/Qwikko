// src/features/review/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as reviewAPI from "./services/reviewAPI";

// ==== Thunks ====
export const addReviewThunk = createAsyncThunk(
  "review/addReview",
  async ({ vendor_id, rating }, { rejectWithValue }) => {
    try {
      return await reviewAPI.addReview({ vendor_id, rating });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchReviewsThunk = createAsyncThunk(
  "review/fetchReviews",
  async (vendor_id, { rejectWithValue }) => {
    try {
      return await reviewAPI.getReviewsByVendor(vendor_id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAverageRatingThunk = createAsyncThunk(
  "review/fetchAverageRating",
  async (vendor_id, { rejectWithValue }) => {
    try {
      return await reviewAPI.getVendorAverageRating(vendor_id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    averageRating: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(fetchAverageRatingThunk.fulfilled, (state, action) => {
        state.averageRating = action.payload;
      })
      .addCase(addReviewThunk.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload); // نضيف review جديد في البداية
      });
  },
});

export default reviewSlice.reducer;
