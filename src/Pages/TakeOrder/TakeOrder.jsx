import React, { useState } from "react";
import TrackConsignment from "../TrackConsignment/TrackConsignment";

const tabs = [
  { id: "track", label: "Track Consignment" },
  { id: "new", label: "New Order" },
  { id: "orders", label: "My Orders" },
];

const TakeOrder = () => {
  const [activeTab, setActiveTab] = useState("track");

  const renderTab = () => {
    switch (activeTab) {
      case "track":
        return <TrackConsignment />;
      case "new":
        return (
          <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
            <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
                Create New Order
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mb-8">
                Place a new consignment order
              </p>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
            <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
                My Orders
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mb-8">
                View and manage your orders
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section>
      <div className="bg-[#EAEBED] py-5 px-4 md:px-12 flex justify-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-1">
            Take Order
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mb-6">
            Manage your consignments from one place
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

export default TakeOrder;
