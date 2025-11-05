import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { loginDelivery, clearMessages } from "./authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ نفس الـ state والوظائف كما هي — ما غيّرتها
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginDelivery(formData));
  };

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => {
        dispatch(clearMessages());
        navigate("/delivery/dashboard/Home");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch, navigate]);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500
      ${
        isDarkMode
          ? "bg-[var(--bg)] text-[var(--text)]"
          : "bg-[var(--bg)] text-[var(--text)]"
      }`}
    >
      {/* Left Section - Login Form (نفس ستايل الكستمر) */}
      <div
        className={`w-1/2 flex flex-col justify-center items-center p-12 transition-colors duration-500
        ${isDarkMode ? "bg-[var(--div)]" : "bg-[var(--bg)]"}`}
      >
        <h2 className="text-3xl font-bold mb-6">Delivery Login</h2>

        {/* Success / Info Message */}
        {successMessage && (
          <div
            className={`w-full max-w-md p-3 rounded-lg mb-4 text-center transition-colors duration-300
            ${
              isDarkMode
                ? "bg-[var(--success)] bg-opacity-20 text-green-200"
                : "bg-[var(--success)] bg-opacity-20 text-green-700"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className={`w-full max-w-md p-3 rounded-lg mb-4 text-center transition-colors duration-300
            ${
              isDarkMode
                ? "bg-[var(--error)] bg-opacity-20 text-red-200"
                : "bg-[var(--error)] bg-opacity-20 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* Email Field */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
      ${
        isDarkMode
          ? "bg-[var(--textbox)] border-[var(--border)] focus:ring-2 focus:ring-[var(--button)]"
          : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
      }`}
                style={{
                  color: isDarkMode ? "#292e2c" : "var(--text)",
                }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <MdEmail
                  className={`text-xl transition-colors duration-500 ${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  }`}
                />
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Password Field */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
      ${
        isDarkMode
          ? "bg-[var(--textbox)] border-[var(--border)] focus:ring-2 focus:ring-[var(--button)]"
          : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
      }`}
                style={{
                  color: isDarkMode ? "#292e2c" : "var(--text)",
                }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // ما يسرّب الـ blur
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className={`p-1 transition-colors duration-300 ${
                    isDarkMode
                      ? "text-[var(--mid-dark)] hover:text-[var(--text)]"
                      : "text-[var(--light-gray)] hover:text-[var(--text)]"
                  }`}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition-all duration-300
            bg-[var(--button)] text-white 
            hover:bg-[var(--button)] hover:text-white 
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] 
            disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password */}
          <p className="text-center">
            <span
              className={`cursor-pointer transition-colors duration-300
              text-[var(--primary)] hover:text-[var(--primary)] hover:underline`}
              onClick={() => navigate("/delivery/forgot-password")}
            >
              Forgot Password?
            </span>
          </p>
        </form>

        {/* Register Link */}
        <p
          className={`text-center mt-6 transition-colors duration-300
          ${
            isDarkMode ? "text-[var(--light-gray)]" : "text-[var(--light-gray)]"
          }`}
        >
          Don&apos;t have an account?{" "}
          <span
            className={`cursor-pointer font-medium transition-colors duration-300
            text-[var(--primary)] hover:text-[var(--primary)] hover:underline`}
            onClick={() => navigate("/delivery/register")}
          >
            Register
          </span>
        </p>
      </div>

      {/* Right Section - Welcome (نفس توزيع الكستمر) */}
      <div
        className={`w-1/2 flex flex-col justify-center items-center p-12 transition-colors duration-500
        ${
          isDarkMode
            ? "bg-[var(--mid-dark)] text-[var(--text)]"
            : "bg-[var(--div)] text-[var(--text)]"
        }`}
      >
        <img
          src={isDarkMode ? "/darklogo.png" : "/logo.png"}
          alt="Qwikko Logo"
          className="h-25 w-80 mb-6 transition-all duration-500"
        />
        <p className="text-xl max-w-md text-center leading-relaxed">
          Welcome Back! Log in to continue managing your deliveries and access
          your dashboard.
        </p>
      </div>
    </div>
  );
}
