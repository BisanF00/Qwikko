import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaCog,
  FaChartBar,
  FaHome,
  FaComments,
  FaChartPie,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../auth/authSlice";
import { useState } from "react";

export default function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((s) => s.deliveryTheme.darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/delivery/login");
  };

  const itemBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200";
  const itemStyle = ({ isActive }) =>
    `${itemBase} ${
      isActive
        ? "bg-[var(--hover)]  font-semibold"
        : "hover:bg-[var(--hover)]"
    } text-[var(--text)]`;

  return (
    <>
      <aside
        className="fixed top-0 left-0 h-screen w-72 bg-[var(--bg)] border-r border-[var(--border)] shadow-xl flex flex-col z-50"
        style={{ color: "var(--text)" }}
      >
        {/* Header (لوجو فقط) */}
        <div className="flex items-center justify-center px-4 py-5 border-b border-[var(--border)]">
          <img
            src={isDarkMode ? "/darklogo.png" : "/logo.png"}
            alt="Qwikko Logo"
            className="h-10"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <NavLink to="home" className={itemStyle}>
              <FaChartPie /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="getProfile" className={itemStyle}>
              <FaUser /> <span>Profile</span>
            </NavLink>
            <NavLink to="orders" className={itemStyle}>
              <FaClipboardList /> <span>Orders</span>
            </NavLink>
            <NavLink to="chat" className={itemStyle}>
              <FaComments /> <span>Chats</span>
            </NavLink>
            {/* <NavLink to="reports" className={itemStyle}>
              <FaChartBar /> <span>Reports</span>
            </NavLink> */}
            <NavLink to="settings" className={itemStyle}>
              <FaCog /> <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-[var(--border)]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-[var(--text)]"
            style={{
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--error)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text)";
            }}
          >
            <FiLogOut className="text-lg" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* مودال تسجيل الخروج */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-lg font-semibold border border-[var(--error)] text-[var(--error)] hover:opacity-90"
                style={{ background: "var(--bg)" }}
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full px-4 py-2 rounded-lg font-semibold border border-[var(--border)] hover:bg-[var(--hover)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
