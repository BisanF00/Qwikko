import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaCog,
  FaChartBar,
  FaHome,
} from "react-icons/fa";
import { FiLogOut, FiX,FiMenu } from "react-icons/fi"; // ✅ أضفنا أيقونة X للإغلاق
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/delivery/login");
  };

  // إغلاق السايدبار عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar(); // يغلق السايدبار
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white shadow-md flex flex-col justify-between overflow-hidden transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-0"
        }`}
      >
        <div
          className={`flex-1 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* الزر والشعار بنفس التنسيق */}
          {isOpen && (
            <div className="flex items-center gap-4 px-4 py-4">
              {/* زر إغلاق / السايدبار */}
              <button
                onClick={toggleSidebar}
                className="text-2xl text-gray-700 hover:text-black transition flex-shrink-0"
              >
                <FiMenu />
              </button>

              {/* الشعار */}
              <div className="text-2xl font-bold text-gray-800">Qwikko</div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col space-y-2 px-4 mt-4">
            <NavLink
              to="home"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded transition ${
                  isActive
                    ? "bg-gray-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaHome className="text-lg " />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="getProfile"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded transition ${
                  isActive
                    ? "bg-gray-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaUser className="text-lg " />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="orders"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded transition ${
                  isActive
                    ? "bg-gray-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaClipboardList className="text-lg" />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="reports"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded transition ${
                  isActive
                    ? "bg-gray-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaChartBar className="text-lg" />
              <span>Reports</span>
            </NavLink>

            <NavLink
              to="settings"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded transition ${
                  isActive
                    ? "bg-gray-200 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaCog className="text-lg" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer */}
        <div
          className={`px-4 pb-4 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-gray-700 transition w-full text-left"
          >
            <FiLogOut className="text-lg" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* مودال تسجيل الخروج */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
