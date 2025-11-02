import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiChevronDown,
  FiBell,
  FiMoon,
  FiSun,
  FiUser,
  FiCheck,
} from "react-icons/fi";
import { FaUser, FaBell } from "react-icons/fa";
import notificationAPI from "../notification/notificatationAPI";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../delivery/deliveryThemeSlice";
import { formatInTimeZone } from "date-fns-tz";


export default function Navbar({ isSidebarOpen, toggleSidebar, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  // ✅ وحّدنا نظام الألوان مع الكستمر (يدعم dark)
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  // ✅ جلب الإشعارات وعدّاد غير المقروء
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifs = await notificationAPI.getNotifications(token);
        setNotifications(notifs);
        const count = await notificationAPI.getUnreadCount(token);
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  // ✅ تعليم إشعار واحد كمقروء
  const markAsRead = async (id) => {
    try {
      await notificationAPI.markRead([id], token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ تعليم الكل كمقروء
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.read_status)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;
      await notificationAPI.markRead(unreadIds, token);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_status: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Avatar متوافق مع الألوان
  const getAvatar = () => {
    if (user?.avatarUrl)
      return (
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      );

    const initials = user?.company_name
      ? user.company_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "GU";

    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
        style={{
          backgroundColor: "var(--div)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        {initials}
      </div>
    );
  };

  // يعرض الوقت بتوقيت عمّان بصيغة: Nov 01, 2025 at 03:45 PM
  const formatNotifTime = (ts) => {
    const raw = ts ?? null;
    const d = raw ? new Date(raw) : null;
    if (!d || isNaN(d)) return "";
    return formatInTimeZone(d, "Asia/Amman", "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 px-6 py-2 flex justify-between items-center relative z-50 shadow-md bg-[var(--bg)]"
      style={{ color: "var(--text)" }}
    >
      {/* زر القائمة + اللوغو */}
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="text-2xl transition-colors duration-200 hover:text-[var(--primary)]"
            style={{ color: "var(--text)" }}
          >
            <FiMenu />
          </button>
        )}

        <div
          className={`text-2xl font-bold transition-opacity ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="py-2 flex items-center">
            <img
              src={isDarkMode ? "/darklogo.png" : "/logo.png"}
              alt="Qwikko Logo"
              className="h-9"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-md transition-colors duration-200 bg-[var(--bg)] "
            style={{ color: "var(--text)" }}
          >
            <FaUser className="text-[var(--text)]" />
            <span className="font-medium">{user?.company_name || "Guest"}</span>
            <FiChevronDown
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              style={{ color: "var(--text)" }}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg border bg-[var(--bg)]"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              {/* Profile */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/delivery/dashboard/getProfile");
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-[var(--hover)]"
                style={{ color: "var(--text)" }}
              >
                <FiUser />
                <span>Profile</span>
              </button>

              {/* Toggle Theme */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  dispatch(toggleTheme());
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-[var(--hover)]"
                style={{ color: "var(--text)" }}
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
                <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          )}
        </div>

        {/* ===== Notifications (Customer-like design, fixed) ===== */}
        <div className="relative">
          <button
            onClick={async () => {
              setShowNotifications((prev) => !prev);
              if (!showNotifications) {
                try {
                  const res = await fetch(
                    "http://localhost:3000/api/notifications",
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  if (!res.ok) throw new Error("Failed to fetch notifications");
                  const data = await res.json();
                  setNotifications(data);
                } catch (err) {
                  console.error("Error fetching notifications:", err);
                }
              }
            }}
            className="text-2xl transition-colors duration-200 hover:text-[var(--primary)]"
            style={{ color: "var(--text)" }}
            aria-label="Notifications"
            title="Notifications"
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--error)] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-0 z-[999] flex items-start justify-end">
              <div
                className="absolute inset-0 z-0  backdrop-blur-sm"
                onClick={() => setShowNotifications(false)}
              />

              {/* Panel */}
              <div
                className="relative z-10 mt-16 mr-4 bg-[var(--bg)] rounded-xl shadow-2xl w-[380px] max-h-[75vh] overflow-hidden border"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className="px-5 py-4 border-b bg-[var(--bg)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FaBell /> Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-[var(--primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-lg font-bold opacity-70 hover:opacity-100"
                      style={{ color: "var(--text)" }}
                      aria-label="Close notifications"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-[55vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-12 px-6 text-center text-[var(--light-gray)]">
                      No notifications yet.
                    </div>
                  ) : (
                    <ul
                      className="divide-y"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {notifications.slice(0, visibleCount).map((n) => {
                        const isUnread = !n.read_status;
                        const ts =
                          n.created_at ??
                          n.createdAt ??
                          n.timestamp ??
                          Date.now();

                        return (
                          <li
                            key={n.id}
                            onClick={async () => {
                              // الضغط على الإشعار = تعليم مقروء وتحديث الحالة+العداد
                              if (isUnread) {
                                try {
                                  const res = await fetch(
                                    "http://localhost:3000/api/notifications/mark-read",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({ ids: [n.id] }),
                                    }
                                  );
                                  if (!res.ok)
                                    throw new Error(
                                      "Failed to mark notification as read"
                                    );
                                  await res.json();
                                  setNotifications((prev) =>
                                    prev.map((notif) =>
                                      notif.id === n.id
                                        ? { ...notif, read_status: true }
                                        : notif
                                    )
                                  );
                                  setUnreadCount((prev) =>
                                    Math.max(prev - 1, 0)
                                  );
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className={`p-4 transition-colors duration-200 cursor-pointer hover:bg-[var(--hover)] ${
                              isUnread ? "border-l-4" : ""
                            }`}
                            style={{
                              borderLeftColor: isUnread
                                ? "var(--primary)"
                                : "transparent",
                              background: isUnread
                                ? "color-mix(in oklab, var(--primary) 5%, transparent)"
                                : "transparent",
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p
                                  className="font-semibold text-sm"
                                  style={{
                                    color: isUnread
                                      ? "var(--primary)"
                                      : "var(--text)",
                                  }}
                                >
                                  {n.title}
                                </p>
                                <p className="text-sm opacity-80 break-words">
                                  {n.message}
                                </p>
                                <div className="mt-2 text-xs text-[var(--light-gray)]">
                                  {formatInTimeZone(
                                    new Date(ts),
                                    "Asia/Amman",
                                    "MMM dd, yyyy 'at' hh:mm a"
                                  )}
                                </div>
                              </div>

                              {/* Badge بدل زر Mark as read */}
                              {isUnread && (
                                <span className="flex-shrink-0 bg-[var(--primary)] text-white text-[10px] px-2 py-0.5 rounded-full h-5 leading-5">
                                  New
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > visibleCount && (
                  <div className="px-5 py-3 border-t bg-[var(--bg)] flex justify-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 5)}
                      className="px-4 py-2 rounded-lg font-medium transition hover:scale-[1.02] active:scale-95"
                      style={{ background: "var(--button)", color: "#fff" }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
