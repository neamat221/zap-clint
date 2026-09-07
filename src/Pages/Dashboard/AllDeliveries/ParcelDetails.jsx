import React from "react";

const ParcelDetails = ({ parcel, onBack }) => {
  const p = parcel || {};

  const senderInfo = [
    { label: "Name", value: p.senderName || p.sender_name || "N/A" },
    { label: "Phone", value: p.senderPhone || p.sender_phone || "N/A" },
    { label: "Email", value: p.senderEmail || "N/A" },
    { label: "Region", value: p.senderRegion || p.sender_region || "N/A" },
    { label: "Address", value: p.senderAddress || p.sender_address || "N/A" },
  ];

  const receiverInfo = [
    { label: "Name", value: p.receiverName || p.receiver_name || "N/A" },
    { label: "Phone", value: p.receiverPhone || p.receiver_phone || "N/A" },
    { label: "Email", value: p.receiverEmail || "N/A" },
    { label: "Region", value: p.receiverRegion || p.receiver_region || "N/A" },
    { label: "Address", value: p.receiverAddress || p.receiver_address || "N/A" },
  ];

  const parcelInfo = [
    { label: "Parcel Name", value: p.parcelName || p.parcelTitle || p.title || "N/A" },
    { label: "Type", value: p.parcelType || p.type || "N/A" },
    { label: "Weight", value: p.parcelWeight ? `${p.parcelWeight} KG` : "N/A" },
    { label: "Charge", value: p.deliveryCost ? `Tk ${p.deliveryCost}` : "N/A" },
    { label: "Status", value: p.status || "Pending" },
    { label: "Pickup Instruction", value: p.pickupInstruction || "N/A" },
    { label: "Delivery Instruction", value: p.deliveryInstruction || "N/A" },
    { label: "Tracking Number", value: p.trackingCode || p._id || p.id || "N/A" },
    { label: "Pickup OTP", value: p.pickupOtp || "N/A" },
    { label: "Delivery OTP", value: p.deliveryOtp || "N/A" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10 text-[#0B252C] font-sans">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xs max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C]">
            Parcel Details
          </h1>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 bg-[#0B252C] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-opacity-90"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/80 p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0B252C]">Sender Info</h2>
            <div className="space-y-2 text-xs">
              {senderInfo.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2">
                  <span className="text-gray-400 font-medium">{item.label}</span>
                  <span className="col-span-3 text-[#0B252C] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50/80 p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0B252C]">Receiver Info</h2>
            <div className="space-y-2 text-xs">
              {receiverInfo.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2">
                  <span className="text-gray-400 font-medium">{item.label}</span>
                  <span className="col-span-3 text-[#0B252C] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/80 p-6 rounded-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-[#0B252C]">Parcel Details</h2>
            <div className="space-y-2 text-xs">
              {parcelInfo.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2">
                  <span className="text-gray-400 font-medium">{item.label}</span>
                  <span className="col-span-3 text-[#0B252C] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
