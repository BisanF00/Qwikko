// src/features/delivery/delivery/OrdersList.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCompanyOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
} from "./Api/DeliveryAPI";
import { FaBox, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

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
  const [orders, setOrders] = useState([]); // كل ما جُلب حتى الآن (append)
  const [loading, setLoading] = useState(true); // الشحنة الأولى
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");

  // ✅ خلّيه ثابت ومتناسق بكل الطلبات
  const [limit] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });

  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.deliveryTheme?.darkMode);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCompanyOrders({ page: 1, limit }); // نفس limit
        console.log("Orders first page:", data);
        setOrders(data.orders || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit,
            total: (data.orders || []).length,
            totalPages: 1,
            hasMore: false,
          }
        );
        setPage(1);
      } catch (err) {
        console.error(err);
        setMessage("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  // 🔢 تحميل صفحة محددة (استبدال القائمة بدل append)
  const loadSpecificPage = async (pageNum) => {
    if (pageNum < 1 || pageNum > (pagination.totalPages || 1)) return;
    try {
      setLoading(true);
      const data = await fetchCompanyOrders({ page: pageNum, limit });
      setOrders(data.orders || []);
      const pg = data.pagination || {
        page: pageNum,
        limit,
        total: (data.orders || []).length,
        totalPages: 1,
        hasMore: false,
      };
      setPagination(pg);
      setPage(pg.page || pageNum);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load More من السيرفر (append)
  const loadMore = async () => {
    if (!pagination.hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchCompanyOrders({ page: nextPage, limit });
      setOrders((prev) => [...prev, ...(data.orders || [])]);
      const pg = data.pagination || pagination;
      setPagination(pg);
      setPage(pg.page || nextPage);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // فلترة محليّة
  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const openStatusModal = (orderId, status) => {
    setCurrentOrderId(orderId);
    setCurrentStatus(status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    const nextStatuses = STATUS_FLOW[currentStatus] || [];
    if (nextStatuses.length === 0) return;
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
            ? { ...o, payment_status: result.order?.payment_status ?? "PAID" }
            : o
        )
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="w-10 h-10 border-[6px] rounded-full animate-spin"
          style={{
            borderColor: "var(--button)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <p className="text-center mt-10" style={{ color: "var(--text)" }}>
        {message || "No orders found."}
      </p>
    );
  }

  return (
    <div
      className="w-full mx-auto mt-10 p-6 rounded-2xl"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        <FaBox className="text-3xl" style={{ color: "var(--text)" }} /> Company
        Orders
      </h2>

      {message && (
        <p
          className="text-center mb-4 font-medium transition-all duration-300"
          style={{ color: "var(--text)" }}
        >
          {message}
        </p>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {Object.keys(STATUS_LABELS).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-4 py-1 rounded-2xl transition-all duration-300 border shadow-md"
            style={{
              backgroundColor:
                filter === key ? "var(--button)" : "var(--textbox)",
              color: filter === key ? "#ffffff" : "var(--text)",
              borderColor: filter === key ? "var(--button)" : "var(--border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                filter === key ? "var(--button-hover)" : "var(--hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                filter === key ? "var(--button)" : "var(--textbox)";
            }}
          >
            {STATUS_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((o) => (
          <div
            key={o.id}
            className="p-5 rounded-2xl shadow-md flex flex-col justify-between"
            style={{ backgroundColor: "var(--textbox)" }}
          >
            <div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text)" }}
              >
                Order #{o.id}
              </h3>

              <p className="text-sm mb-1" style={{ color: "var(--text)" }}>
                Customer:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {o.customer_id}
                </strong>
              </p>

              <p className="text-sm mb-1" style={{ color: "var(--text)" }}>
                Amount:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {o.total_amount} $
                </strong>
              </p>

              <p className="text-sm mb-1" style={{ color: "var(--text)" }}>
                Status:{" "}
                <strong className="capitalize" style={{ color: "var(--text)" }}>
                  {o.status.replace(/_/g, " ")}
                </strong>
              </p>

              <p className="text-sm mb-1" style={{ color: "var(--text)" }}>
                Payment:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {o.payment_status}
                </strong>
              </p>

              <p className="text-xs mt-2" style={{ color: "var(--text)" }}>
                Ordered At : {new Date(o.created_at).toLocaleString()}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {STATUS_FLOW[o.status]?.length > 0 && (
                <button
                  onClick={() => openStatusModal(o.id, o.status)}
                  className="flex-1 py-2 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: "var(--button)", color: "#ffffff" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--button-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--button)")
                  }
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              )}

              <button
                onClick={() => navigate(`/delivery/dashboard/tracking/${o.id}`)}
                className="flex-1 py-2 rounded-lg transition-all duration-300"
                style={{ backgroundColor: "var(--button)", color: "#ffffff" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--button-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--button)")
                }
              >
                Track
              </button>

              <button
                onClick={() => handlePaymentUpdate(o.id)}
                disabled={(o.payment_status || "").toLowerCase() === "paid"}
                className="py-1 px-3 rounded transition-all duration-300"
                style={{
                  backgroundColor: "var(--button)",
                  color: "#ffffff",
                  opacity:
                    (o.payment_status || "").toLowerCase() === "paid" ? 0.5 : 1,
                  cursor:
                    (o.payment_status || "").toLowerCase() === "paid"
                      ? "not-allowed"
                      : "pointer",
                }}
                onMouseEnter={(e) => {
                  if ((o.payment_status || "").toLowerCase() !== "paid") {
                    e.currentTarget.style.backgroundColor =
                      "var(--button-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if ((o.payment_status || "").toLowerCase() !== "paid") {
                    e.currentTarget.style.backgroundColor = "var(--button)";
                  }
                }}
              >
                Mark as Paid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer (النص القديم) */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-sm" style={{ color: "var(--text)" }}>
          Page {pagination.page} of {pagination.totalPages} — {pagination.total}{" "}
          orders
        </span>
      </div>

      {/* 🔘 Pagination Buttons */}
      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => loadSpecificPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 rounded-lg border transition-all duration-300"
          style={{
            backgroundColor: page <= 1 ? "var(--textbox)" : "var(--button)",
            color: page <= 1 ? "var(--light-gray)" : "#fff",
            cursor: page <= 1 ? "not-allowed" : "pointer",
          }}
        >
          Prev
        </button>

        {Array.from(
          { length: pagination.totalPages || 1 },
          (_, i) => i + 1
        ).map((num) => (
          <button
            key={num}
            onClick={() => loadSpecificPage(num)}
            className="px-3 py-1 rounded-lg border transition-all duration-300"
            style={{
              backgroundColor:
                num === page ? "var(--button)" : "var(--textbox)",
              color: num === page ? "#fff" : "var(--text)",
              borderColor: num === page ? "var(--button)" : "var(--border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                num === page ? "var(--button-hover)" : "var(--hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                num === page ? "var(--button)" : "var(--textbox)";
            }}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => loadSpecificPage(page + 1)}
          disabled={page >= (pagination.totalPages || 1)}
          className="px-3 py-1 rounded-lg border transition-all duration-300"
          style={{
            backgroundColor:
              page >= (pagination.totalPages || 1)
                ? "var(--textbox)"
                : "var(--button)",
            color:
              page >= (pagination.totalPages || 1)
                ? "var(--light-gray)"
                : "#fff",
            cursor:
              page >= (pagination.totalPages || 1) ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>

      {/* Load More (تبقى كما هي) */}
      {pagination.hasMore && (
        <div className="text-center mt-3">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: "var(--button)",
              color: "#ffffff",
              opacity: loadingMore ? 0.7 : 1,
            }}
            onMouseEnter={(e) =>
              !loadingMore &&
              (e.currentTarget.style.backgroundColor = "var(--button-hover)")
            }
            onMouseLeave={(e) =>
              !loadingMore &&
              (e.currentTarget.style.backgroundColor = "var(--button)")
            }
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--textbox)",
              color: "var(--text)",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              width: "24rem",
              position: "relative",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close"
              title="Close"
            >
              <FaTimes size={20} style={{ color: "var(--text)" }} />
            </button>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "var(--text)",
              }}
            >
              Edit Order Status
            </h3>

            <p style={{ marginBottom: "1rem", color: "var(--text)" }}>
              Current status:{" "}
              <strong>{currentStatus.replace(/_/g, " ")}</strong>
            </p>

            {STATUS_FLOW[currentStatus]?.length > 0 ? (
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                style={{
                  width: "100%",
                  padding: "0.5rem 0",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  color: "#fff",
                  backgroundColor: updating
                    ? "var(--light-gray)"
                    : "var(--button)",
                  cursor: updating ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!updating)
                    e.currentTarget.style.backgroundColor =
                      "var(--button-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!updating)
                    e.currentTarget.style.backgroundColor = "var(--button)";
                }}
              >
                {updating
                  ? "Updating..."
                  : `Change Status to ${STATUS_FLOW[currentStatus][0]
                      .replace(/_/g, " ")
                      .toUpperCase()}`}
              </button>
            ) : (
              <p style={{ color: "var(--light-gray)", textAlign: "center" }}>
                No further status change allowed.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
