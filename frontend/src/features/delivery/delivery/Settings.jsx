import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaSun,
  FaMoon,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaUserSlash,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toggleTheme } from "./deliveryThemeSlice";
import { fetchDeliveryProfile } from "./Api/DeliveryAPI";

/**
 * Updated SettingsPage
 * - Keeps all original logic (profile fetch, edit navigation, delete flow, theme toggle)
 * - Replaces the "Danger Zone" UI with the nicer design (inspired by the second snippet)
 * - Keeps the confirmation modal intact
 *
 * Notes:
 * - I intentionally preserved the original API DELETE URL, token handling, and navigation logic.
 * - Styling uses the same CSS variables you already had (var(--bg), var(--text), var(--error), etc.)
 * - No other logic was changed.
 */

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const darkMode = useSelector((state) => state.deliveryTheme.darkMode);

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load delivery profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const profileData = await fetchDeliveryProfile(token);
        setCompany(profileData.company);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/delivery/dashboard/edit", { state: { company } });
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/customers/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete account");

      // حذف التوكن والرجوع للّوج إن
      localStorage.removeItem("token");
      navigate("/delivery/login");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "var(--div)",
          }}
        ></div>
      </div>
    );

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          color: "var(--error)",
          marginTop: "2rem",
        }}
      >
        ❌ {error}
      </p>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1.5rem",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "600" }}>Settings</h1>
            <p
              style={{ marginTop: 6, color: "var(--light-gray)", fontSize: 14 }}
            >
              Manage your delivery account and preferences
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => dispatch(toggleTheme())}
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </header>

        {/* Profile Section */}
        <section
          style={{
            backgroundColor: darkMode ? "#313131" : "#f5f6f5",
            borderRadius: "1rem",
            padding: "1.25rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "var(--button)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaUser style={{ color: "#fff", fontSize: 20 }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {company?.company_name || "N/A"}
                </h2>
                <p style={{ color: "var(--light-gray)" }}>
                  {company?.user_email || "N/A"}
                </p>
                <p
                  style={{
                    color: "var(--light-gray)",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  Member since 2024
                </p>
              </div>
            </div>

            <button
              onClick={handleEditProfile}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: `1px solid var(--border)`,
                backgroundColor: "var(--button)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </section>

        {/* Danger Zone — redesigned to match nicer style */}
        <section
          style={{
            backgroundColor: "var(--bg)",
            border: `1px solid rgba(255,0,0,0.08)`,
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "rgba(255,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaExclamationTriangle
                style={{ color: "var(--error)", fontSize: 18 }}
              />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Danger Zone
              </h3>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "var(--light-gray)",
                  fontSize: 13,
                }}
              >
                Permanent actions that cannot be undone
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,0,0,0.04)",
              border: `1px solid rgba(255,0,0,0.12)`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <FaUserSlash style={{ color: "var(--error)", marginTop: 4 }} />
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  Delete Account
                </h4>
                <p
                  style={{
                    marginTop: 8,
                    marginBottom: 12,
                    color: "var(--light-gray)",
                    fontSize: 13,
                  }}
                >
                  Once you delete your account, there is no going back. All your
                  data will be permanently removed. Please be certain before
                  continuing.
                </p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "var(--error)",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <FaUserSlash /> Delete My Account
                  </button>

          
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal التأكيد على الحذف */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
              padding: "1.25rem",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              width: "100%",
              maxWidth: 520,
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <FaExclamationTriangle style={{ color: "var(--error)" }} />
              Confirm Deletion
            </h3>
            <p style={{ marginBottom: "1.25rem", color: "var(--light-gray)" }}>
              Are you sure you want to <strong>delete your account?</strong>{" "}
              This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.9rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--error)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.75 : 1,
                  border: "none",
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.9rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
