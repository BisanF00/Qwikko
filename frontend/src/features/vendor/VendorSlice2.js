import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = vendorSlice.actions;
export default vendorSlice.reducer;
