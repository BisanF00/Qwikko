import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const CustomerAuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginForm />} />
      <Route path="signup" element={<SignupForm />} />
    </Routes>
  );
};

export default CustomerAuthRoutes;
