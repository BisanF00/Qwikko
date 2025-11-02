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
      <div
        className="flex items-center justify-center min-h-[60vh]"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--primary)",
            borderTopColor: "transparent",
          }}
        />
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

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ===== WRAPPER يلف كل الأقسام ===== */}
      <div
        className="max-w-7xl mx-auto p-6 md:p-8 rounded-2xl"
        style={{
          backgroundColor: "var(--div)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        {/* ===== Hero ===== */}
        <section className="mb-6">
          <div className="rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Welcome to{" "}
              <span style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                QWIKKO Delivery
              </span>
            </h1>
            <p className="text-base md:text-lg mt-3 opacity-90">
              Fast, smart, and organized delivery operations—everything you need
              in one dashboard.
            </p>
          </div>
        </section>

        {/* ===== Controls ===== */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-semibold">Select period:</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg px-4 py-2"
              style={{
                backgroundColor: "var(--textbox)",
                color: "var(--mid-dark)",
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
        </section>

        {/* ===== Grid: KPI (Top) + Chart + KPI (Bottom) ===== */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          {/* Grid 3 أعمدة على الشاشات الكبيرة */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* يسار: الرسم البياني (ياخذ عمودين) */}
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <h2 className="text-xl font-semibold mb-4">Orders Over Time</h2>
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

        {/* ===== Payment Status + Order Status + Top Customers + Top Vendors ===== */}
        <section className="space-y-10 mt-10">
          {/* 🔸 Payment Status */}
          <div className="rounded-2xl p-6 bg-var(--div) shadow-md">
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <FaDollarSign
                style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}
              />{" "}
              Payment Status
            </h2>
            {Object.entries(report.payment_status || {})
              .filter(([key]) => key !== "failed" && key !== "refunded")
              .map(([key, val]) => {
                const total = Object.entries(report.payment_status || {})
                  .filter(([k]) => k !== "failed" && k !== "refunded")
                  .reduce((a, [, v]) => a + v, 0);
                const percent = total ? (val / total) * 100 : 0;

                let bgColor = "bg-gray-400";
                if (key === "paid") bgColor = "bg-green-500";
                else if (key === "pending") bgColor = "bg-yellow-400";
                else if (key === "unpaid") bgColor = "bg-red-500";

                return (
                  <div key={key} className="mb-4">
                    <p className="capitalize mb-1">{key.replace(/_/g, " ")}</p>
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`${bgColor} h-full rounded-full`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm mt-1">{val} orders</p>
                  </div>
                );
              })}
          </div>

          {/* 🔸 Order Status */}
          <div className="rounded-2xl p-6 bg-var(--div) shadow-md">
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <FaClock style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }} />{" "}
              Order Status
            </h2>

            {[
              "accepted",
              "processing",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ].map((statusKey) => {
              const val = report.statuses?.[statusKey] || 0;
              const total = Object.values(report.statuses || {}).reduce(
                (a, b) => a + b,
                0
              );
              const percent = total ? (val / total) * 100 : 0;

              let bgColor = "bg-gray-400";
              switch (statusKey) {
                case "accepted":
                  bgColor = "bg-blue-500";
                  break;
                case "processing":
                  bgColor = "bg-yellow-400";
                  break;
                case "out_for_delivery":
                  bgColor = "bg-purple-500";
                  break;
                case "delivered":
                  bgColor = "bg-green-500";
                  break;
                case "cancelled":
                  bgColor = "bg-red-500";
                  break;
              }

              return (
                <div key={statusKey} className="mb-4">
                  <p className="capitalize mb-1">
                    {statusKey.replace(/_/g, " ")}
                  </p>
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`${bgColor} h-full rounded-full`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm mt-1">{val} orders</p>
                </div>
              );
            })}
          </div>

          {/* 🔸 Top Customers */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{ backgroundColor: "var(--div)" }}
          >
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }} // 🌗 يتغير حسب الثيم
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
                    backgroundColor: "var(--bg)", // يتغير حسب الثيم
                    border: "1px solid var(--border)",
                    color: "var(--text)", // النص يتغير حسب الثيم
                  }}
                >
                  <p className="font-semibold mb-2">{c.customer_email}</p>
                  <p style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                    Orders: {c.orders_count}
                  </p>
                  <p style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                    Total Spent: ${c.total_amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🔸 Top Vendors */}
          <div
            className="rounded-2xl p-6 shadow-md"
            style={{ backgroundColor: "var(--div)" }}
          >
            <h2
              className="text-2xl font-bold mb-5 flex items-center gap-2"
              style={{ color: "var(--text)" }} // 🌗 يتغير حسب الثيم
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
                  <p style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                    Orders: {v.orders_count}
                  </p>
                  <p style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}>
                    Revenue: ${v.revenue}
                  </p>
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
