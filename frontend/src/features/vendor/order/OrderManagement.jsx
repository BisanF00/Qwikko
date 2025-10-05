import React, { useState, useEffect } from "react";
import { fetchOrderItems, updateOrderItemStatus } from "../VendorAPI2";

export default function OrderManagement() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // show 5 orders initially

  const allowedStatuses = ["pending", "accepted", "rejected"];

  const loadItems = async (statusFilter = "") => {
    setLoading(true);
    try {
      const data = await fetchOrderItems();
      const filtered =
        statusFilter === ""
          ? data
          : data.filter((i) => i.vendor_status === statusFilter);
      setItems(filtered);
    } catch (err) {
      console.error("Error loading order items:", err);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    if (!allowedStatuses.includes(newStatus)) return;
    await updateOrderItemStatus(itemId, newStatus);
    loadItems(filter);
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilter(status);
    loadItems(status);
    setVisibleCount(5); // reset to 5 when filter changes
  };

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Filter by status */}
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="statusFilter" className="font-medium text-gray-700">
          Filter by Item Status:
        </label>
        <select
          id="statusFilter"
          value={filter}
          onChange={handleFilterChange}
          className="border rounded-lg p-2 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-orange-300"
        >
          <option value="">All</option>
          {allowedStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {loading ? (
          <p className="text-gray-500">Loading items...</p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="p-2">Item ID</th>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Vendor Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr
                    key={item.order_item_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-2">{item.order_item_id}</td>
                    <td className="p-2">{item.order_id}</td>
                    <td className="p-2">{item.product_name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">
                      <select
                        value={item.vendor_status}
                        onChange={(e) =>
                          handleStatusChange(item.order_item_id, e.target.value)
                        }
                        className={`p-1 rounded-md font-medium ${
                          item.vendor_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.vendor_status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {allowedStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🔹 Load More button */}
            {visibleCount < items.length && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setVisibleCount(items.length)}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
            >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
