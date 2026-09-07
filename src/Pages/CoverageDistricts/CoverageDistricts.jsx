import React, { useState } from "react";

const CoverageDistricts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("23.804093,90.4152376");

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    setQuery(term || "23.804093,90.4152376");
  };

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&z=11&output=embed`;

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-8">
          We are available in 64 districts
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10 max-w-xl">
          <div className="flex items-center bg-[#F1F3F6] rounded-full p-1.5 pl-5">
            <svg
              className="w-4 h-4 text-gray-400 mr-3 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs px-8 py-2.5 rounded-full transition-colors ml-2"
            >
              Search
            </button>
          </div>
        </form>

        <div className="border-t border-gray-100 my-8" />

        {/* Section Title */}
        <h2 className="text-xl md:text-2xl font-bold text-[#0B252C] mb-6">
          We deliver almost all over Bangladesh
        </h2>

        {/* Embedded Google Map for Dhaka */}
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
          <iframe
            title="Dhaka delivery coverage map"
            src={mapEmbedUrl}
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default CoverageDistricts;
