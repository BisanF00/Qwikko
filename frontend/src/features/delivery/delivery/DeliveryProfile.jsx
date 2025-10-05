import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import {
  fetchDeliveryProfile,
  fetchCoverageAreas,
  addCoverage,
} from "./DeliveryAPI";

const ALLOWED_AREAS = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Ajloun",
  "Jerash",
  "Mafraq",
  "Madaba",
  "Karak",
  "Tafilah",
  "Ma'an",
  "Aqaba",
];

export default function DeliveryProfile() {
  const [company, setCompany] = useState(null);
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const [profile, coverageData] = await Promise.all([
          fetchDeliveryProfile(token),
          fetchCoverageAreas(token),
        ]);

        setCompany(profile.company);
        setCoverage(coverageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveCoverage = async () => {
    try {
      const token = localStorage.getItem("token");
      await addCoverage(token, selectedAreas);

      const updatedCoverage = await fetchCoverageAreas(token);
      setCoverage(updatedCoverage);

      setSelectedAreas([]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add coverage", err);
    }
  };

if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error)
    return <p className="text-center mt-10 text-red-600">❌ {error}</p>;

  const avatarText = company.company_name
    ? company.company_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "??";

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 animate-fadeIn">
      {/* Avatar + Title */}
      <div className="flex items-center justify-center mb-10 gap-4">
        <div className="w-20 h-20 bg-purple-600 text-white flex items-center justify-center rounded-full text-3xl font-extrabold shadow-lg transform transition-transform hover:scale-105">
          {avatarText}
        </div>
        <h2 className="text-4xl font-extrabold text-purple-600 animate-pulse">
          Delivery Profile
        </h2>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/delivery/dashboard/edit")}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:bg-purple-700 hover:scale-105 transition-transform"
        >
          <Pencil size={18} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Info Card */}
        <div className="p-6 rounded-2xl shadow-xl bg-white border-l-8 border-green-400 hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-102">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Delivery Info
          </h3>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Company Name:</span>{" "}
            <span className="text-gray-800">{company.company_name}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${
                company.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {company.status}
            </span>
          </div>

          {/* Coverage Areas */}
          <div className="mb-2">
            <span className="font-semibold text-gray-600">Coverage Areas:</span>
          </div>
          {coverage.length === 0 ? (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:bg-green-600 hover:scale-105 transition-transform"
            >
              <Plus size={18} /> Add Coverage Areas
            </button>
          ) : (
            <ul className="grid grid-cols-2 gap-2 text-gray-700 mt-2">
              {coverage.map((area, idx) => (
                <li
                  key={idx}
                  className="bg-purple-50 text-purple-800 px-3 py-1 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                  {area}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Personal Info Card */}
        <div className="p-6 rounded-2xl shadow-xl bg-white border-l-8 border-indigo-400 hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-102">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Personal Info
          </h3>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Name:</span>{" "}
            <span className="text-gray-800">{company.user_name || "N/A"}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Email:</span>{" "}
            <span className="text-gray-800">{company.user_email || "N/A"}</span>
          </div>
          <div className="mb-3">
            <span className="font-semibold text-gray-600">Phone:</span>{" "}
            <span className="text-gray-800">{company.user_phone || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Select Coverage Areas
            </h2>
            <div className="max-h-60 overflow-y-auto border rounded-xl p-4">
              {ALLOWED_AREAS.map((area) => (
                <label
                  key={area}
                  className="flex items-center mb-2 cursor-pointer hover:bg-purple-50 rounded px-2 py-1 transition-all"
                >
                  <input
                    type="checkbox"
                    value={area}
                    checked={selectedAreas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAreas([...selectedAreas, area]);
                      } else {
                        setSelectedAreas(
                          selectedAreas.filter((a) => a !== area)
                        );
                      }
                    }}
                    className="mr-2 accent-purple-600"
                  />
                  {area}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCoverage}
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg transition-transform hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
