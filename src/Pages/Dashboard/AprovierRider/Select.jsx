import React from "react";

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50">
    <span className="text-xs font-semibold text-gray-400 shrink-0">
      {label}
    </span>
    <span className="text-xs font-semibold text-[#0B252C] text-right">
      {value || "—"}
    </span>
  </div>
);

const Select = ({ rider, onBack }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-[#0B252C]">
            Accepted Rider Details
          </h2>
          <p className="text-xs text-gray-400">
            Full information of the approved rider.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-xl"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-[#C0E75A] flex items-center justify-center font-black text-lg text-[#0B252C] uppercase">
          {(rider.name || "R").charAt(0)}
        </div>
        <div>
          <p className="text-sm font-black text-[#0B252C]">{rider.name}</p>
          <p className="text-xs text-gray-500">{rider.email}</p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
          {rider.status || "Approved"}
        </span>
      </div>

      <div className="rounded-xl border border-gray-100 p-4">
        <Row label="Name" value={rider.name} />
        <Row label="Email" value={rider.email} />
        <Row label="Phone Number" value={rider.phone} />
        <Row label="Region" value={rider.region} />
        <Row label="District" value={rider.district} />
        <Row label="Driving License" value={rider.drivingLicense} />
        <Row label="NID" value={rider.nid} />
        <Row label="Bike Brand / Model" value={rider.bike} />
        <Row label="Bike Registration Number" value={rider.bikeRegistration} />
        <Row label="About" value={rider.about} />
        <Row label="Status" value={rider.status || "Approved"} />
      </div>
    </div>
  );
};

export default Select;
