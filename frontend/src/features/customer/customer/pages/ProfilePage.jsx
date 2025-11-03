import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile } from "../profileSlice";
import PaymentMethodsPanel from "../components/PaymentMethodsPanel";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.customerTheme.mode); // جلب الثيم من الـ Redux store

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // تطبيق الثيم على الـ body
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  // جلب نقاط الولاء من الباكيند
  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:3000/api/customers/loyalty", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLoyaltyPoints(data.points?.points_balance || 0);
      } catch (err) {
        console.error("Error fetching loyalty points:", err);
      }
    };
    fetchLoyaltyPoints();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className={`min-h-screen bg-[var(--bg)] flex items-center justify-center`}>
        <p className={`text-[var(--text)]`}>Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className={`min-h-screen bg-[var(--bg)] flex items-center justify-center`}>
        <p className={`text-[var(--error)]`}>Error: {error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className={`min-h-screen bg-[var(--bg)] flex items-center justify-center`}>
        <p className={`text-[var(--text)]`}>Profile not found</p>
      </div>
    );

  return (
    <div className={`min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-12 ">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between  pt-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[var(--textbox)] rounded-full flex items-center justify-center text-2xl font-bold text-[var(--text)]">
              {profile.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-[var(--text-light)]">{profile.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`bg-[var(--button)] hover:bg-[var(--hover)] text-white font-medium px-6 py-2 rounded-lg transition-all`}
            >
              Edit Profile
            </button>
          )}
        </header>

        {/* Profile & Loyalty Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          {/* Profile Card */}
      <div
        className={`col-span-3 mt-10 border border-[var(--border)] rounded-2xl p-8 shadow-lg ${
          theme === "dark" 
            ? "bg-gradient-to-br from-[var(--button)] to-gray-700" 
            : "bg-gradient-to-br from-[var(--button)] to-gray-700"
        }`}
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[1.05rem]">
            <div>
              <p className="text-sm text-[var(--textbox)] mb-1">Name</p>
              <p className="font-medium text-[var(--textbox)]">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--textbox)] mb-1">Phone</p>
              <p className="font-medium text-[var(--textbox)]">{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--textbox)] mb-1">Address</p>
              <p className="font-medium text-[var(--textbox)]">{profile.address}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--textbox)] mb-1">Email</p>
              <p className="font-medium text-[var(--textbox)]">{profile.email}</p>
              <p className="text-[var(--textbox)] text-sm mt-1 opacity-80">Email cannot be edited</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {successMsg && (
              <p className="text-[var(--textbox)] font-medium bg-black/20 p-3 rounded-lg text-center border border-[var(--border)]">
                {successMsg}
              </p>
            )}
            {/* Name */}
      <div>
        <label
          className={`block text-sm font-medium mb-1 ${
            theme === "dark" ? "text-[var(--text)]" : "text-[var(--textbox)]"
          }`}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className={`w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[1rem] placeholder-gray-400 outline-none focus:ring-2 ${
            theme === "dark"
              ? "bg-[var(--textbox)] text-[var(--mid-dark)] focus:ring-[var(--mid-dark)]"
              : "bg-[var(--textbox)] text-[var(--text)] focus:ring-[var(--textbox)]"
          }`}
        />
      </div>

      {/* نفس الشيء للـ Phone و Address */}
      <div>
        <label
          className={`block text-sm font-medium mb-1 ${
            theme === "dark" ? "text-[var(--text)]" : "text-[var(--textbox)]"
          }`}
        >
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className={`w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[1rem] placeholder-gray-400 outline-none focus:ring-2 ${
            theme === "dark"
              ? "bg-[var(--textbox)] text-[var(--mid-dark)] focus:ring-[var(--mid-dark)]"
              : "bg-[var(--textbox)] text-[var(--text)] focus:ring-[var(--textbox)]"
          }`}
        />
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-1 ${
            theme === "dark" ? "text-[var(--text)]" : "text-[var(--textbox)]"
          }`}
        >
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          className={`w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-[1rem] placeholder-gray-400 outline-none focus:ring-2 ${
            theme === "dark"
              ? "bg-[var(--textbox)] text-[var(--mid-dark)] focus:ring-[var(--mid-dark)]"
              : "bg-[var(--textbox)] text-[var(--text)] focus:ring-[var(--textbox)]"
          }`}
        />
      </div>


      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className={`bg-black/30 hover:bg-black/40 text-[var(--textbox)] font-medium px-6 py-2 rounded-lg border border-[var(--border)] transition-all`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`bg-[var(--textbox)] hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition-all`}
        >
          Save Changes
        </button>
      </div>
    </form>
  )}
</div>

          {/* Loyalty Points Card */}
          <div
            className={`mt-10 border border-[var(--border)] rounded-2xl p-8 shadow-lg ${
              theme === "dark" ? "bg-gradient-to-br from-[var(--button)] to-gray-700" : "bg-gradient-to-br from-[var(--button)] to-gray-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-[var(--textbox)]">Loyalty Points</h2>
            <div className="inline-flex items-center justify-center gap-2 text-[var(--textbox)]  px-6 py-3 rounded-full text-2xl font-bold">
              {loyaltyPoints} <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className={`text-500 mt-2 text-s ${
              theme === "dark" ? "text-[var(--text)]" : "text-[var(--bg)]"
            }`}>Keep earning rewards as you shop!</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-10 relative">
          <h2 className="text-2xl font-bold mb-4 ml-6 absolute -top-3  px-4 z-10">Transactions</h2>
          <section
            className={`rounded-2xl p-8 shadow-lg pt-10 ${
              theme === "dark" ? "bg-[var(--div)]" : "bg-[var(--textbox)]"
            }`}
          >
            <PaymentMethodsPanel />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
