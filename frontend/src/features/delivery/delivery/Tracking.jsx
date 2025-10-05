import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrackingOrder } from "./DeliveryAPI"; // عدّل المسار حسب مشروعك
import { FaUser, FaIndustry, FaBox, FaCreditCard } from "react-icons/fa";

export default function TrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getTrackingOrder(orderId);
        setOrder(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10"> Loading order...</p>;
  if (message)
    return <p className="text-center mt-10 text-red-500">{message}</p>;
  if (!order) return <p className="text-center mt-10">❌ Order not found</p>;

  const formatCurrency = (value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10 p-6">
      <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-8 text-gray-800">
        Tracking Order #{order?.order_id || "N/A"}
      </h2>

      {/* Customer Info */}
      <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-blue-600">
          <FaUser className="text-blue-600" /> Customer Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>Name:</strong> {order?.customer_name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {order?.customer_email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {order?.customer_phone || "N/A"}
          </p>
        </div>
      </section>

      {/* Vendor / Product Info */}
      <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-green-600">
          <FaIndustry className="text-green-600" /> Vendor / Product Info
        </h3>

        <div className="space-y-4">
          {order?.items?.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.order_item_id}
                className="p-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
              >
                <p>
                  <strong>Vendor:</strong> {item?.vendor_name || "N/A"}
                </p>
                <p>
                  <strong>Product:</strong> {item?.product_name || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong> {item?.vendor_email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {item?.vendor_phone || "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {item?.quantity || 0}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {formatCurrency(item?.item_price || 0)}
                </p>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </section>

      {/* Order Details */}
      <section className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-purple-600">
          <FaBox className="text-purple-600" /> Order Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <strong>Status:</strong> {order?.status || "N/A"}
          </p>
          <p>
            <strong>Payment:</strong> {order?.payment_status || "N/A"}
          </p>
          <p className="sm:col-span-2">
            <strong>Shipping Address:</strong>{" "}
            {order?.shipping_address || "N/A"}
          </p>
          <p className="sm:col-span-2">
            <strong>Created At:</strong>{" "}
            {order?.created_at
              ? new Date(order.created_at).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Products List */}
        {order?.items?.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-lg mb-2 text-gray-700">
              Products in this order:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.items.map((item) => (
                <div
                  key={item.order_item_id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <p>
                    {item?.product_name} (
                    {item?.variant
                      ? typeof item.variant === "object"
                        ? Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : item.variant
                      : "No variant"}
                    )
                  </p>

                  <p>
                    {item?.quantity} x {formatCurrency(item?.item_price)}
                  </p>
                  <p className="font-semibold text-green-600">
                    Total: {formatCurrency(item?.quantity * item?.item_price)}
                  </p>
                </div>
              ))}
            </div>

            {/* ✅ إجمالي الطلب الكلي */}
            <div className="mt-6 text-right text-xl font-bold text-purple-700 flex items-center justify-end gap-2">
              <FaCreditCard className="text-green-600 text-2xl" />
              <span>
                Order Total:{" "}
                {formatCurrency(
                  order.items.reduce(
                    (acc, item) => acc + item.quantity * item.item_price,
                    0
                  )
                )}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 hover:scale-105 transition-transform duration-200"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
}
