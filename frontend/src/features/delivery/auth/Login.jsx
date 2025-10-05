import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginDelivery, clearMessages } from "./authSlice";
import logo from "../../../assets/LogoDark.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginDelivery(formData));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearMessages());
        navigate("/delivery/dashboard/Home");
      }, 1500);
    }
  }, [successMessage, dispatch, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-gray-50">
        <div className="w-full max-w-md p-6 border rounded-lg shadow bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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


          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          {successMessage && (
            <p className="mt-4 text-center text-green-600">{successMessage}</p>
          )}

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/delivery/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Right side - Welcome / Info */}
      <div className="w-1/2 bg-black text-white p-6 relative h-[100vh]">
        <img
          src={logo}
          alt="Qwikko Logo"
          className="w-100 h-100 object-contain absolute top-25 left-1/2 transform -translate-x-1/2"
        />
        <p className="text-2xl max-w-md absolute top-[360px] left-1/2 transform -translate-x-1/2 text-center">
          Welcome Back! Log in to continue managing your deliveries and access
          your dashboard.
        </p>
      </div>
    </div>
  );
}
