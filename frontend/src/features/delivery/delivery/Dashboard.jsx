// DashboardLayout.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
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
  const location = useLocation(); 
  const { user } = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.deliveryAuth?.user);
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);
  const isChatPage = location.pathname.includes('/chat');
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
      {/* سايدبار */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* صفحة كاملة — عليها السكول */}
      <div
        id="page"
        className="flex-1 flex flex-col transition-all duration-300  overscroll-contain"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {/* نافبار */}
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          user={user || { name: "Guest" }}
        />

        {/* المحتوى */}
        <main
          className="flex-1 p-6 "
          style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
        >
          <Outlet />
        </main>

        {/* الفوتر */}
        {!isChatPage && (
          <div className="relative z-10 mt-auto">
            <Footer />
          </div>
        )}

        {/* زر الشاتبوت */}
        <button
          onClick={toggleChat}
          className="chat-button fixed bottom-8 right-4 md:right-6 p-4 rounded-full shadow-lg transition flex items-center justify-center z-40"
          style={{
            backgroundColor: "var(--button)",
            color: "#fff",
          }}
          title="Open Qwikko Chatbot"
          aria-label="Open Qwikko Chatbot"
        >
          <FaRobot size={28} />
        </button>

        {/* نافذة الشات */}
        {isChatOpen && (
          <div
            className="
      fixed bottom-4 right-4
      w-[350px] h-[510px]
      rounded-2xl shadow-2xl
      flex flex-col overflow-hidden
      z-[9999]
    "
            style={{
              backgroundColor: "var(--div)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {/* زر الإغلاق */}
            <button
              onClick={toggleChat}
              className="absolute top-3 right-3 z-10 p-1 rounded-lg hover:bg-red-500/20 transition"
              style={{ color: "var(--light-gray)" }}
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>

            {/* الهيدر */}
            <h2
              className="text-sm font-semibold flex items-center gap-2 px-4 py-3 pr-10"
              style={{
                backgroundColor: isDarkMode
                  ? "var(--mid-dark)"
                  : "var(--textbox)",
              }}
            >
              <FaRobot size={18} />
              Qwikko Chatbot
            </h2>

            {/* محتوى الشات */}
            <div className="flex-1 overflow-hidden">
              <ChatBot userId={currentUser?.id || "guest"} />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

}
