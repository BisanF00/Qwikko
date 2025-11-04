import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaRobot,
} from "react-icons/fa";
import { fetchLandingCMS } from "./Api/LandingAPI";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "./deliveryThemeSlice";
import ChatBot from "../Layout/ChatBot";
import { X } from "lucide-react";

export default function LandingPage() {
  const [cmsContent, setCmsContent] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const isDark = useSelector((state) => state.deliveryTheme.darkMode);
  const dispatch = useDispatch();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((v) => !v);

  useEffect(() => {
    async function loadCMS() {
      const data = await fetchLandingCMS("delivery", "Landing Page");
      setCmsContent(data);
      if (data?.content) {
        const parts = data.content.split("@");
        setTitle(parts[0]?.trim() || "");
        setSubtitle(parts[1]?.trim() || "");
      }
    }
    loadCMS();
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("deliveryTheme");
    dispatch(setTheme(savedTheme === "dark"));
  }, [dispatch]);

  return (
    <>
      {/* ===== HERO ===== */}
      <div
        className="min-h-screen flex flex-col items-center"
        style={{
          backgroundColor: "transparent", // ✅ الخلفية العامة صارت شفافة
          color: "var(--text)",
        }}
      >
        <div
          className="
      w-full max-w-7xl mx-auto
      flex flex-col md:grid md:grid-cols-2 items-center gap-12
      p-10 pt-12 rounded-2xl relative overflow-hidden shadow-lg
    "
          style={{
            backgroundColor: isDark ? "#313131" : "#f5f6f5", // ✅ الكارد فقط عليه اللون
            color: "var(--text)",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          {/* الصورة */}
          <div className="order-2 md:order-1 flex items-center justify-center w-full h-full">
            {cmsContent?.image_url ? (
              <img
                src={cmsContent.image_url}
                alt="Landing visual"
                className="w-full h-full object-cover rounded-xl shadow-md"
                style={{ maxHeight: "100%", borderRadius: "1rem" }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--hover)", minHeight: "400px" }}
              >
                Loading image...
              </div>
            )}
          </div>

          {/* النصوص */}
          <div className="order-1 md:order-2 flex flex-col items-center justify-center text-center space-y-5 w-full">
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
              style={{ color: "var(--text)", lineHeight: "1.2" }}
            >
              {title || "Welcome to Qwikko Delivery"}
            </h1>

            {subtitle && (
              <h6
                className="text-base md:text-lg leading-relaxed max-w-2xl"
                style={{ color: "var(--light-gray)" }}
              >
                {subtitle}
              </h6>
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                to="/delivery/login"
                className="inline-block px-10 py-4 rounded-lg text-lg font-semibold shadow-md transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
                style={{
                  backgroundColor: "var(--button)",
                  color: "#ffffff",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                }}
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="w-full max-w-6xl p-10 mt-16 text-center mx-auto">
        <h2
          className="text-4xl font-bold mb-16"
          style={{ color: isDark ? "#ffffff" : "#026a4b" }}
        >
          How It Works
        </h2>

        {/* غلاف الشبكة + الخط + الأرقام خارج الكروت */}
        <div className="relative">
          {/* الخط الواصل */}
          <div
            className="hidden md:block absolute left-0 right-0 h-[3px]"
            style={{
              top: "28px",
              backgroundColor: isDark ? "#ffffff" : "#026a4b",
              opacity: 0.3,
            }}
          />

          {/* صف الأرقام خارج الكروت */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-6">
            {["1", "2", "3"].map((step, idx) => (
              <div key={idx} className="flex justify-center">
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full text-lg font-bold z-10"
                  style={{
                    backgroundColor: "var(--button)",
                    color: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* الكروت (بدون أرقام داخلها) */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-16 justify-items-center"
            style={{
              backgroundColor: "transparent",
              color: isDark ? "var(--text)" : "var(--button)",
            }}
          >
            {[
              {
                title: "Register your company",
                desc: "Sign up quickly and create your business account.",
              },
              {
                title: "Set up your delivery zones",
                desc: "Define the areas where your company will operate and deliver.",
              },
              {
                title: "Start receiving orders",
                desc: "Track and deliver orders smoothly and grow your business.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center"
                style={{
                  width: "100%",
                  maxWidth: "22rem",
                  backgroundColor: isDark ? "#313131" : "#f5f6f5",
                  color: isDark ? "#ffffff" : "#026a4b",
                  borderRadius: "1rem",
                  border: `1px solid ${
                    isDark ? "var(--border)" : "var(--button)"
                  }`,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  padding: "2rem",
                }}
              >
                <p className="text-xl font-semibold mb-3">{item.title}</p>
                <p
                  className="text-sm leading-relaxed opacity-90"
                  style={{ color: isDark ? "#ffffff" : "#026a4b" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BENEFITS ===== */}
      <div className="w-full max-w-6xl p-10 mt-16 mb-24 text-center mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-16"
          style={{ color: isDark ? "#ffffff" : "#026a4b" }}
        >
          Benefits
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 justify-items-center">
          {[
            { Icon: FaClipboardList, text: "Manage orders easily" },
            { Icon: FaChartLine, text: "Accurate reports and statistics" },
            { Icon: FaUsers, text: "Reach thousands of customers & stores" },
            { Icon: FaDollarSign, text: "Guaranteed and fast payments" },
          ].map(({ Icon, text }, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center"
              style={{
                width: "100%",
                maxWidth: "18rem",
                backgroundColor: isDark ? "#313131" : "#f5f6f5",
                color: "var(--text)",
                borderRadius: "1rem",
                border: `1px solid ${
                  isDark ? "var(--border)" : "var(--button)"
                }`,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                padding: "2rem",
                minHeight: "15rem",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{
                  backgroundColor: "var(--button)",
                  color: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <Icon className="text-3xl" />
              </div>
              <p className="text-base font-semibold leading-relaxed opacity-95">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CHATBOT ===== */}
      <button
        onClick={toggleChat}
        className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg flex items-center justify-center z-50 transition hover:scale-105"
        style={{
          backgroundColor: "var(--button)",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          border: "none",
        }}
        title="Open Qwikko Chatbot"
        aria-label="Open Qwikko Chatbot"
      >
        <FaRobot size={28} />
      </button>

      {isChatOpen && (
        <div
          className="fixed top-4 right-4 sm:right-6 z-50 w-full sm:w-96 h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--div)", color: "var(--text)" }}
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
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            <FaRobot size={22} style={{ color: "var(--text)" }} />
            Qwikko Chatbot
          </h2>

          <div
            className="flex-grow overflow-auto p-2"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <ChatBot userId="guest" />
          </div>
        </div>
      )}
    </>
  );
}
