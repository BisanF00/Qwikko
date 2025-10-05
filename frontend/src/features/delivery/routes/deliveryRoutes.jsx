import { Routes, Route } from "react-router-dom";
import LandingPage from "../delivery/Landing";
import RegisterDelivery from "../auth/RegisterDelivery";
import LoginDelivery from "../auth/Login";
import DeliveryProfile from "../delivery/DeliveryProfile";
import EditProfile from "../delivery/EditProfile";
import Settings from "../delivery/Settings";
import Dashboard from "../delivery/Dashboard";
import Orders from "../delivery/Orders";
import TrackingOrders from "../delivery/Tracking";
import Reports from "../delivery/ReportsPage";
import Home from "../delivery/Home";

export default function DeliveryRiutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginDelivery />} />
      <Route path="/register" element={<RegisterDelivery />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="getProfile" element={<DeliveryProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="tracking/:orderId" element={<TrackingOrders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="edit" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}
