import React, { useEffect, useState } from "react";

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  // تحميل الإعدادات من localStorage عند بدء الصفحة
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedNotifications = localStorage.getItem("notifications");

    if (savedTheme) setTheme(savedTheme);
    if (savedNotifications) setNotifications(savedNotifications === "true");
  }, []);

  // تحديث localStorage عند تغير الإعدادات
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", notifications);
  }, [theme, notifications]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* اختيار الثيم */}
      <div className="flex items-center space-x-4">
        <label className="font-semibold">Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* تفعيل الإشعارات */}
      <div className="flex items-center space-x-4">
        <label className="font-semibold">Notifications:</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      <div className="mt-4 text-gray-500">
        {/* عرض الإعدادات الحالية */}
        <p>Current Theme: {theme}</p>
        <p>Notifications: {notifications ? "On" : "Off"}</p>
      </div>
    </div>
  );
};

export default SettingsPage;
