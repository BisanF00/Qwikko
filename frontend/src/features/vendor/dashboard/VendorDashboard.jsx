// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchOrders, fetchProducts } from "../VendorAPI2";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);

  // 🔹 حساب مجموع المبيعات
  const calculateTotalSales = (orders) => {
    return orders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0
    );
  };

  // 🔹 جلب تقرير الـ Vendor
  const fetchReport = async () => {
    try {
      const res = await fetch("/api/vendor/reports", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();

      if (json.success) {
        // نجلب الأوردرات ونحسب منها المبيعات
        const ordersData = await fetchOrders();
        const totalSales = calculateTotalSales(ordersData);

        setReport({
          ...json.data,
          total_sales: totalSales.toFixed(2),
        });
      }
    } catch (err) {
      console.error("❌ Error fetching report:", err);
    }
  };

  // 🔹 جلب عدد المنتجات
  const fetchProductsCount = async () => {
    const products = await fetchProducts();
    setProductsCount(products.length);
  };

 // 🔹 جلب آخر 5 أوردرات (unique) باستخدام الفنكشن الجديد
const fetchLastOrders = async () => {
  try {
    const data = await fetchOrders(); // الفنكشن الجديد من VendorAPI.js

    // Group by order_id لتفادي التكرار
    const uniqueOrders = Object.values(
      data.reduce((acc, order) => {
        acc[order.order_id] = order;
        return acc;
      }, {})
    );

    // آخر 5 أوردرات فقط
    setOrders(uniqueOrders.slice(0, 5));
  } catch (err) {
    console.error("❌ Error fetching last orders:", err);
    setOrders([]);
  }
};


  useEffect(() => {
    fetchReport();
    fetchProductsCount();
    fetchLastOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Sales</p>
            <h2 className="text-2xl font-bold">
              ${report?.total_sales || 0}
            </h2>
          </div>
          <DollarSign className="w-10 h-10 text-green-500" />
        </div>

        {/* Orders Count */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Orders Count</p>
            <h2 className="text-2xl font-bold">
              {report?.total_orders || 0}
            </h2>
          </div>
          <ShoppingCart className="w-10 h-10 text-blue-500" />
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Active Products</p>
            <h2 className="text-2xl font-bold">{productsCount}</h2>
          </div>
          <Package className="w-10 h-10 text-purple-500" />
        </div>

        {/* New Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">New Notifications</p>
            <h2 className="text-2xl font-bold">0</h2>
          </div>
          <Bell className="w-10 h-10 text-red-500" />
        </div>
      </div>

      {/* ✅ Last Orders Table */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-4">Latest Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-2">Order ID</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b">
                <td className="p-2">{order.order_id}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">${order.total_amount}</td>
                <td className="p-2">{order.shipping_address}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No recent orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
