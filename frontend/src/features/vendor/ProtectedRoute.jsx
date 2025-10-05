// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    // إذا ما في توكين، حول للصفحة الرئيسية مع رسالة
    alert("يجب تسجيل الدخول أولاً"); // رسالة بسيطة
    return <Navigate to="/vendor" replace />;
  }

  // إذا موجود التوكين، خلي الوصول للصفحة
  return children;
}
