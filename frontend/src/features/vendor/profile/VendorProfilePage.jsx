import React, { useEffect, useState } from "react";
import { fetchVendorProfile, updateVendorProfile } from "../VendorAPI2";

const VendorProfilePage = () => {
  const [profile, setProfile] = useState(null); // بيانات البروفايل
  const [editing, setEditing] = useState(false); // هل الفورم مفتوح للتعديل
  const [tempProfile, setTempProfile] = useState({}); // فورم التعديل
  const [loading, setLoading] = useState(true);

  // توليد slug من اسم المتجر
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

 useEffect(() => {
  const loadProfile = async () => {
    const data = await fetchVendorProfile();
    if (data && data.success) {
      setProfile(data.data); // ✅ خزن البيانات الفعلية
    } else {
      console.error("Failed to load profile");
    }
    setLoading(false);
  };
  loadProfile();
}, []);


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
  const updatedData = {
    store_name: tempProfile.store_name,
    store_logo: tempProfile.store_logo,
    description: tempProfile.description,
    address: tempProfile.address,
  };

  try {
    const updated = await updateVendorProfile(updatedData);
    if (updated) {
      alert("✅ Profile updated successfully!");
      setProfile(updated);
      setEditing(false);
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("⚠️ Something went wrong while updating the profile.");
  }
};



  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6">No profile found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Vendor Profile</h1>

      {!editing ? (
        <div className="space-y-4">
          {/* عرض بيانات البروفايل */}
          <div className="flex items-center space-x-4">
            <img
              src={profile.store_logo || "/placeholder.png"}
              alt="Store"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.store_name}</h2>
              <p className="text-gray-600">{profile.address}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Description:</h3>
            <p>{profile.description}</p>
          </div>

          <button
            onClick={() => {
              setTempProfile({
                store_name: profile.store_name,
                address: profile.address,
                description: profile.description,
                store_logo: profile.store_logo,
              });
              setEditing(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* فورم التعديل */}
          <div className="flex items-center space-x-4">
            <img
              src={tempProfile.store_logo || "/placeholder.png"}
              alt="Store"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div>
            <label className="block font-semibold mb-1">Store Name</label>
            <input
              type="text"
              name="store_name"
              value={tempProfile.store_name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={tempProfile.address}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={tempProfile.description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfilePage;
