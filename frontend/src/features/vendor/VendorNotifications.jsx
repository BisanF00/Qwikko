import { useEffect, useState } from "react";
import { fetchNotifications } from "./VendorAPI2";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // How many notifications to display

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications(); // 🔹 Fetch all notifications
      setNotifications(data);
    };
    loadNotifications();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5); // Show 5 more on each click
  };

  const visibleNotifications = notifications.slice(0, visibleCount);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Notifications</h2>
      {notifications.length > 0 ? (
        <>
          <ul className="space-y-3">
            {visibleNotifications.map((notif, idx) => (
              <li
                key={idx}
                className="p-3 border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <p className="font-medium">{notif.title || "No Title"}</p>
                <p className="text-gray-600 text-sm">{notif.message}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          {/* 🔹 Load More button */}
          {visibleCount < notifications.length && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">No notifications available</p>
      )}
    </div>
  );
}
