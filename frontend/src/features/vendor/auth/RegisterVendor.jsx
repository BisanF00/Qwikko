import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerVendorAPI } from "../VendorAPI2";
import {
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaLock,
  FaStore,
  FaPhone,
  FaAlignLeft,
} from "react-icons/fa";

export default function RegisterVendor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    store_name: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await registerVendorAPI(formData);
      setMessage("✅ Vendor registered successfully!");
      console.log("Vendor:", data.vendor);
      navigate("/vendor/login");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-extrabold mb-6 flex items-center gap-4">
          <FaShoppingBag className="text-white" /> Qwikko
        </h1>
        <p className="text-xl max-w-md text-center mt-10">
          Welcome to Qwikko! Start your vendor journey with us and grow your
          business. Join our marketplace and reach thousands of customers today.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-white">
        <h2 className="text-3xl font-bold mb-6">Register Vendor</h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Store Name */}
          <div className="relative">
            <input
              type="text"
              name="store_name"
              placeholder="Store Name"
              value={formData.store_name}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <FaStore className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <FaPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              name="description"
              placeholder="Store Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              rows="3"
            />
            <FaAlignLeft className="absolute right-3 top-3 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-lg transition-colors duration-300 hover:bg-gray-800 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/vendor/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
