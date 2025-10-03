// src/features/customer/customer/pages/OrdersPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders,reorderOrder  } from "../ordersSlice";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: items, loading, error } = useSelector((state) => state.orders);

  const [searchTx, setSearchTx] = React.useState(""); // State للبحث

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  // فلترة الأوردرات حسب Transaction ID
  const filteredItems = items.filter((order) => {
  if (!searchTx) return true; // لو حقل البحث فارغ، عرض كل الأوردرات
  return order.payments?.some((p) =>
    p.transaction_id.toLowerCase().includes(searchTx.toLowerCase())
  );
});


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>

      {/* بحث حسب Transaction ID */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Transaction ID..."
          value={searchTx}
          onChange={(e) => setSearchTx(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Order #{order.id} - {order.status}
              </h2>
              <p className="text-gray-600 mb-2">
                Payment: {order.payment_status} | Total: ${order.total_amount}
              </p>
              <p className="text-gray-600 mb-2">Shipping: {order.shipping_address}</p>

              <div className="border-t pt-2">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between mb-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* تفاصيل الدفع لكل Order */}
              {order.payments && order.payments.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  <h3 className="font-semibold mb-1">Payment Details:</h3>
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="text-gray-700 mb-1">
                      Method: {payment.payment_method} | Amount: ${payment.amount} | Status: {payment.status}
                      {payment.card_last4 && ` | Card: **** **** **** ${payment.card_last4} (${payment.card_brand})`}
                      {payment.transaction_id && ` | Transaction: ${payment.transaction_id}`}
                    </div>
                  ))}
                </div>
              )}

              {/* زر التتبع */}
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => navigate(`/track-order/${order.id}`)}
              >
                Track Order
              </button>
              <button
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={async () => {
                  try {
                    const action = await dispatch(reorderOrder(order.id)).unwrap();
                    navigate(`/order-details/${action.id}`, { state: { reorder: true } });
                  } catch (err) {
                    alert("Failed to reorder: " + err.message);
                  }
                }}
              >
                Reorder
              </button>
            </div>
          ))}

          {/* زر العودة للتسوق */}
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
