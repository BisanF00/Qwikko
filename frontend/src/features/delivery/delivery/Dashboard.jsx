// DashboardLayout.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import ChatBot from "../Layout/ChatBot";
import { setUserFromToken } from "../auth/authSlice";
import { fetchDeliveryProfile } from "./Api/DeliveryAPI";
import { X } from "lucide-react";
import { FaRobot } from "react-icons/fa";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.deliveryAuth?.user);
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      fetchDeliveryProfile(savedToken)
        .then((fetchedData) => {
          dispatch(
            setUserFromToken({
              user: fetchedData.company,
              token: savedToken,
            })
          );
        })
        .catch((err) => {
          console.error("Failed to fetch user from token:", err);
          localStorage.removeItem("token");
        });
    }
  }, [dispatch]);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleChat = () => setIsChatOpen((v) => !v);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className="flex min-h-screen w-full"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {/* سايدبار يطفو فوق المحتوى بدون ما يزحزحو */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* محتوى الصفحة الطبيعي: ما في ml-64 أبداً */}
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
        >
          {/* نافبار عادي ضمن الفلو (مش sticky / مش fixed) */}
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            user={user || { name: "Guest" }}
          />

          {/* المحتوى */}
          <main
            className="flex-1 p-6 overflow-auto"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
          >
            <Outlet />
          </main>

          {/* فوتر عادي ضمن الفلو */}
          <Footer />

          {/* زر الشات */}
          <button
            onClick={toggleChat}
            className="fixed bottom-16 right-6 p-4 rounded-full shadow-lg transition flex items-center justify-center z-50"
            style={{
              backgroundColor: "var(--button)",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              border: "none",
            }}
            title="Open Qwikko Chatbot"
            aria-label="Open Qwikko Chatbot"
          >
            <FaRobot size={28} />
          </button>

          {/* نافذة الشات */}
          {isChatOpen && (
            <div
              className="fixed top-4 right-4 sm:right-6 z-50 w-full sm:w-96 h-[90vh] sm:h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{
                backgroundColor: "var(--div)",
                color: "var(--text)",
              }}
            >
              <button
                onClick={toggleChat}
                className="absolute top-4 right-4 z-10"
                style={{ color: "var(--light-gray)" }}
                title="Close"
                aria-label="Close chatbot"
              >
                <X size={24} />
              </button>

              <h2
                className="text-base font-semibold flex items-center gap-2 px-4 py-3"
                style={{
                  backgroundColor: isDarkMode
                    ? "var(--mid-dark)"
                    : "var(--textbox)",
                  color: "var(--text)",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                }}
              >
                <FaRobot
                  size={26}
                  style={{ color: isDarkMode ? "#ffffff" : "#292e2c" }}
                />
                Qwikko Chatbot
              </h2>

              <div
                className="flex-grow overflow-auto p-2"
                style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
              >
                <ChatBot userId={currentUser?.id || "guest"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
