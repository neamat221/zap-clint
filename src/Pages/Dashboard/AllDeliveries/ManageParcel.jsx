import React, { useState } from "react";
import ParcelDetails from "./ParcelDetails";

const ManageParcel = ({ parcels = [], onSelectParcel, onPay }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const unpaidCount = parcels.filter((p) => (p.paymentStatus || "").toLowerCase() === "unpaid" || !(p.paid)).length;
  const readyPickupCount = parcels.filter((p) => /ready pick up/i.test(p.status || "")).length;
  const inTransitCount = parcels.filter((p) => /transit|in transit/i.test(p.status || "")).length;
  const readyToDeliverCount = parcels.filter((p) => /ready to deliver/i.test(p.status || "")).length;
  const deliveredCount = parcels.filter((p) => /delivered/i.test(p.status || "")).length;

  const stats = [
    { label: "Unpaid", count: unpaidCount },
    { label: "Ready Pick UP", count: readyPickupCount },
    { label: "In Transit", count: inTransitCount },
    { label: "Ready to Deliver", count: readyToDeliverCount },
    { label: "Delivered", count: deliveredCount },
  ];

  const rows = parcels.map((p, i) => ({
    parcelName: p.parcelName || p.title || `Parcel ${i + 1}`,
    recipient: {
      name: p.receiverName || "",
      address: p.receiverAddress || "N/A",
      phone: p.receiverPhone || "",
    },
    trackingNumber: p.trackingCode || p._id || p.id || "N/A",
    paymentInfo: p.deliveryCost
      ? `৳ ${p.deliveryCost} (${p.paymentStatus || (p.paid ? "Paid" : "Unpaid")})`
      : "N/A",
    original: p,
  }));

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const currentRows = rows.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-[#0B252C]">Manage Parcel</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-50/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 text-gray-400 text-sm">
              ⛵
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium whitespace-nowrap">{stat.label}</p>
              <p className="text-lg font-extrabold text-[#0B252C]">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
              <th className="py-4 px-4 font-semibold">Parcel Info</th>
              <th className="py-4 px-4 font-semibold">Recipient Info</th>
              <th className="py-4 px-4 font-semibold">Tracking Number</th>
              <th className="py-4 px-4 font-semibold">Payment Info</th>
              <th className="py-4 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No parcels yet.
                </td>
              </tr>
            ) : (
              currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700 whitespace-nowrap">{row.parcelName}</td>
                  <td className="py-4 px-4 space-y-0.5">
                    {row.recipient.name && <p className="font-semibold text-gray-700">{row.recipient.name}</p>}
                    <p className="text-gray-500 text-[11px]">{row.recipient.address}</p>
                    {row.recipient.phone && <p className="text-gray-400 text-[11px]">{row.recipient.phone}</p>}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{row.trackingNumber}</td>
                  <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{row.paymentInfo}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectParcel?.(row.original)}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        View
                      </button>
                      {!(row.original.paymentStatus === "Paid" || row.original.paid) && onPay && (
                        <button
                          onClick={() => onPay?.(row.original)}
                          className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-400">
            Showing {(currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, rows.length)} of {rows.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-7 h-7 rounded-lg ${
                  currentPage === page
                    ? "bg-[#C0E75A] font-bold text-[#0B252C]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParcel;
