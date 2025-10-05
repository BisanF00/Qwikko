// src/features/vendor/VendorLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        navigate("/vendor/dashboard");
      } else {
        setMessage("❌ " + (data.message || "Login failed"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-gray-50">
        <div className="w-full max-w-md p-6 border rounded-lg shadow bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Vendor Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Transparent Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-3 rounded-lg transition duration-300 ease-in-out
             hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/vendor/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Right side - Welcome / Info */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-12">
        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-lg text-center max-w-md mt-10">
          Log in to manage your store, update products, and access your vendor dashboard.
        </p>
      </div>
    </div>
  );
}
