import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/delivery/auth/authSlice";
import notificationsReducer from "../features/delivery/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});
