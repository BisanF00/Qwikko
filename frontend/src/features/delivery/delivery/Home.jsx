import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchDeliveryReport } from "./Api/DeliveryAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FaClock,
  FaCheck,
  FaDollarSign,
  FaUsers,
  FaStore,
} from "react-icons/fa";

export default function DeliveryDashboard() {
  const isDarkMode = useSelector((s) => s.deliveryTheme.darkMode);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchDeliveryReport(days);
        setReport(data);
      } catch (e) {
        setError(e?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--button)] mx-auto mb-4"></div>
        <p className="text-[var(--text)] text-lg">Loading Dashboard...</p>
      </div>
    </div>
  );
}
 
  if (error)
    return (
      <p className="text-center mt-10" style={{ color: "var(--error)" }}>
        {error}
      </p>
    );
  if (!report)
    return (
      <p className="text-center mt-10" style={{ color: "var(--text)" }}>
        No report data available
      </p>
    );

  // بيانات الشارت
  const ordersData = report.daily_orders || report.orders_over_time || [];

  // أرقام إجمالية
  const totalOrders = report?.totals?.total_orders ?? 0;
  const totalAmount = report?.totals?.total_amount ?? 0;

  // فلترة الحالات لإخفاء pending
  const filteredStatuses = Object.fromEntries(
    Object.entries(report.statuses || {}).filter(([k]) => !/pending/i.test(k))
  );

  // حالة الدفع
  const paymentStatus = report.payment_status || {};

  // تنسيق مبلغ
  const money = (n) => {
    const v = Number(n || 0);
    return v.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // ألوان الدروب داون بحسب المود
  const dd = {
    bg: isDarkMode ? "#111315" : "#ffffff",
    text: isDarkMode ? "#f9fafb" : "#1f2937",
    border: isDarkMode ? "#2a2e33" : "#e5e7eb",
    hover: isDarkMode ? "#1a1d21" : "#f9fafb",
    ring: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ===== WRAPPER يلف كل الأقسام ===== */}
      <div
        className="max-w-7xl mx-auto p-6 md:p-8 rounded-2xl"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        {/* ===== Hero ===== */}
        <section className="mb-6">
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="rounded-2xl p-8">
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Welcome to{" "}
                <span style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                  QWIKKO Delivery
                </span>
              </h1>
              <p className="text-base md:text-lg mt-3 opacity-90">
                Fast, smart, and organized delivery operations—everything you
                need in one dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Controls ===== */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{
                backgroundColor: "var(--bg)",
                borderRadius: "0.75",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex justify-start mb-4">
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-lg px-4 py-2"
                  style={{
                    backgroundColor: dd.bg,
                    color: dd.text,
                    border: "1px solid var(--border)",
                  }}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 3 months</option>
                  <option value={180}>Last 6 months</option>
                </select>
              </div>

              {/* الرسم البياني */}
              <div className="w-full" style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersData} barCategoryGap="35%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="order_date" stroke="var(--light-gray)" />
                    <YAxis stroke="var(--light-gray)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        borderRadius: 8,
                      }}
                    />
                    <Bar
                      dataKey="orders_count"
                      fill="var(--button)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* يمين: الكاردين فوق بعض */}
            <div className="flex flex-col gap-6">
              {/* KPI #1 */}
              <div
                style={{
                  backgroundColor: isDarkMode ? "#307A59" : "#d3f3e2",
                  color: isDarkMode ? "#ffffff" : "#242625",
                }}
                className="p-6 rounded-2xl shadow flex flex-col items-center justify-center h-full"
              >
                <FaCheck
                  style={{ color: isDarkMode ? "#ffffff" : "#307A59" }}
                  className="text-4xl mb-2"
                />
                <h2 className="text-lg font-semibold">Total Orders</h2>
                <p className="text-3xl font-bold">
                  {report.totals.total_orders}
                </p>
              </div>

              {/* KPI #2 */}
              <div
                style={{
                  backgroundColor: isDarkMode ? "#307A59" : "#e6f4ea",
                  color: isDarkMode ? "#ffffff" : "#242625",
                }}
                className="p-6 rounded-2xl shadow flex flex-col items-center justify-center h-full"
              >
                <FaDollarSign
                  style={{ color: isDarkMode ? "#ffffff" : "#307A59" }}
                  className="text-4xl mb-2"
                />
                <h2 className="text-lg font-semibold">Total Revenue</h2>
                <p className="text-3xl font-bold">
                  ${report.totals.total_amount}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="space-y-10 mt-10">
          {/* 🔹 Order Status */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{
              backgroundColor: isDarkMode ? "#313131" : "#f5f6f5",
              color: "var(--text)",
            }}
          >
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <FaClock style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }} />{" "}
              Order Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {["accepted", "processing", "out_for_delivery", "delivered"].map(
                (statusKey) => {
                  const val = report.statuses?.[statusKey] || 0;
                  let color = "#6b7280";
                  const label = statusKey.replace(/_/g, " ");

                  switch (statusKey) {
                    case "accepted":
                      color = "#3b82f6"; // blue
                      break;
                    case "processing":
                      color = "#facc15"; // yellow
                      break;
                    case "out_for_delivery":
                      color = "#f97316"; // orange
                      break;
                    case "delivered":
                      color = "#22c55e"; // green
                      break;
                  }

                  return (
                    <div
                      key={statusKey}
                      className="p-4 rounded-xl text-center shadow border transition-transform duration-300"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <FaClock
                        style={{ color }}
                        className="text-2xl mx-auto mb-1.5"
                      />
                      <p className="capitalize font-semibold text-sm mb-0.5">
                        {label}
                      </p>
                      <p className="text-base font-bold">{val} orders</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* 🔹 Payment Status */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{
              backgroundColor: isDarkMode ? "#313131" : "#f5f6f5",
              color: "var(--text)",
            }}
          >
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <FaDollarSign
                style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}
              />{" "}
              Payment Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["paid", "pending", "unpaid"].map((key) => {
                const val = report.payment_status?.[key] ?? 0;
                let iconColor = "#22c55e"; // default for paid
                const label = key.replace(/_/g, " ");

                if (key === "pending") iconColor = "#facc15";
                if (key === "unpaid") iconColor = "#ef4444";

                return (
                  <div
                    key={key}
                    className="p-5 rounded-xl text-center shadow border"
                    style={{
                      backgroundColor: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <FaDollarSign
                      style={{ color: iconColor }}
                      className="text-3xl mx-auto mb-2"
                    />
                    <p className="capitalize font-semibold mb-1">{label}</p>
                    <p className="text-lg font-bold">{val} orders</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔸 Top Customers (اتركه كما هو عندك) */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{ backgroundColor: isDarkMode ? "#313131" : "#f5f6f5" }}
          >
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <FaUsers style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }} />{" "}
              Top Customers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.top_customers?.slice(0, 3).map((c) => (
                <div
                  key={c.customer_id}
                  className="p-4 rounded-xl text-center"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <p className="font-semibold mb-2">{c.customer_email}</p>
                  <p>Orders: {c.orders_count}</p>
                  <p>Total Spent: ${c.total_amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 🔸 Top Vendors (اتركه كما هو عندك) */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{ backgroundColor: isDarkMode ? "#313131" : "#f5f6f5" }}
          >
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <FaStore style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }} />{" "}
              Top Vendors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.top_vendors?.slice(0, 3).map((v) => (
                <div
                  key={v.vendor_id}
                  className="p-4 rounded-xl text-center"
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: isDarkMode ? "#ffffff" : "#292e2c",
                  }}
                >
                  <p className="font-semibold mb-1">{v.store_name}</p>
                  <p>Orders: {v.orders_count}</p>
                  <p>Revenue: ${v.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* ===== /WRAPPER ===== */}
    </div>
  );
}
