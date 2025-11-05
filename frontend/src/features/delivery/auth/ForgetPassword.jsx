// src/features/delivery/auth/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaLock } from "react-icons/fa";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  // ✅ نفس سِلّك الدلفري (مو تبع الكستمر)
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // الإيميل مخزّن من خطوة "Forgot Password"
  const email = localStorage.getItem("resetEmail");
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (!email) {
        setError("Reset link expired or email not found. Please try again.");
        return;
      }

      await axios.post("http://localhost:3000/api/auth/reset-password", {
        email,
        newPassword: data.password,
      });

      setSuccess("Password updated successfully. You can now login.");
      localStorage.removeItem("resetEmail");

      // ✅ دلفري (مو كستمر)
      setTimeout(() => navigate("/delivery/login"), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500
        ${
          isDarkMode
            ? "bg-[var(--bg)] text-[var(--text)]"
            : "bg-[var(--bg)] text-[var(--text)]"
        }`}
    >
      {/* يسار — الفورم (نفس لون لوج إن الدلفري) */}
      <div
        className={`w-1/2 flex flex-col justify-center items-center p-12 transition-colors duration-500
          ${isDarkMode ? "bg-[var(--div)]" : "bg-[var(--bg)]"}`}
      >
        <h2 className="text-3xl font-bold mb-6">Reset Password</h2>

        {/* معلومات الإيميل */}
        <div className="w-full max-w-md mb-2 text-sm opacity-80">
          {email ? (
            <p>
              Resetting password for:{" "}
              <span className="font-semibold">{email}</span>
            </p>
          ) : (
            <p className="text-[var(--error)]">
              No reset email found. Please request a new reset link.
            </p>
          )}
        </div>

        {/* رسائل النجاح/الخطأ — نفس ستايل اللوج إن */}
        {success && (
          <div
            className={`w-full max-w-md p-3 rounded-lg mb-4 text-center transition-colors duration-300
              ${
                isDarkMode
                  ? "bg-[var(--success)] bg-opacity-20 text-green-200"
                  : "bg-[var(--success)] bg-opacity-20 text-green-700"
              }`}
          >
            {success}
          </div>
        )}

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6"
        >
          {/* New Password */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                })}
                className={`w-full border p-3 pl-10 pr-12 rounded-lg focus:outline-none transition-all duration-300
                  ${
                    isDarkMode
                      ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                      : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                  }`}
                style={{ WebkitTextFillColor: "var(--text)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className={`p-1 transition-colors duration-300
                    ${
                      isDarkMode
                        ? "text-[var(--mid-dark)] hover:text-[var(--text)]"
                        : "text-[var(--light-gray)] hover:text-[var(--text)]"
                    }`}
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </span>
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaLock
                  className={`${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  } text-base`}
                />
              </span>
            </div>
            <div className="h-5">
              {errors.password && (
                <p className="text-sm text-[var(--error)] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col w-full relative">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
                className={`w-full border p-3 pl-10 pr-12 rounded-lg focus:outline-none transition-all duration-300
                  ${
                    isDarkMode
                      ? "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                      : "bg-[var(--textbox)] border-[var(--border)] text-[var(--text)] focus:ring-2 focus:ring-[var(--button)]"
                  }`}
                style={{ WebkitTextFillColor: "var(--text)" }}
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className={`p-1 transition-colors duration-300
                    ${
                      isDarkMode
                        ? "text-[var(--mid-dark)] hover:text-[var(--text)]"
                        : "text-[var(--light-gray)] hover:text-[var(--text)]"
                    }`}
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </span>
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaLock
                  className={`${
                    isDarkMode
                      ? "text-[var(--mid-dark)]"
                      : "text-[var(--light-gray)]"
                  } text-base`}
                />
              </span>
            </div>
            <div className="h-5">
              {errors.confirmPassword && (
                <p className="text-sm text-[var(--error)] mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-semibold transition-all duration-300
              bg-[var(--button)] text-white 
              hover:bg-[var(--button)] hover:text-white 
              hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            disabled={!email}
          >
            Reset Password
          </button>

          {/* Back to Login — بالنص */}
          <p className="text-center mt-3">
            <button
              type="button"
              onClick={() => navigate("/delivery/login")}
              className="underline text-[var(--primary)]"
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>

      {/* يمين — البانل (نفس ألوان لوج إن الدلفري + اللوجو) */}
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
          Create a strong password to keep your account secure. You can log in
          right after resetting your password.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
