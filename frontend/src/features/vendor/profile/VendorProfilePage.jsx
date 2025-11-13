import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { fetchVendorProfile, updateVendorProfile } from "../VendorAPI2";
import Footer from "../../customer/customer/components/layout/Footer";

export default function VendorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [toast, setToast] = useState(null);

  const isDark = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchVendorProfile();
        if (data && data.success) {
          setProfile(data.data);
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (err) {
        setError(err.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempProfile((prev) => ({ ...prev, store_logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updated = await updateVendorProfile(tempProfile);
      if (updated) {
        showToast("Profile updated successfully!", "success");
        setProfile(updated);
        setEditing(false);
      }
    } catch (err) {
      showToast("Failed to update profile", "error");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "var(--button)" }}
          ></div>
          <p style={{ color: "var(--text)" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--error)", opacity: 0.2 }}
          >
            <span style={{ color: "var(--error)" }} className="text-2xl">
              !
            </span>
          </div>
          <p style={{ color: "var(--error)" }}>Error: {error}</p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--div)" }}
          >
            <span style={{ color: "var(--text)" }} className="text-2xl">
              🏬
            </span>
          </div>
          <p style={{ color: "var(--text)" }}>Vendor not found</p>
        </div>
      </div>
    );

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 flex-1">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 pt-10">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="relative">
              <img
                src={editing ? tempProfile.store_logo || profile.store_logo : profile.store_logo}
                alt="Store"
                className="w-24 h-24 rounded-full object-cover shadow-2xl"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4"
                style={{
                  borderColor: "var(--bg)",
                  backgroundColor: profile.status === "approved" ? "#10B981" : "#F59E0B",
                }}
              ></div>
            </div>
            <div>
              <h1
                className="text-4xl font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--text), var(--button))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {profile.store_name}
              </h1>
              <p className="text-lg mt-2">{profile.contact_email}</p>
              <div className="flex items-center gap-2 mt-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: profile.status === "approved" ? "#10B981" : "#F59E0B",
                  }}
                ></div>
                <span className="text-sm capitalize">{profile.status}</span>
              </div>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setTempProfile({
                  store_name: profile.store_name,
                  address: profile.address,
                  description: profile.description,
                  store_logo: profile.store_logo,
               
                });
              }}
              className="text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: "var(--button)" }}
            >
              <Pencil size={18} /> Edit Profile
            </button>
          )}
        </header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Vendor Info */}
          <div className="lg:col-span-3">
            <div
              className="border-2 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl"
              style={{
                borderColor: "var(--border)",
                background: isDark
                  ? "linear-gradient(135deg, var(--div), var(--mid-dark))"
                  : "linear-gradient(135deg, #ffffff, #f7fafc)",
              }}
            >
              <h2 className="text-2xl font-bold mb-6">Vendor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
  <p className="font-semibold">Store Name:</p>
  {editing ? (
    <input
      type="text"
      name="store_name"
      value={tempProfile.store_name}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg p-2"
    />
  ) : (
    <p>{profile.store_name}</p>
  )}

  <p className="font-semibold">Address:</p>
  {editing ? (
    <input
      type="text"
      name="address"
      value={tempProfile.address}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg p-2"
    />
  ) : (
    <p>{profile.address}</p>
  )}
</div>

                <div className="space-y-4">
                  <p className="font-semibold">Description:</p>
                  {editing ? (
                    <textarea
                      name="description"
                      value={tempProfile.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  ) : (
                    <p>{profile.description}</p>
                  )}

                  <p className="font-semibold">Rating:</p>
                  <p>{profile.rating || "0.0"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="lg:col-span-1">
            <div
              className="border-2 rounded-3xl p-8 shadow-2xl transition-all duration-300 text-center"
              style={{
                borderColor: "var(--border)",
                background: "linear-gradient(135deg, var(--button), #02966a)",
              }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    profile.status === "approved" ? "bg-green-400" : "bg-yellow-400"
                  }`}
                >
                  <span className="text-white text-sm font-bold">
                    {profile.status === "approved" ? "✓" : "!"}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Account Status</h2>
              <div className="text-2xl font-bold text-white mb-4 capitalize">
                {profile.status}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
<div
              className="border-2 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl"
              style={{
                borderColor: "var(--border)",
                background: isDark
                  ? "linear-gradient(135deg, var(--div), var(--mid-dark))"
                  : "linear-gradient(135deg, #ffffff, #f7fafc)",
              }}
            >
  <h2 className="text-2xl font-bold mb-6">Personal Info</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <p className="font-semibold">Name:</p>
      <p>{profile.username}</p>
    </div>
    <div>
      <p className="font-semibold">Email:</p>
      <p>{profile.contact_email}</p>
    </div>
    <div>
      <p className="font-semibold">Phone:</p>
      <p>{profile.phone}</p>
    </div>
  </div>
</div>


        {/* Edit Buttons */}
        {editing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setEditing(false)}
              className="font-semibold px-6 py-2 rounded-xl border-2"
              style={{
                backgroundColor: "var(--div)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-white font-semibold px-6 py-2 rounded-xl"
              style={{ backgroundColor: "var(--button)" }}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-white ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <span className="text-lg">{toast.type === "success" ? "✅" : "⚠️"}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[var(--footer-bg)]">
        <Footer />
      </footer>
    </div>
  );
}
