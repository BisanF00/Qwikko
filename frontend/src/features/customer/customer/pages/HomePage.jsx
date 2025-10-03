import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [landingContent, setLandingContent] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ===== Landing Section =====
        const resLanding = await fetch(
          "http://localhost:3000/api/cms?type=customer&title=Landing%20Page"
        );
        const textLanding = await resLanding.text();
        let dataLanding;
        try {
          dataLanding = JSON.parse(textLanding);
        } catch {
          throw new Error("Server did not return valid JSON for Landing");
        }
        if (!dataLanding || dataLanding.length === 0) {
          throw new Error("No content found for Landing Page");
        }
        setLandingContent(dataLanding[0]);

        // ===== Most Popular Products (top 4) =====
        const resPopular = await fetch(
          "http://localhost:3000/api/customers/products?sort=popular&limit=4"
        );
        const dataPopular = await resPopular.json();
        setPopularProducts(dataPopular);

        // ===== Newest Products (top 4) =====
        const resNewest = await fetch(
          "http://localhost:3000/api/customers/products?sort=newest&limit=4"
        );
        const dataNewest = await resNewest.json();
        setNewestProducts(dataNewest);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-20 text-red-500">Error: {error}</p>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* ===== Landing Section ===== */}
      {landingContent && (
        <div className="flex flex-col md:flex-row items-center md:items-start max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden my-6 mx-auto">
          <div className="md:w-1/2 w-full">
            <img
              src={landingContent.image_url}
              alt={landingContent.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center items-start">
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              {landingContent.content}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {/* ===== Most Popular Products ===== */}
      <div className="max-w-6xl mx-auto my-12">
        <h2 className="text-2xl font-bold mb-6">Most Popular</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {popularProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-gray-600">${p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Newest Products ===== */}
      <div className="max-w-6xl mx-auto my-12">
        <h2 className="text-2xl font-bold mb-6">Newest Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {newestProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold">{p.name}</h3>
              <p className="text-gray-600">${p.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;
