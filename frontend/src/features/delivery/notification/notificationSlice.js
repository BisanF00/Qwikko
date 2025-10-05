import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationAPI from "./notificatationAPI";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (token, { rejectWithValue }) => {
    try {
      const data = await notificationAPI.getNotifications(token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notificationsDelivery",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
