import { useState, useEffect } from "react";
import { fetchDeliveryReport } from "./DeliveryAPI";

export default function DeliveryReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30); // default last 30 days

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchDeliveryReport(days);
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [days]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!report)
    return <p className="text-center mt-10">No report data available</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Delivery Report</h1>

      {/* Select Period */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <label className="font-semibold">Select period (days):</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 3 months</option>
          <option value={180}>Last 6 months</option>
        </select>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{report.totals.total_orders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Amount</h2>
          <p className="text-3xl font-bold">${report.totals.total_amount}</p>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.payment_status).map(([key, val]) => (
            <div key={key} className="bg-yellow-100 p-3 rounded text-center">
              <p className="font-semibold capitalize">{key}</p>
              <p className="text-2xl font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(report.statuses).map(([key, val]) => (
            <div key={key} className="bg-purple-100 p-3 rounded text-center">
              <p className="font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </p>
              <p className="text-2xl font-bold">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Email</th>
              <th className="py-2">Orders</th>
              <th className="py-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {report.top_customers.map((c) => (
              <tr key={c.customer_id} className="border-b">
                <td className="py-2">{c.customer_email}</td>
                <td className="py-2">{c.orders_count}</td>
                <td className="py-2">${c.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Vendors */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Vendors</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Store Name</th>
              <th className="py-2">Orders</th>
              <th className="py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {report.top_vendors.map((v) => (
              <tr key={v.vendor_id} className="border-b">
                <td className="py-2">{v.store_name}</td>
                <td className="py-2">{v.orders_count}</td>
                <td className="py-2">${v.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Orders */}
      <div className="bg-red-100 p-4 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
        <p className="text-3xl font-bold">{report.pending_count}</p>
      </div>
    </div>
  );
}
