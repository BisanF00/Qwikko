import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerDelivery, clearMessages } from "./authSlice";
import { FaUser, FaBuilding, FaPhone } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterDelivery() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ نفس السلكتورز والفلو كما هي
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  // ✅ نفس أسماء الحقول تمامًا
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    phone: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    dispatch(registerDelivery(formData));
  };

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => {
        dispatch(clearMessages());
        navigate("/delivery/login");
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
      {/* Left Section - Signup Form (نفس ستايل الكستمر) */}
      <div
        className={`w-1/2 flex flex-col justify-center items-center p-12 transition-colors duration-500
        ${isDarkMode ? "bg-[var(--div)]" : "bg-[var(--bg)]"}`}
      >
        <h2 className="text-3xl font-bold mb-6">Register Delivery Company</h2>

        {/* Error banner */}
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

        {/* Success banner */}
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

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {/* Contact Person Name */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Contact Person Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FaUser
                  className={`text-xl ${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  }`}
                />
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Email */}
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
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <MdEmail
                  className={`text-xl ${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  }`}
                />
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Password */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  aria-pressed={showPass}
                  className={`p-1 transition-colors duration-300 ${
                    isDarkMode
                      ? "text-[var(--mid-dark)] hover:text-[var(--text)]"
                      : "text-[var(--light-gray)] hover:text-[var(--text)]"
                  }`}
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  aria-pressed={showConfirm}
                  className={`p-1 transition-colors duration-300 ${
                    isDarkMode
                      ? "text-[var(--mid-dark)] hover:text-[var(--text)]"
                      : "text-[var(--light-gray)] hover:text-[var(--text)]"
                  }`}
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Company Name */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FaBuilding
                  className={`text-xl ${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  }`}
                />
              </span>
            </div>
            <div className="h-5" />
          </div>

          {/* Phone (optional) */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type="text"
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border p-3 pr-12 rounded-lg focus:outline-none transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                    : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                }`}
                style={{ color: "var(--mid-dark)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FaPhone
                  className={`text-xl ${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  }`}
                />
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold transition-all duration-300
            bg-[var(--button)] text-white 
            hover:bg-[var(--button)] hover:text-white 
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] 
            disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login link */}
          <p
            className={`text-center mt-6 transition-colors duration-300
            ${
              isDarkMode
                ? "text-[var(--light-gray)]"
                : "text-[var(--light-gray)]"
            }`}
          >
            Already have an account?{" "}
            <span
              className={`cursor-pointer font-medium transition-colors duration-300
              text-[var(--primary)] hover:text-[var(--primary)] hover:underline`}
              onClick={() => navigate("/delivery/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>

      {/* Right Section - Welcome (مطابق للكستمر) */}
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
          Welcome to Qwikko! Start your delivery journey with us.
        </p>
      </div>
    </div>
  );
}
