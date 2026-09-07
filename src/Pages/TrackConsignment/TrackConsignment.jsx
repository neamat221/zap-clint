import React, { useState } from "react";
import UseAxiosSecure from "../../Hok/UseAxiosSecure";

const STORAGE_KEY = "zap_my_parcels";

const formatDateTime = (date) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const dateStr = date.toLocaleDateString("en-US", options);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { dateStr, timeStr };
};

const buildTimeline = () => {
  const steps = [
    "Parcel info received.",
    "Pickup scheduled.",
    "Assigned to rider.",
    "Picked up from sender.",
    "In transit / at hub.",
    "Out for delivery.",
    "Delivered.",
  ];
  const now = new Date();
  return steps.map((status, index) => {
    const stepDate = new Date(now.getTime() - (steps.length - 1 - index) * 3600000);
    const { dateStr, timeStr } = formatDateTime(stepDate);
    return { date: dateStr, time: timeStr, status };
  });
};

const TrackConsignment = () => {
  const axiosecure = UseAxiosSecure();
  const [trackingCode, setTrackingCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [parcel, setParcel] = useState(null);

  const loadSearchParcels = async () => {
    try {
      const { data } = await axiosecure.get("/parceals");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (error) {
      console.error("Failed to fetch parcels:", error);
    }
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = trackingCode.trim().toUpperCase();
    if (!code) {
      alert("Please enter a tracking code!");
      return;
    }
    const allParcels = await loadSearchParcels();
    const matched = allParcels.find(
      (p) => p.trackingCode.toUpperCase() === code
    );
    setParcel(matched || null);
    setHasSearched(true);
  };

  const formatCreatedAt = (iso) => {
  const date = new Date(iso);
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${dateStr} ${timeStr}`;
};

const renderDetails = (p) => {
    const timeline = buildTimeline();
    const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      p.receiverDistrict
    )}&z=11&output=embed`;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Product details */}
          <div className="bg-[#F1F3F6] rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0B252C]">
              Product details
            </h2>

            {/* Date & IDs */}
            <div className="space-y-1 text-xs text-gray-500">
              <p className="italic text-gray-400 mb-2">
                {formatCreatedAt(p.createdAt)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Id :</span>{" "}
                {p._id || p.id}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Tracking Code :
                </span>{" "}
                {p.trackingCode}
              </p>
            </div>

            {/* Customer Details */}
            <div className="space-y-1 text-xs text-gray-500">
              <p>
                <span className="font-semibold text-gray-700">
                  Sender Name :
                </span>{" "}
                {p.senderName || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Sender Address :
                </span>{" "}
                {p.senderAddress || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Sender Phone :
                </span>{" "}
                {p.senderPhone || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Receiver Name :
                </span>{" "}
                {p.receiverName || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Receiver Address :
                </span>{" "}
                {p.receiverAddress || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Receiver Phone :
                </span>{" "}
                {p.receiverPhone || "N/A"}
              </p>
            </div>

            {/* Order Status Specs */}
            <div className="space-y-1 text-xs text-gray-500 pt-2">
              <p>
                <span className="font-semibold text-gray-700">Type :</span>{" "}
                {p.parcelType}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Weight :</span>{" "}
                {p.parcelWeight} KG
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Route :
                </span>{" "}
                {p.senderDistrict} → {p.receiverDistrict}
              </p>
              <div className="pt-2">
                <span className="text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  {p.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Tracking Updates */}
          <div className="bg-[#F1F3F6] rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-[#0B252C] mb-8">
              Tracking Updates
            </h2>

            {/* Timeline */}
            <div className="relative pl-2 space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-6 relative">
                  {/* Vertical connecting line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[92px] top-6 w-0.5 h-8 bg-gray-200" />
                  )}

                  {/* Timestamp */}
                  <div className="w-20 text-right shrink-0">
                    <p className="text-[11px] font-medium text-gray-700">
                      {item.date}
                    </p>
                    <p className="text-[10px] text-gray-400">{item.time}</p>
                  </div>

                  {/* Check Icon */}
                  <div className="w-7 h-7 rounded-full bg-emerald-100/80 border border-emerald-200 flex items-center justify-center shrink-0 z-10">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  {/* Status text */}
                  <div className="text-xs text-gray-700 font-medium">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Map */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0B252C] mb-4">
            Delivery Location Map
          </h2>
          <div className="w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner">
            <iframe
              title="Delivery location map"
              src={mapEmbedUrl}
              width="100%"
              height="380"
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

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        {/* Title and Subtitle */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          Track Your Consignment
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mb-8">
          Now you can easily track your consignment
        </p>

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
              placeholder="Search tracking code here"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
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

        {/* Search Result */}
        {!hasSearched && (
          <p className="text-sm text-gray-400 italic">
            Enter your tracking code and press Search to see your consignment
            details.
          </p>
        )}

        {hasSearched && !parcel && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
            <p className="text-lg font-bold text-[#0B252C] mb-1">
              Consignment not found!
            </p>
            <p className="text-xs text-gray-500">
              No consignment matches the code{" "}
              <span className="font-semibold">"{trackingCode}"</span>. Please
              check your tracking code and try again.
            </p>
          </div>
        )}

        {hasSearched && parcel && renderDetails(parcel)}
      </div>
    </div>
  );
};

export default TrackConsignment;