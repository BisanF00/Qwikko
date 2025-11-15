import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiUserCheck } from "react-icons/fi";
import { MdEmail, MdSecurity, MdPrivacyTip } from "react-icons/md";
import { FaLock, FaRocket } from "react-icons/fa";
import { loginDelivery, clearMessages } from "./authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const isDark = useSelector((state) => state.deliveryTheme.darkMode);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // لو صار نجاح نسكّر الرسالة ونروح عالدashboard
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => {
        dispatch(clearMessages());
        navigate("/delivery/dashboard/Home");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch, navigate]);

  // أول ما يخلص اللود نرجّع زر اللوجين
  useEffect(() => {
    if (!loading) {
      setIsSubmitting(false);
    }
  }, [loading]);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(loginDelivery(formData));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      {/* خلفية متحركة زي تبعت الكستمر */}
      <div className="absolute inset-0 pointer-events-none">
        {!isDark && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/10 animate-pulse-slow"></div>
        )}

        <div className="absolute top-10 left-5 w-48 h-48 sm:w-72 sm:h-72 bg-[var(--button)]/10 rounded-full blur-2xl sm:blur-3xl animate-float-slow"></div>
        <div
          className="absolute bottom-10 right-5 w-52 h-52 sm:w-80 sm:h-80 bg-[var(--primary)]/10 rounded-full blur-2xl sm:blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-[var(--success)]/5 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        ></div>

        {!isDark && (
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        )}
      </div>

      {/* نقط طايرة */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[var(--button)]/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 xl:gap-12">
          {/* اليسار - ترحيب / لوجو */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center items-center text-center space-y-3 lg:space-y-5">
            <div className="space-y-1 lg:space-y-2">
              <div className="relative">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[var(--text)] leading-tight">
                  Welcome Back, Driver
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-[var(--button)] to-[var(--primary)] rounded-full"></div>
                  <div className="w-3 sm:w-4 h-0.5 bg-[var(--button)] rounded-full"></div>
                  <div className="w-2 h-0.5 bg-[var(--primary)] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-[var(--button)]/15 to-[var(--primary)]/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <img
                src={isDark ? "/LogoDark.png" : "/logo.png"}
                alt="Qwikko Logo"
                className="h-12 sm:h-16 lg:h-20 xl:h-24 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* وصف بسيط */}
            <div className="hidden lg:block max-w-xs sm:max-w-sm">
              <p className="text-sm text-[var(--light-gray)] leading-relaxed font-medium">
                Log in to manage delivery orders, update coverage, and stay on
                top of your shipments in real time.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1">
              {["Secure", "Fast", "Delivery"].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs text-[var(--light-gray)]"
                >
                  <span className="w-1 h-1 bg-[var(--button)] rounded-full"></span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* اليمين - الفورم */}
          <div className="w-full lg:w-3/5 max-w-xs sm:max-w-sm md:max-w-md">
            <div className="relative group">
              {/* جلو خفيف */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--button)] to-[var(--primary)] rounded-xl blur opacity-20 group-hover:opacity-30 transition-all duration-500"></div>

              <div className="relative bg-[var(--bg)]/95 backdrop-blur-lg border border-[var(--border)]/30 rounded-xl p-3 sm:p-4 md:p-5 shadow-lg transform transition-all duration-500 hover:shadow-xl">
                {/* زوايا */}
                <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-t border-r border-[var(--button)] rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-b border-l border-[var(--primary)] rounded-bl-xl"></div>

                <form
                  onSubmit={handleSubmit}
                  className="relative space-y-2 sm:space-y-3"
                >
                  {/* success / error */}
                  {successMessage && (
                    <div className="p-2 rounded-lg text-center font-semibold bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30 flex items-center justify-center gap-2">
                      <FiUserCheck className="text-xs" />
                      <span className="text-xs">{successMessage}</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-2 rounded-lg text-center font-semibold bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)]/30 flex items-center justify-center gap-2">
                      <MdSecurity className="text-xs" />
                      <span className="text-xs">{error}</span>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[var(--text)]">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <MdEmail className="text-xs text-[var(--light-gray)]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full bg-[var(--bg)]/50 text-[var(--text)] border border-[var(--border)]/50 rounded-lg pl-7 pr-2 py-2 focus:border-[var(--button)] focus:ring-1 focus:ring-[var(--button)]/10 outline-none transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[var(--text)]">
                      Password
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaLock className="text-xs text-[var(--light-gray)]" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="w-full bg-[var(--bg)]/50 text-[var(--text)] border border-[var(--border)]/50 rounded-lg pl-7 pr-7 py-2 focus:border-[var(--button)] focus:ring-1 focus:ring-[var(--button)]/10 outline-none transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword((s) => !s)}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-all duration-300 ${
                          isDark
                            ? "text-[var(--light-gray)] hover:text-[var(--text)] hover:bg-[var(--border)]/30"
                            : "text-[var(--light-gray)] hover:text-[var(--text)] hover:bg-gray-100"
                        }`}
                      >
                        {showPassword ? (
                          <FiEyeOff size={10} />
                        ) : (
                          <FiEye size={10} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* remember + forgot */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                    <div className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        id="remember"
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded transition-all duration-300 cursor-pointer appearance-none border
                        ${
                          isDark
                            ? "border-[var(--border)] bg-[var(--textbox)] checked:bg-[var(--button)] checked:border-[var(--button)]"
                            : "border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500"
                        }`}
                      />
                      <label
                        htmlFor="remember"
                        className={`ml-1 text-xs transition-all duration-300 cursor-pointer ${
                          isDark ? "text-[var(--light-gray)]" : "text-gray-600"
                        }`}
                      >
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      className={`text-xs font-semibold transition-all duration-500 ${
                        isDark
                          ? "text-[var(--button)] hover:text-purple-400"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                      onClick={() => navigate("/delivery/forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* زر الدخول */}
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full relative px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold text-white bg-gradient-to-r from-[var(--button)] to-[var(--primary)] border-0 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn overflow-hidden text-xs sm:text-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        {loading || isSubmitting ? (
                          <>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Logging in...</span>
                          </>
                        ) : (
                          <>
                            <FaRocket className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span>Enter Delivery Panel</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Register */}
                  <p
                    className={`text-center transition-colors duration-500 py-1 text-xs ${
                      isDark ? "text-[var(--light-gray)]" : "text-gray-600"
                    }`}
                  >
                    Don't have an account?{" "}
                    <span
                      className={`cursor-pointer font-bold transition-all duration-500 ${
                        isDark
                          ? "text-[var(--button)] hover:text-purple-400"
                          : "text-blue-600 hover:text-blue-800"
                      } hover:underline inline-flex items-center gap-1`}
                      onClick={() => navigate("/delivery/register")}
                    >
                      Register
                    </span>
                  </p>

                  {/* Privacy / Terms (لو بدك تبقيهم) */}
                  <div
                    className={`flex justify-center gap-2 text-xs transition-colors duration-500 ${
                      isDark ? "text-[var(--light-gray)]" : "text-gray-500"
                    }`}
                  >
                    <button
                      onClick={() => navigate("/privacy-policy")}
                      className={`transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                        isDark
                          ? "hover:text-[var(--button)]"
                          : "hover:text-blue-600"
                      }`}
                    >
                      <MdPrivacyTip className="w-2 h-2 sm:w-3 sm:h-3" />
                      Privacy
                    </button>
                    <span
                      className={
                        isDark ? "text-[var(--border)]" : "text-gray-300"
                      }
                    >
                      •
                    </span>
                    <button
                      onClick={() => navigate("/terms-of-service")}
                      className={`transition-all duration-300 hover:scale-105 flex items-center gap-1 ${
                        isDark
                          ? "hover:text-[var(--button)]"
                          : "hover:text-blue-600"
                      }`}
                    >
                      <MdPrivacyTip className="w-2 h-2 sm:w-3 sm:h-3" />
                      Terms
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نفس الأنيميشنات اللي استعملتيها */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-15px) translateX(5px);
          }
          66% {
            transform: translateY(10px) translateX(-5px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.02);
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
