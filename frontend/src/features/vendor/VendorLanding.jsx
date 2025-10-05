// src/pages/vendor/VendorLanding.jsx
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaUsers, FaChartLine, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getVendorLandingCMS } from "./VendorAPI2";

export default function VendorLanding() {
  const navigate = useNavigate();
  const [heroCMS, setHeroCMS] = useState(null);

  const benefits = [
    {
      icon: <FaStore className="text-4xl text-orange-500" />,
      title: "Reach More Customers",
      description: "Expand your store reach by connecting with thousands of active buyers.",
    },
    {
      icon: <FaChartLine className="text-4xl text-orange-500" />,
      title: "Boost Your Sales",
      description: "Leverage our platform tools to grow your revenue and sales performance.",
    },
    {
      icon: <FaUsers className="text-4xl text-orange-500" />,
      title: "Community Support",
      description: "Join a network of vendors and get support from our dedicated team.",
    },
    {
      icon: <FaShoppingCart className="text-4xl text-orange-500" />,
      title: "Easy Store Management",
      description: "Manage your products, orders, and customers from a single dashboard.",
    },
  ];

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const data = await getVendorLandingCMS();
        if (data.length > 0) {
          setHeroCMS(data[0]); // أول عنصر من الباكيند للهيرو
        }
      } catch (err) {
        console.error("Failed to fetch CMS data:", err);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Hero Section */}
{heroCMS && (
  <section className="relative py-24 flex flex-col items-center text-center px-6">
    <img
      src={heroCMS.image_url}
      alt={heroCMS.title}
      className="w-full max-h-[600px] object-cover rounded-lg shadow-md"
    />

    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
        {heroCMS.title}
      </h1>
      <p className="text-xl mb-8 text-white drop-shadow-md">{heroCMS.content}</p>
      <button
        onClick={() => navigate("/vendor/register")}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
      >
        Register Your Store
      </button>
    </div>
  </section>
)}


      {/* Benefits Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Qwikko?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {benefits.map((b, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              {b.icon}
              <h3 className="text-xl font-semibold mt-4">{b.title}</h3>
              <p className="text-gray-600 mt-2">{b.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
