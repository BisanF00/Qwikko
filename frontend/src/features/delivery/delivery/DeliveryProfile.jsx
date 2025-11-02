import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import {
  fetchDeliveryProfile,
  fetchCoverageAreas,
  addCoverage,
} from "./Api/DeliveryAPI";
import { useSelector } from "react-redux";

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

// ✅ دالة لتطبيع شكل التغطيات إلى مصفوفة أسماء مدن دومًا
const normalizeCoverage = (data) =>
  Array.isArray(data)
    ? data
        .map((item) => (typeof item === "string" ? item : item?.city))
        .filter(Boolean)
    : [];

export default function DeliveryProfile() {
  const [company, setCompany] = useState(null);
  const [coverage, setCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const navigate = useNavigate();

  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const [profile, coverageData] = await Promise.all([
          fetchDeliveryProfile(token),
          fetchCoverageAreas(token),
        ]);

        // ملاحظة: profile متوقع فيه .company حسب كودك الحالي
        setCompany(profile.company);

        // ✅ طبّعي التغطيات مهما كان شكل الرد
        setCoverage(normalizeCoverage(coverageData));
      } catch (err) {
        setError(err.message || "Failed to load");
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

      // ⚠️ مهم: بعد الحفظ رجّعي التطبيع كمان
      const updatedCoverage = await fetchCoverageAreas(token);
      setCoverage(normalizeCoverage(updatedCoverage));

      setSelectedAreas([]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add coverage", err);
    }
  };

  if (loading)
    return (
      <div
        className="no-anim flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        <div
          className="w-16 h-16 border-4 rounded-full"
          style={{
            borderColor: "var(--primary)",
            borderTopColor: "transparent",
          }}
          title="Loading"
        />
      </div>
    );

  if (error)
    return (
      <p
        className="no-anim text-center mt-10"
        style={{ color: "var(--error)" }}
      >
        ❌ {error}
      </p>
    );

  const title = "Delivery Profile";

  return (
    <div className={`${isDarkMode ? "dark" : ""} no-anim`}>
      {/* الصفحة */}
      <div
        className="min-h-screen pb-12"
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {/* العنوان أعلى يسار */}
        <div className="max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between">
          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            {title}
          </h1>

          {/* داخل DeliveryProfile */}
          <button
            onClick={() =>
              navigate("/delivery/dashboard/edit", {
                state: {
                  company, // فيه company_name, user_name, ...
                  coverageAreas: coverage, // مصفوفة المدن الحالية
                },
              })
            }
            className="flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-lg"
            style={{ backgroundColor: "var(--button)", color: "#fff" }}
          >
            <Pencil size={18} /> Edit Profile
          </button>
        </div>

        {/* الديف الكبيرة */}
        <div
          className="max-w-6xl mx-auto mt-6 px-6 py-8 rounded-3xl shadow-2xl"
          style={{
            backgroundColor: "var(--div)",
            color: "var(--text)",
            border: `1px solid var(--border)`,
          }}
        >
          {/* Grid بطاقتين بنفس الارتفاع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* بطاقة معلومات الشركة */}
            <section className="h-full flex flex-col">
              <div className="mb-3">
                <span
                  className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: isDarkMode ? "#ffffff" : "#292e2c",
                    border: `1px solid var(--border)`,
                  }}
                >
                  Delivery Info
                </span>
              </div>

              <div
                className="p-6 rounded-2xl shadow-xl flex-1"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                  border: `1px solid var(--border)`,
                }}
              >
                <div className="mb-3">
                  <span className="font-semibold">Company Name:</span>{" "}
                  <span>{company.company_name}</span>
                </div>

                <div className="mb-3">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className="px-2 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor:
                        company.status === "approved"
                          ? "var(--success)"
                          : "var(--warning)",
                      color:
                        company.status === "approved" ? "#0b3d1b" : "#3d3000",
                    }}
                  >
                    {company.status}
                  </span>
                </div>

                <div className="mb-2 font-semibold">Coverage Areas:</div>

                {coverage.length === 0 ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-lg"
                    style={{
                      backgroundColor: "var(--button)",
                      color: "#ffffff",
                    }}
                  >
                    <Plus size={18} /> Add Coverage Areas
                  </button>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {coverage.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg font-medium shadow-sm"
                        style={{
                          backgroundColor: "var(--hover)",
                          color: "var(--mid-dark)",
                          border: `1px solid var(--border)`,
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* بطاقة المعلومات الشخصية */}
            <section className="h-full flex flex-col">
              <div className="mb-3">
                <span
                  className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--bg)",
                    color: isDarkMode ? "#ffffff" : "#292e2c",
                    border: `1px solid var(--border)`,
                  }}
                >
                  Personal Info
                </span>
              </div>

              <div
                className="p-6 rounded-2xl shadow-xl flex-1"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                  border: `1px solid var(--border)`,
                }}
              >
                <div className="mb-3">
                  <span className="font-semibold">Name:</span>{" "}
                  <span>{company.user_name || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Email:</span>{" "}
                  <span>{company.user_email || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold">Phone:</span>{" "}
                  <span>{company.user_phone || "N/A"}</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
              className="p-6 rounded-2xl shadow-2xl w-96"
              style={{
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                border: `1px solid var(--border)`,
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Select Coverage Areas</h2>

              <div
                className="max-h-60 overflow-y-auto rounded-xl p-4"
                style={{
                  backgroundColor: "var(--textbox)",
                  border: `1px solid var(--border)`,
                }}
              >
                {ALLOWED_AREAS.map((area) => (
                  <label
                    key={area}
                    className="flex items-center mb-2 cursor-pointer rounded px-2 py-1"
                    style={{ borderRadius: "12px" }}
                  >
                    <input
                      type="checkbox"
                      value={area}
                      checked={selectedAreas.includes(area)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedAreas((prev) => [...prev, area]);
                        else
                          setSelectedAreas((prev) =>
                            prev.filter((a) => a !== area)
                          );
                      }}
                      className="mr-2"
                      style={{ accentColor: "var(--button)" }}
                    />
                    {area}
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: "var(--hover)",
                    color: "var(--mid-dark)",
                    border: `1px solid var(--border)`,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveCoverage}
                  className="px-4 py-2 rounded-full text-white shadow-lg"
                  style={{
                    backgroundColor: "var(--button)",
                    color: "#ffffff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
