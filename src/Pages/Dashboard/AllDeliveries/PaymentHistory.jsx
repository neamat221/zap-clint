import React, { useState } from "react";
import { isOwnParcel, isPaidParcel } from "../../../Hok/ClientStore";

const PaymentHistory = ({ parcels = [], onSelectParcel, owner = {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const paidParcels = parcels
    .filter((p) => isPaidParcel(p) && isOwnParcel(p, owner))
    .sort((a, b) => {
      const ta = new Date(a.paidAt || a.createdAt || 0).getTime();
      const tb = new Date(b.paidAt || b.createdAt || 0).getTime();
      return tb - ta;
    });

  const rows = paidParcels.map((p, i) => ({
    parcelName: p.parcelName || p.title || `Parcel ${i + 1}`,
    recipient: {
      name: p.receiverName || "",
      address: p.receiverAddress || "N/A",
      phone: p.receiverPhone || "",
    },
    trackingNumber: p.trackingCode || p._id || p.id || "N/A",
    paymentInfo: p.deliveryCost ? `৳ ${p.deliveryCost} (Paid)` : "N/A",
    paymentMethod: p.paymentMethod || "",
    transactionId: p.transactionId || "",
    paymentAccount: p.paymentAccount || "",
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

  const downloadPDF = (row) => {
    const p = row.original;
    const cost = p.deliveryCost || p.amount?.cod || "";
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to download the PDF.");
      return;
    }
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt - ${row.trackingNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
    body { padding: 40px; color: #0B252C; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0B252C; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { font-size: 24px; color: #0B252C; }
    .brand { font-size: 11px; color: #888; }
    .paid { display: inline-block; background: #dcfce7; color: #166534; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 6px; }
    h2 { font-size: 14px; color: #0B252C; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { text-align: left; font-size: 12px; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { background: #f3f4f6; color: #6b7280; font-weight: 600; }
    .total { font-size: 16px; font-weight: bold; color: #0B252C; }
    .footer { margin-top: 32px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 12px; }
    .right { text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Payment Receipt</h1>
      <div class="brand">ZapShift — Parcel Delivery</div>
    </div>
    <div class="paid">PAID</div>
  </div>

  <table>
    <tr><th style="width:50%">Tracking Number</th><td>${row.trackingNumber}</td></tr>
    <tr><th>Parcel Name</th><td>${row.parcelName}</td></tr>
    <tr><th>Amount Paid</th><td class="total">৳ ${cost}</td></tr>
    <tr><th>Payment Method</th><td>${row.paymentMethod || "—"}</td></tr>
    <tr><th>Transaction ID</th><td>${row.transactionId || "—"}</td></tr>
    <tr><th>Payment Account</th><td>${row.paymentAccount || "—"}</td></tr>
    <tr><th>Status</th><td>Paid</td></tr>
  </table>

  <h2>Recipient Info</h2>
  <table>
    <tr><th style="width:50%">Name</th><td>${row.recipient.name || "—"}</td></tr>
    <tr><th>Address</th><td>${row.recipient.address || "—"}</td></tr>
    <tr><th>Phone</th><td>${row.recipient.phone || "—"}</td></tr>
  </table>

  <div class="footer">Generated on ${new Date().toLocaleString()} — ZapShift<br />This is a system-generated payment receipt.</div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-[#0B252C]">Payment History</h1>

      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
              <th className="py-4 px-4 font-semibold">Parcel Info</th>
              <th className="py-4 px-4 font-semibold">Recipient Info</th>
              <th className="py-4 px-4 font-semibold">Tracking Number</th>
              <th className="py-4 px-4 font-semibold">Payment Info</th>
              <th className="py-4 px-4 font-semibold">Paid Date</th>
              <th className="py-4 px-4 font-semibold">Payment Details</th>
              <th className="py-4 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No payment history yet.
                </td>
              </tr>
            ) : (
              currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition-colors even:bg-gray-50/30">
                  <td className="py-4 px-4 font-medium text-gray-700 whitespace-nowrap">{row.parcelName}</td>
                  <td className="py-4 px-4 space-y-0.5">
                    {row.recipient.name && <p className="font-semibold text-gray-700">{row.recipient.name}</p>}
                    <p className="text-gray-500 text-[11px]">{row.recipient.address}</p>
                    {row.recipient.phone && <p className="text-gray-400 text-[11px]">{row.recipient.phone}</p>}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{row.trackingNumber}</td>
<td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{row.paymentInfo}</td>
              <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                {row.original?.paidAt || row.original?.createdAt
                  ? new Date(row.original.paidAt || row.original.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </td>
              <td className="py-4 px-4 space-y-0.5 text-[11px]">
                {row.paymentMethod && (
                  <p className="font-semibold text-emerald-700 capitalize">
                    {row.paymentMethod}
                  </p>
                )}
                {row.transactionId && (
                  <p className="text-gray-500">{row.transactionId}</p>
                )}
                {row.paymentAccount && (
                  <p className="text-gray-400">{row.paymentAccount}</p>
                )}
                {!row.paymentMethod && !row.transactionId && !row.paymentAccount && (
                  <p className="text-gray-300">—</p>
                )}
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectParcel?.(row.original)}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => downloadPDF(row)}
                        className="bg-[#C0E75A] text-[#0B252C] hover:bg-[#b0d84b] font-bold px-4 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 13l3 3m0 0l3-3m-3 3V8" />
                        </svg>
                        Download PDF
                      </button>
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

export default PaymentHistory;