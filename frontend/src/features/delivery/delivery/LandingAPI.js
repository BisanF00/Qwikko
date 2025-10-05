// src/api/cms.js
export async function fetchLandingCMS(type, title) {
  try {
    const query = `http://localhost:3000/api/cms?type=${encodeURIComponent(
      type
    )}&title=${encodeURIComponent(title)}`;

    const res = await fetch(query);

    if (!res.ok) {
      throw new Error("Failed to fetch CMS content");
    }

    const data = await res.json();
    return data?.[0] || {}; // لأنه بيرجع صف واحد عادة
  } catch (err) {
    console.error("❌ Error fetching CMS:", err);
    return {};
  }
}
