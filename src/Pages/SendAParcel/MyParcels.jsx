import React, { useState } from "react";

const Field = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-xs text-gray-700 font-medium">{value || "—"}</p>
  </div>
);

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

const MyParcels = ({ parcels, onRemove }) => {
  const [expanded, setExpanded] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");

  const pid = (p) => p._id || p.id;
  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const sortedParcels = [...parcels].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return sortOrder === "newest" ? tb - ta : ta - tb;
  });

  const confirmRemove = () => {
    if (pendingRemove) {
      onRemove(pendingRemove);
    }
    setPendingRemove(null);
  };

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-start">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          My Parcels
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <p className="text-gray-400 text-xs md:text-sm">
            View and manage your parcels
          </p>
          <div className="flex items-center gap-2">
            {parcels.length > 0 && (
              <>
                <span className="text-[11px] font-semibold text-gray-400">
                  Sort by date
                </span>
                <button
                  onClick={() => setSortOrder("newest")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    sortOrder === "newest"
                      ? "bg-[#0B252C] text-white"
                      : "bg-[#F1F3F6] text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortOrder("oldest")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    sortOrder === "oldest"
                      ? "bg-[#0B252C] text-white"
                      : "bg-[#F1F3F6] text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Oldest
                </button>
              </>
            )}
          </div>
        </div>

        {parcels.length === 0 ? (
          <div className="bg-[#F1F3F6] rounded-3xl p-10 text-center">
            <p className="text-base font-bold text-[#0B252C] mb-1">
              No parcels yet
            </p>
            <p className="text-xs text-gray-500">
              Create a booking from the "Send A Parcel" tab and it will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedParcels.map((parcel) => {
              const id = pid(parcel);
              return (
              <div
                key={id}
                className="border border-gray-100 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B252C]">
                      {parcel.parcelName}
                    </h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Tracking Code :{" "}
                      <span className="font-semibold text-gray-600">
                        {parcel.trackingCode}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0B252C] bg-[#F1F3F6] px-3 py-1 rounded-lg">
                      ৳{parcel.deliveryCost ?? "—"} TK
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatCreatedAt(parcel.createdAt)}
                    </span>
                    <span className="text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded text-[11px]">
                      {parcel.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Field
                  label="Parcel Type"
                  value={
                    parcel.parcelType === "document"
                      ? "Document"
                      : parcel.parcelType === "non-document"
                        ? "Non-Document"
                        : parcel.parcelType
                  }
                />
                  <Field label="Weight" value={`${parcel.parcelWeight} KG`} />
                  <Field
                    label="Sender"
                    value={`${parcel.senderName}, ${parcel.senderDistrict}`}
                  />
                  <Field
                    label="Receiver"
                    value={`${parcel.receiverName}, ${parcel.receiverDistrict}`}
                  />
                </div>

                <button
                  onClick={() => toggle(id)}
                  className="mt-4 text-xs font-bold text-[#0B252C] bg-[#F1F3F6] px-4 py-2 rounded-lg hover:bg-[#e8ebef] transition-colors"
                >
                  {expanded === id ? "Hide Details" : "View Details"}
                </button>
                <button
                  onClick={() => setPendingRemove(parcel)}
                  className="mt-4 ml-2 text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Remove Parcel
                </button>

                {expanded === id && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-100 pt-5">
                    <Field label="Sender Phone" value={parcel.senderPhone} />
                    <Field
                      label="Sender Address"
                      value={parcel.senderAddress}
                    />
                    <Field label="District" value={parcel.senderDistrict} />
                    <Field
                      label="Pickup Instruction"
                      value={parcel.pickupInstruction}
                    />
                    <Field
                      label="Receiver Phone"
                      value={parcel.receiverPhone}
                    />
                    <Field
                      label="Receiver Address"
                      value={parcel.receiverAddress}
                    />
                    <Field
                      label="Receiver District"
                      value={parcel.receiverDistrict}
                    />
                    <Field
                      label="Delivery Instruction"
                      value={parcel.deliveryInstruction}
                    />
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {pendingRemove !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-[#0B252C] mb-2">
              Remove this parcel?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {pendingRemove?.parcelName
                ? `"${pendingRemove.parcelName}" will be removed permanently.`
                : "This action cannot be undone."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmRemove}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setPendingRemove(null)}
                className="flex-1 bg-[#F1F3F6] hover:bg-[#e8ebef] text-[#0B252C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcels;