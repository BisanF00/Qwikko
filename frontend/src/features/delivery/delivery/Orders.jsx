import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCompanyOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
} from "./DeliveryAPI";
import { FaBox, FaTimes } from "react-icons/fa";

const STATUS_FLOW = {
  accepted: ["processing"],
  processing: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
};

const STATUS_LABELS = {
  all: "All",
  accepted: "Accepted",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchCompanyOrders();
        const validOrders = data.filter((o) =>
          // eslint-disable-next-line no-prototype-builtins
          STATUS_FLOW.hasOwnProperty(o.status)
        );
        setOrders(validOrders);
        setFilteredOrders(validOrders);
      } catch (err) {
        setMessage("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (filter === "all") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === filter));
  }, [filter, orders]);

  const openStatusModal = (orderId, status) => {
    setCurrentOrderId(orderId);
    setCurrentStatus(status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    const nextStatuses = STATUS_FLOW[currentStatus];
    if (!nextStatuses || nextStatuses.length === 0) return;

    const newStatus = nextStatuses[0];
    try {
      setUpdating(true);
      await updateOrderStatus(currentOrderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === currentOrderId ? { ...o, status: newStatus } : o
        )
      );
      setShowModal(false);
      setMessage(`✅ Order #${currentOrderId} status updated to ${newStatus}`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async (orderId) => {
    try {
      const result = await updateOrderPaymentStatus(orderId, "PAID");
      alert(result.message);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, payment_status: result.order.payment_status }
            : o
        )
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (!orders.length)
    return <p className="text-center mt-10">📭 No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 rounded-2xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        <FaBox className="text-green-600 text-3xl" /> Company Orders
      </h2>

      {message && (
        <p className="text-center mb-4 font-medium text-green-700 transition-all duration-300">
          {message}
        </p>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {Object.keys(STATUS_LABELS).map((key) => (
          <button
            key={key}
            onClick={() => {
              setFilter(key);
              setVisibleCount(4); // إعادة تعيين عدد الطلبات المرئية عند تغيير الفلتر
            }}
            className={`px-4 py-1 rounded-2xl border transition-all duration-300 ${
              filter === key
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {STATUS_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.slice(0, visibleCount).map((o) => (
          <div
            key={o.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Order #{o.id}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Customer: <strong>{o.customer_id}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Amount: <strong>{o.total_amount} JOD</strong>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Status:{" "}
                <strong className="capitalize text-green-700">
                  {o.status.replace(/_/g, " ")}
                </strong>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Payment: <strong>{o.payment_status}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Address: <strong>{o.shipping_address}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(o.created_at).toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              {STATUS_FLOW[o.status].length > 0 && (
                <button
                  onClick={() => openStatusModal(o.id, o.status)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  {STATUS_FLOW[o.status][0].replace(/_/g, " ").toUpperCase()}
                </button>
              )}
              <button
                onClick={() => navigate(`/delivery/dashboard/tracking/${o.id}`)}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
              >
                Track
              </button>
              <button
                onClick={() => handlePaymentUpdate(o.id)}
                disabled={o.payment_status === "paid"}
                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
              >
                Mark as Paid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredOrders.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}

      {/* Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative transition-all duration-300 transform scale-100">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Order Status
            </h3>
            <p className="mb-4 text-gray-700">
              Current status:{" "}
              <strong>{currentStatus.replace(/_/g, " ")}</strong>
            </p>
            {STATUS_FLOW[currentStatus].length > 0 ? (
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
                  updating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:scale-105"
                }`}
              >
                {updating
                  ? "Updating..."
                  : STATUS_FLOW[currentStatus][0]
                      .replace(/_/g, " ")
                      .toUpperCase()}
              </button>
            ) : (
              <p className="text-gray-500">No further status change allowed.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchCompanyOrders,
//   updateOrderStatus,
//   updateOrderPaymentStatus,
// } from "./DeliveryAPI";

// const STATUS_FLOW = {
//   accepted: ["processing"],
//   processing: ["out_for_delivery"],
//   out_for_delivery: ["delivered"],
//   delivered: [],
// };

// const STATUS_LABELS = [
//   "accepted",
//   "processing",
//   "out_for_delivery",
//   "delivered",
// ];

// export default function OrdersList() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const navigate = useNavigate();
//   const [visibleCount, setVisibleCount] = useState(4);

//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         const data = await fetchCompanyOrders();
//         setOrders(data);
//       } catch (err) {
//         setMessage("❌ " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadOrders();
//   }, []);

//   const handleNextStage = async (order) => {
//     const nextStatuses = STATUS_FLOW[order.status];
//     if (!nextStatuses || nextStatuses.length === 0) return;

//     const newStatus = nextStatuses[0];
//     try {
//       setUpdating(true);
//       await updateOrderStatus(order.id, newStatus);
//       setOrders((prev) =>
//         prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
//       );
//       setMessage(`✅ Order #${order.id} status updated to ${newStatus}`);
//       setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handlePaymentUpdate = async (orderId) => {
//     try {
//       const result = await updateOrderPaymentStatus(orderId, "PAID");
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId
//             ? { ...o, payment_status: result.order.payment_status }
//             : o
//         )
//       );
//       alert(result.message);
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//   };

//   const renderProgressBar = (order) => {
//     return (
//       <div className="flex items-center gap-2 mt-4">
//         {STATUS_LABELS.map((status, index) => {
//           const currentIndex = STATUS_LABELS.indexOf(order.status);
//           const isCompleted = index < currentIndex;
//           const isActive = index === currentIndex;

//           return (
//             <div key={status} className="flex-1 flex items-center">
//               <div
//                 className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                   isCompleted
//                     ? "bg-green-600 border-green-600"
//                     : isActive
//                     ? "bg-blue-600 border-blue-600"
//                     : "bg-white border-gray-300"
//                 }`}
//               ></div>
//               {index < STATUS_LABELS.length - 1 && (
//                 <div
//                   className={`flex-1 h-1 ${
//                     isCompleted
//                       ? "bg-green-600"
//                       : isActive
//                       ? "bg-blue-600"
//                       : "bg-gray-300"
//                   }`}
//                 ></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );

//   if (!orders.length)
//     return <p className="text-center mt-10">📭 No orders found.</p>;

//   return (
//     <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 rounded-2xl">
//       <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//         Company Orders
//       </h2>

//       {message && (
//         <p className="text-center mb-4 font-medium text-green-700 transition-all duration-300">
//           {message}
//         </p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.slice(0, visibleCount).map((o) => (
//           <div
//             key={o.id}
//             className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col justify-between"
//           >
//             <div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
//                 Order #{o.id}
//               </h3>
//               <p className="text-sm text-gray-600 mb-1 truncate">
//                 Customer: <strong>{o.customer_id}</strong>
//               </p>
//               <p className="text-sm text-gray-600 mb-1 truncate">
//                 Amount: <strong>{o.total_amount} JOD</strong>
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Status:{" "}
//                 <strong className="capitalize">
//                   {o.status.replace(/_/g, " ")}
//                 </strong>
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 Payment: <strong>{o.payment_status}</strong>
//               </p>
//               <p className="text-sm text-gray-600 mb-1 truncate">
//                 Address: <strong>{o.shipping_address}</strong>
//               </p>
//               <p className="text-xs text-gray-500 mt-2">
//                 {new Date(o.created_at).toLocaleString()}
//               </p>

//               {renderProgressBar(o)}
//             </div>

//             <div className="mt-4 flex gap-2">
//               {STATUS_FLOW[o.status].length > 0 && (
//                 <button
//                   onClick={() => handleNextStage(o)}
//                   disabled={updating}
//                   className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
//                 >
//                   Next Stage
//                 </button>
//               )}
//               <button
//                 onClick={() => navigate(`/delivery/dashboard/tracking/${o.id}`)}
//                 className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
//               >
//                 Track
//               </button>
//               <button
//                 onClick={() => handlePaymentUpdate(o.id)}
//                 disabled={o.payment_status === "paid"}
//                 className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
//               >
//                 Mark as Paid
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {visibleCount < orders.length && (
//         <div className="text-center mt-6">
//           <button
//             onClick={() => setVisibleCount((prev) => prev + 4)}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
//           >
//             Load More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

