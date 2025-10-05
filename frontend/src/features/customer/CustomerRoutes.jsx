// // src/features/customer/routes/CustomerRoutes.jsx
// import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./customer/components/layout/MainLayout";
import CustomerAuthRoutes from "./auth/routes";
import HomePage from "./customer/pages/HomePage";
import LandingPage from "./customer/pages/LandingPage";
import ProductsPage from "./customer/pages/ProductsPage";
import ProfilePage from "./customer/pages/ProfilePage";
import OrdersPage from "./customer/pages/OrdersPage";
import OrderDetailsPage from "./customer/pages/OrderDetailsPage";
import StoresPage from "./customer/pages/StoresPage";
import StorePage from "./customer/pages/StorePage";
import TrackOrderPage from "./customer/pages/TrackOrderPage";
import SettingsPage from "./customer/pages/SettingsPage";
import PaymentDetailsPage from "./customer/pages/PaymentDetailsPage";
import WishlistPage from "./wishlist/wishlistPage";
import AboutPage from "./aboutPage/about";
import CartListPage from "./customer/pages/CartListPage";
import CartDetailPage from "./customer/pages/CartDetailPage";
import NotFound from "../notFound";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<CustomerAuthRoutes />} />

      <Route element={<MainLayout />}>
        <Route path="customer/home" element={<HomePage />} />
        <Route path="customer/landing" element={<LandingPage />} />
        <Route path="customer/products" element={<ProductsPage />} />
        <Route path="customer/cart" element={<CartListPage />} />
        <Route path="customer/cart/:id" element={<CartDetailPage />} />
        <Route path="customer/orders" element={<OrdersPage />} />
        <Route path="customer/order-details/:orderId" element={<OrderDetailsPage />} />
        <Route path="customer/stores" element={<StoresPage />} />
        <Route path="customer/stores/:id" element={<StorePage />} />
        <Route path="customer/track-order/:orderId" element={<TrackOrderPage />} />
        <Route path="customer/settings" element={<SettingsPage />} />
        <Route path="customer/payment-details" element={<PaymentDetailsPage />} />
        <Route path="customer/wishlist" element={<WishlistPage />} />
        <Route path="customer/about" element={<AboutPage />} />
        <Route path="customer/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CustomerRoutes;
