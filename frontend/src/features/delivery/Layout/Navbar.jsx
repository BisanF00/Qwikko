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
import notificationAPI from "../notification/notificatationAPI";

export default function Navbar({
  isSidebarOpen,
  toggleSidebar,
  user,
  onToggleTheme,
  isDarkMode,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 📬 جلب الإشعارات وعدد الغير مقروءة
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

  // ✅ تعليم كل الإشعارات كمقروءة
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
      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow px-6 py-4 flex justify-between items-center relative z-50">
      {/* زر القائمة واللوغو */}
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-700 hover:text-black transition flex-shrink-0"
          >
            <FiMenu />
          </button>
        )}
        <div
          className={`text-2xl font-bold text-gray-800 transition-opacity ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          Qwikko
        </div>
      </div>

      {/* أيقونات اليمين */}
      <div className="flex items-center gap-4">
        {/* الإشعارات */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(true)}
            className="text-2xl text-gray-600 hover:text-black transition relative"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
              <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-[900px] max-h-[70vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={markAllAsRead}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Mark All as Read
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications yet.</p>
                ) : (
                  <ul>
                    {notifications.length === 0 && (
                      <li className="p-4 text-gray-500">No notifications</li>
                    )}
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`p-4 border-b flex justify-between items-start hover:bg-gray-50 ${
                          !n.read_status ? "bg-blue-50" : ""
                        }`}
                      >
                        <div>
                          <h4 className="font-medium">{n.title}</h4>
                          <p className="text-sm text-gray-600">{n.message}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(n.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* زر Mark as Read لكل إشعار */}
                        {!n.read_status && (
                          <button
                            onClick={async () => {
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

                                // تحديث الحالة محليًا
                                setNotifications((prev) =>
                                  prev.map((notif) =>
                                    notif.id === n.id
                                      ? { ...notif, read_status: true }
                                      : notif
                                  )
                                );
                                setUnreadCount((prev) => Math.max(prev - 1, 0));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="ml-4 inline-flex text-blue-900 hover:text-blue-800 text-sm items-center gap-1 z-10"
                          >
                            <FiCheck /> Mark as read
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {notifications.length > visibleCount && (
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 5)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown المستخدم */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          >
            {getAvatar()}
            <span className="font-medium text-gray-700">
              {user?.company_name || "Guest"}
            </span>
            <FiChevronDown
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/delivery/dashboard/getProfile");
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                <FiUser className="text-gray-600" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onToggleTheme();
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-100 transition"
              >
                {isDarkMode ? (
                  <>
                    <FiSun className="text-yellow-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="text-gray-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
