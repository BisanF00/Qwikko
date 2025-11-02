import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchDeliveryProfile,
  updateDeliveryProfile,
  fetchCoverageAreas,
  addCoverage, // ✅ موجود سابقًا
} from "./Api/DeliveryAPI";
import { useSelector } from "react-redux";
// 👇 فوق كل شيء
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE?.replace(/\/+$/,"")) ||
  "http://localhost:3000/api/delivery";

/* ===================== API محلي: حذف مدينة واحدة ===================== */
async function deleteCoverageCity(token, city) {
  const url = `${API_BASE}/coverage/${encodeURIComponent(city)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  // لو السيرفر رجّع HTML لأن الطلب راح للواجهة بالغلط، هذا يحميك من JSON.parse error
  let data;
  try {
    data = await res.json();
  } catch {
    data = { _raw: await res.text() };
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Failed to delete city: ${city}`;
    throw new Error(msg);
  }
  return data; // { message, deleted, remaining? }
}


export default function EditProfile() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [deletingCity, setDeletingCity] = useState(null); // 🔸 المدينة قيد الحذف الآن

  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.deliveryTheme.darkMode);

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

  // 🔹 إزالة التكرارات
  const uniq = (arr) => Array.from(new Set(arr || []));

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // 1) جاي من صفحة البروفايل؟
        const fromStateCompany = location.state?.company;
        const fromStateCoverage = location.state?.coverageAreas;

        if (fromStateCompany) {
          const initData = {
            company_name: fromStateCompany.company_name || "",
            coverage_areas: uniq(fromStateCoverage || []),
            user_name: fromStateCompany.user_name || "",
            user_phone: fromStateCompany.user_phone || "",
          };
          setFormData(initData);
          setOriginalData(initData);
          return;
        }

        // 2) فتح مباشر → fetch من الـ API
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const prof = await fetchDeliveryProfile(token);
        const c = prof?.company || prof || {};

        let coverageAreas = location.state?.coverageAreas;
        if (!Array.isArray(coverageAreas) || coverageAreas.length === 0) {
          coverageAreas = await fetchCoverageAreas(token); // لازم ترجع strings
        }

        const initData = {
          company_name: c.company_name || "",
          coverage_areas: uniq(coverageAreas),
          user_name: c.user_name || "",
          user_phone: c.user_phone || "",
        };

        setFormData(initData);
        setOriginalData(initData);
      } catch (err) {
        setMessage("❌ " + (err.message || "Failed to load"));
      }
    };

    loadProfile();
  }, [location.state?.company, location.state?.coverageAreas]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // مقارنة التغييرات
  const getChangedFields = () => {
    const changed = {};
    if (!formData) return changed;

    Object.keys(formData).forEach((key) => {
      if (key === "coverage_areas") {
        const now = uniq(formData[key]).sort();
        const was = uniq(originalData[key] || []).sort();
        if (JSON.stringify(now) !== JSON.stringify(was)) {
          changed[key] = now;
        }
      } else if (formData[key] !== originalData[key]) {
        changed[key] = formData[key];
      }
    });

    return changed;
  };

  /* ===================== حذف مدينة بزر (×) — تفاؤلي ===================== */
  const handleDeleteCity = async (city) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      setMessage("");
      setDeletingCity(city);

      // حذف تفاؤلي محليًا
      const prev = formData.coverage_areas;
      const next = prev.filter((a) => a !== city);
      setFormData((p) => ({ ...p, coverage_areas: next }));

      // نداء السيرفر
      const resp = await deleteCoverageCity(token, city);

      // (اختياري) لو بدك تعتمدي على remaining من السيرفر:
      // if (Array.isArray(resp?.remaining)) {
      //   const remainingNames = resp.remaining.map((r) => r.city);
      //   setFormData((p) => ({ ...p, coverage_areas: uniq(remainingNames) }));
      // }

      setMessage(`✅ Deleted ${city} successfully`);
    } catch (err) {
      // رجوع في حال الفشل
      setFormData((p) => {
        const set = new Set(p.coverage_areas);
        set.add(city);
        return { ...p, coverage_areas: Array.from(set) };
      });
      setMessage("❌ " + (err.message || "Delete failed"));
    } finally {
      setDeletingCity(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const allChanges = getChangedFields();
      const { coverage_areas, ...profileChanges } = allChanges;

      const tasks = [];

      // تغطيات جديدة (إضافة فقط) — الحذف صار فوري بزر ×
      if (Array.isArray(coverage_areas)) {
        tasks.push(addCoverage(token, uniq(coverage_areas)));
      }

      // تغييرات أخرى في البروفايل
      if (Object.keys(profileChanges).length > 0) {
        tasks.push(updateDeliveryProfile(token, profileChanges));
      }

      if (tasks.length === 0) {
        setMessage("ℹ️ No changes detected.");
        setLoading(false);
        return;
      }

      await Promise.all(tasks);

      setMessage("✅ Profile updated successfully!");
      navigate("/delivery/dashboard/getprofile");
    } catch (err) {
      setMessage("❌ " + (err.message || "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
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
  }

  return (
    <div
      className={isDarkMode ? "dark" : ""}
      style={{ background: "var(--bg)" }}
    >
      {/* العنوان أعلى يسار */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <h2
          className="text-3xl font-extrabold"
          style={{ color: "var(--text)" }}
        >
          Edit Delivery Profile
        </h2>
      </div>

      {/* الديف الكبيرة */}
      <div
        className="max-w-5xl mx-auto mt-6 p-6 rounded-3xl shadow-2xl"
        style={{
          backgroundColor: "var(--div)",
          color: "var(--text)",
          border: `1px solid var(--border)`,
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          style={{ color: "var(--text)" }}
        >
          {/* Personal Info Card */}
          <div
            className="p-6 rounded-2xl shadow-xl"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              border: `1px solid var(--border)`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              Personal Info
            </h3>

            <div className="mb-4">
              <label
                className="block font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                User Name
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                placeholder={originalData.user_name || "User name"}
                onChange={handleChange}
                className="w-full p-2 rounded-lg"
                style={{
                  backgroundColor: "var(--textbox)",
                  color: "var(--text)",
                  border: `1px solid var(--border)`,
                }}
              />
            </div>

            <div>
              <label
                className="block font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                Phone Number
              </label>
              <input
                type="text"
                name="user_phone"
                value={formData.user_phone}
                placeholder={originalData.user_phone || "Phone number"}
                onChange={handleChange}
                className="w-full p-2 rounded-lg"
                style={{
                  backgroundColor: "var(--textbox)",
                  color: "var(--text)",
                  border: `1px solid var(--border)`,
                }}
              />
            </div>
          </div>

          {/* Company Info Card */}
          <div
            className="p-6 rounded-2xl shadow-xl"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              border: `1px solid var(--border)`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              Company Info
            </h3>

            <div className="mb-4">
              <label
                className="block font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                placeholder={originalData.company_name || "Company name"}
                onChange={handleChange}
                className="w-full p-2 rounded-lg"
                style={{
                  backgroundColor: "var(--textbox)",
                  color: "var(--text)",
                  border: `1px solid var(--border)`,
                }}
              />
            </div>

            {/* Coverage Areas */}
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--text)" }}
            >
              Coverage Areas
            </label>
            <select
              className="w-full p-2 rounded mb-4"
              style={{
                backgroundColor: "var(--textbox)",
                color: "var(--text)",
                border: `1px solid var(--border)`,
              }}
              onChange={(e) => {
                const area = e.target.value;
                if (area && !formData.coverage_areas.includes(area)) {
                  setFormData((prev) => ({
                    ...prev,
                    coverage_areas: uniq([...prev.coverage_areas, area]),
                  }));
                }
                e.target.value = "";
              }}
              value=""
            >
              <option value="" disabled>
                Select an area
              </option>
              {ALLOWED_AREAS.filter(
                (a) => !formData.coverage_areas.includes(a)
              ).map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {formData.coverage_areas.map((area) => (
                <span
                  key={area}
                  className="flex items-center px-3 py-1 rounded-2xl"
                  style={{
                    backgroundColor: "var(--textbox)",
                    color: "var(--text)",
                    border: `1px solid var(--border)`,
                  }}
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => handleDeleteCity(area)}
                    disabled={deletingCity === area}
                    className="ml-2 font-bold"
                    style={{
                      color: "var(--error)",
                      opacity: deletingCity === area ? 0.6 : 1,
                      cursor: deletingCity === area ? "not-allowed" : "pointer",
                    }}
                    title={deletingCity === area ? "Deleting..." : "Remove"}
                  >
                    {deletingCity === area ? "…" : "×"}
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate("/delivery/dashboard/getprofile")}
              className="rounded-lg text-sm font-semibold"
              style={{
                padding: "8px 14px",
                backgroundColor: "var(--hover)",
                color: "var(--mid-dark)",
                border: `1px solid var(--border)`,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg text-sm font-semibold"
              style={{
                padding: "8px 14px",
                backgroundColor: "var(--button)",
                color: "#ffffff",
                border: `1px solid var(--border)`,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {message && (
          <p
            className="mt-4 text-center font-medium"
            style={{
              color: message.startsWith("✅")
                ? "var(--success)"
                : "var(--text)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
