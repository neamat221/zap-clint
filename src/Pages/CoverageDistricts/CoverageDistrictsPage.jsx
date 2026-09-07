import React, { useState } from "react";
import CoverageDistrictsMap from "./CoverageDistricts";
import TrackConsignment from "../TrackConsignment/TrackConsignment";

const tabs = [
  { id: "coverage", label: "Coverage Districts" },
  { id: "track", label: "Track Consignment" },
];

const CoverageDistrictsPage = () => {
  const [activeTab, setActiveTab] = useState("coverage");

  const renderTab = () => {
    switch (activeTab) {
      case "coverage":
        return <CoverageDistrictsMap />;
      case "track":
        return <TrackConsignment />;
      default:
        return null;
    }
  };

  return (
    <section>
      <div className="bg-[#EAEBED] py-5 px-4 md:px-12 flex justify-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-1">
            Coverage Districts
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mb-6">
            Explore our delivery coverage across Bangladesh
          </p>

          {/* Inner Tab Navbar */}
          <nav className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#C0E75A] text-slate-900"
                      : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {renderTab()}
    </section>
  );
};

export default CoverageDistrictsPage;
