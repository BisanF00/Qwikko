import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleText, setTitleText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const navigate = useNavigate();
  
  const themeMode = useSelector((state) => state.customerTheme.mode);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/cms?type=customer&title=Landing%20Page"
        );

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server did not return valid JSON");
        }

        if (!data || data.length === 0) {
          throw new Error("No content found for this page");
        }

        const cmsContent = data[0];
        setContent(cmsContent);

        if (cmsContent.content) {
          const parts = cmsContent.content.split("@");
          setTitleText(parts[0].trim());
          setSubtitleText(parts[1]?.trim() || "");
        }
      } catch (err) {
        console.error("Error fetching CMS:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCMS();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--button)] mx-auto mb-4"></div>
          <p className="text-[var(--text)]">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--error)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">!</span>
          </div>
          <p className="text-[var(--error)] text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--button)] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col md:flex-row items-center w-full h-screen">
        {/* Image Section */}
        <div className="md:w-1/2 w-full h-full relative overflow-hidden">
          <img
            src={content.image_url}
            alt="Landing"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--div)] opacity-10"></div>
        </div>

        {/* Content Section*/}
        <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center items-center h-full bg-[var(--bg)]">
          <div className="max-w-md w-full text-center">
            {/* Title */}
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-500 leading-tight ${
              themeMode === 'dark' 
                ? "bg-gradient-to-br from-[var(--textbox)] to-purple-300 bg-clip-text text-transparent"
                : "bg-gradient-to-br from-[var(--button)] to-purple-900 bg-clip-text text-transparent"
            }`}>
              {titleText || "Welcome to Our Store"}
            </h1>
            
            {/* Subtitle */}
            {subtitleText && (
              <p
                className="text-lg md:text-xl mb-8 whitespace-pre-line transition-colors duration-500 leading-relaxed opacity-90"
                style={{ color: "var(--text)" }}
              >
                {subtitleText}
              </p>
            )}
            
            {/* CTA Buttons -   */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/customer/products")}
                className={`font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                  themeMode === 'dark' 
                    ? "bg-gradient-to-br from-[var(--button)] to-purple-260 text-[var(--textbox)]"
                    : "bg-[var(--button)] text-[var(--textbox)]"
                }`}
              >
                Start Shopping
              </button>
              
              <button
                onClick={() => navigate("/customer/stores")}
                className={`font-semibold py-4 px-10 rounded-xl border-2 transition-all duration-300 ${
                  themeMode === 'dark'
                    ? "border-[var(--textbox)] text-[var(--textbox)] bg-transparent"
                    : "border-[var(--button)] text-[var(--button)] bg-transparent"
                }`}
              >
                Explore Stores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="w-full py-20 bg-gradient-to-b from-[var(--bg)] to-[var(--div)]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
  <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
    themeMode === 'dark' 
      ? "bg-gradient-to-br from-[var(--button)] to-green-400 bg-clip-text text-transparent"
      : "bg-gradient-to-br from-[var(--button)] to-gray-600 bg-clip-text text-transparent"
  }`}>
    Why Choose Us
  </h2>
  <p className="text-xl text-[var(--light-gray)] max-w-3xl mx-auto leading-relaxed">
    Experience the difference with our premium services designed for your convenience and satisfaction
  </p>
</div>

{/* Features Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Feature 1 */}
  <div className={`relative rounded-2xl p-8 ${
    themeMode === 'dark' 
      ? "bg-[var(--div)] border border-gray-700" 
      : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg"
  }`}>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-[var(--button)] to-purple-600 shadow-purple-500/20" 
          : "bg-gradient-to-br from-[var(--button)] to-purple-600 shadow-purple-500/30"
      }`}>
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
    <div className="pt-8 text-center">
      <h3 className={`text-2xl font-bold mb-4 ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-gray-200 to-purple-300 bg-clip-text text-transparent" 
          : "bg-gradient-to-br from-[var(--button)] to-purple-700 bg-clip-text text-transparent"
      }`}>
        Lightning Fast
      </h3>
      <p className="text-[var(--light-gray)] leading-relaxed text-lg">
        Same-day delivery in your area with real-time tracking and instant updates
      </p>
    </div>
  </div>

  {/* Feature 2 */}
  <div className={`relative rounded-2xl p-8 ${
    themeMode === 'dark' 
      ? "bg-[var(--div)] border border-gray-700" 
      : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg"
  }`}>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20" 
          : "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
      }`}>
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    </div>
    <div className="pt-8 text-center">
      <h3 className={`text-2xl font-bold mb-4 ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-gray-200 to-green-300 bg-clip-text text-transparent" 
          : "bg-gradient-to-br from-green-600 to-emerald-700 bg-clip-text text-transparent"
      }`}>
        Bank-Level Security
      </h3>
      <p className="text-[var(--light-gray)] leading-relaxed text-lg">
        Military-grade encryption and secure payment processing for complete peace of mind
      </p>
    </div>
  </div>

  {/* Feature 3 */}
  <div className={`relative rounded-2xl p-8 ${
    themeMode === 'dark' 
      ? "bg-[var(--div)] border border-gray-700" 
      : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg"
  }`}>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-yellow-500 to-amber-600 shadow-yellow-500/20" 
          : "bg-gradient-to-br from-yellow-500 to-amber-600 shadow-yellow-500/30"
      }`}>
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div className="pt-8 text-center">
      <h3 className={`text-2xl font-bold mb-4 ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-gray-200 to-yellow-300 bg-clip-text text-transparent" 
          : "bg-gradient-to-br from-yellow-600 to-amber-700 bg-clip-text text-transparent"
      }`}>
        Premium Quality
      </h3>
      <p className="text-[var(--light-gray)] leading-relaxed text-lg">
        Curated selection of premium products with quality assurance and warranty
      </p>
    </div>
  </div>

  {/* Feature 4 */}
  <div className={`relative rounded-2xl p-8 ${
    themeMode === 'dark' 
      ? "bg-[var(--div)] border border-gray-700" 
      : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg"
  }`}>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/20" 
          : "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30"
      }`}>
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div className="pt-8 text-center">
      <h3 className={`text-2xl font-bold mb-4 ${
        themeMode === 'dark' 
          ? "bg-gradient-to-br from-gray-200 to-blue-300 bg-clip-text text-transparent" 
          : "bg-gradient-to-br from-blue-600 to-cyan-700 bg-clip-text text-transparent"
      }`}>
        24/7 Expert Support
      </h3>
      <p className="text-[var(--light-gray)] leading-relaxed text-lg">
        Round-the-clock customer service with dedicated experts ready to assist you
      </p>
    </div>
  </div>
</div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 pt-8 border-t border-[var(--border)]">
            <p className="text-lg text-[var(--light-gray)] mb-6">
              Join thousands of satisfied customers
            </p>
            <button 
              onClick={() => navigate("/customer/products")}
              className="bg-gradient-to-r from-[var(--button)] to-gray-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;