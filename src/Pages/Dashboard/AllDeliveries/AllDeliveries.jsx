import React, { useMemo, useState } from "react";
import ParcelDetails from "./ParcelDetails";
import ManageParcel from "./ManageParcel";
import PaymentHistory from "./PaymentHistory";
import PaymentCheckout from "./PaymentCheckout";
import { auth } from "../../../firebase";
import { isPaidParcel } from "../../../Hok/ClientStore";

const TAB_KEY = "zap_deliveries_tab";

const AllDeliveries = ({ parcels = [], riderFilter = null, onEdit, onPaymentSuccess, onDelete }) => {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem(TAB_KEY) || "deliveries"
  );
  const [payingParcel, setPayingParcel] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    localStorage.setItem(TAB_KEY, tab);
  };

  const handlePaymentSuccess = (paymentInfo) => {
    // Record the payment, then show the Payment History tab so the saved
    // payment details are immediately visible in the history table.
    onPaymentSuccess?.(paymentInfo);
    setPayingParcel(null);
    setActiveTab("payment");
    localStorage.setItem(TAB_KEY, "payment");
  };

  const handlePaymentBack = () => {
    setPayingParcel(null);
    setActiveTab("payment");
  };

  const deliveries = parcels
    .filter((p) => {
      if (!riderFilter) return true;
      const rid = riderFilter._id || riderFilter.id;
      return (
        p.assignedRiderId &&
        (String(p.assignedRiderId) === String(rid) ||
          String(p.assignedRiderName || "").toLowerCase() ===
            String(riderFilter.name || riderFilter.email || "").toLowerCase())
      );
    })
    .map((p, i) => ({
    id: p.trackingCode || p._id || p.id || `#PTD ${i + 1}`,
    store: p.storeName || p.shipper || "ZapShift",
    recipient: {
      name: p.receiverName || p.recipientName || "",
      address: p.receiverAddress || p.deliveryAddress || p.address || "N/A",
      phone: p.receiverPhone || p.recipientPhone || "",
    },
    status: p.status || "Pending",
    statusColor: "text-emerald-600 bg-emerald-50",
    amount: {
      cod: p.deliveryCost ? `৳ ${p.deliveryCost}` : (p.amount?.cod || "৳ 0"),
      charge: p.charge ? `৳ ${p.charge}` : (p.amount?.charge || "৳ 0"),
      discount: p.discount ? `৳ ${p.discount}` : (p.amount?.discount || "৳ 0"),
    },
    amountText: "",
    payment: isPaidParcel(p) ? "Paid" : p.paymentStatus || "Unpaid",
    paymentColor: isPaidParcel(p)
      ? "text-emerald-600"
      : "text-amber-500",
    original: p,
  }));

  const totalCount = parcels.length;
  const returnCount = parcels.filter((p) => /return/i.test(p.status || "")).length;
  const paidReturnCount = parcels.filter((p) => /paid return/i.test(p.status || "")).length;

  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const ta = new Date(a.original?.createdAt || 0).getTime();
    const tb = new Date(b.original?.createdAt || 0).getTime();
    return sortOrder === "newest" ? tb - ta : ta - tb;
  });

  const totalPages = Math.max(1, Math.ceil(sortedDeliveries.length / perPage));
  const currentDeliveries = sortedDeliveries.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Always resolve the opened parcel from the latest list so the payment
  // status/date refresh automatically after a payment succeeds.
  const selectedParcelObject = useMemo(() => {
    if (!selectedParcel) return null;
    const key = selectedParcel.trackingCode || selectedParcel._id || selectedParcel.id;
    return (
      parcels.find((p) => (p.trackingCode || p._id || p.id) === key) ||
      selectedParcel
    );
  }, [selectedParcel, parcels]);

  if (payingParcel) {
    return (
      <PaymentCheckout
        parcel={payingParcel}
        onBack={handlePaymentBack}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  if (selectedParcelObject) {
    return (
      <ParcelDetails
        parcel={selectedParcelObject}
        onBack={() => setSelectedParcel(null)}
      />
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-[#0B252C] font-sans">
      <div className="bg-white rounded-3xl p-8 shadow-sm max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <button
            onClick={() => changeTab("deliveries")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "deliveries"
                ? "bg-[#0B252C] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All Deliveries
          </button>
          <button
            onClick={() => changeTab("manage")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "manage"
                ? "bg-[#0B252C] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Manage Parcel
          </button>
          <button
            onClick={() => changeTab("payment")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "payment"
                ? "bg-[#0B252C] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Payment History
          </button>
        </div>

        {activeTab === "manage" ? (
          <ManageParcel parcels={parcels} onSelectParcel={setSelectedParcel} onPay={setPayingParcel} />
        ) : activeTab === "payment" ? (
          <PaymentHistory
            parcels={parcels}
            owner={{
              uid: auth.currentUser?.uid || "",
              email: auth.currentUser?.email || "",
            }}
            onSelectParcel={setSelectedParcel}
          />
        ) : (
          <>
            {/* Title */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-black text-[#0B252C]">All Deliveries</h1>
              {deliveries.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-400">
                    Sort by date
                  </span>
                  <button
                    onClick={() => {
                      setSortOrder("newest");
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      sortOrder === "newest"
                        ? "bg-[#0B252C] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder("oldest");
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      sortOrder === "oldest"
                        ? "bg-[#0B252C] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Oldest
                  </button>
                </div>
              )}
            </div>

            {/* Top Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              {[
                { label: "Total", count: totalCount },
                { label: "Return", count: returnCount },
                { label: "Paid Return", count: paidReturnCount },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50/80 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                    ⛵
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-extrabold text-[#0B252C]">{stat.count}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Deliveries Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
                    <th className="py-4 px-4 font-semibold">Tracking Number</th>
                    <th className="py-4 px-4 font-semibold">Date</th>
                    <th className="py-4 px-4 font-semibold">Store</th>
                    <th className="py-4 px-4 font-semibold">Recipient Info</th>
                    <th className="py-4 px-4 font-semibold">Delivery Status</th>
                    <th className="py-4 px-4 font-semibold">Amount</th>
                    <th className="py-4 px-4 font-semibold">Payment</th>
                    <th className="py-4 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400">
                        No deliveries yet. Create a booking and it will appear here.
                      </td>
                    </tr>
                  ) : (
                    currentDeliveries.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/40">
                        <td className="py-4 px-4 font-semibold text-gray-700 whitespace-nowrap">
                          {row.id}
                        </td>
                        <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                          {row.original?.createdAt
                            ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{row.store}</td>
                        <td className="py-4 px-4 space-y-0.5">
                          {row.recipient.name && (
                            <p className="font-semibold text-gray-700">{row.recipient.name}</p>
                          )}
                          <p className="text-gray-500 text-[11px]">{row.recipient.address}</p>
                          {row.recipient.phone && (
                            <p className="text-gray-400 text-[11px]">{row.recipient.phone}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-emerald-600 font-semibold">{row.status}</span>
                        </td>
                        <td className="py-4 px-4 space-y-0.5 text-gray-600 whitespace-nowrap">
                          {row.amount ? (
                            <>
                              <p>COD {row.amount.cod}</p>
                              <p className="text-gray-400 text-[11px]">Charge {row.amount.charge}</p>
                              <p className="text-gray-400 text-[11px]">Discount {row.amount.discount}</p>
                            </>
                          ) : (
                            <p className="text-gray-400">{row.amountText}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap font-medium">
                          <div className="flex items-center gap-2">
                            <span className={row.paymentColor}>{row.payment}</span>
                            {!isPaidParcel(row.original) && (
                              <button
                                onClick={() => setPayingParcel(row.original)}
                                className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedParcel(row.original)}
                              className="bg-[#0B252C] text-white hover:bg-opacity-90 font-bold w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors"
                              title="Parcel Details"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setSelectedParcel(row.original)}
                              className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold px-3 py-1.5 rounded-lg text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setDeletingId(row.id)}
                              className="bg-rose-50 text-rose-500 hover:bg-rose-100 font-bold px-3 py-1.5 rounded-lg text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {sortedDeliveries.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
                <span className="text-gray-400">
                  Showing {(currentPage - 1) * perPage + 1}–
                  {Math.min(currentPage * perPage, sortedDeliveries.length)} of{" "}
                  {sortedDeliveries.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &larr; Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}
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
          </>
        )}
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ?
            </div>
            <h3 className="text-sm font-bold text-[#0B252C]">Are you sure?</h3>
            <p className="text-xs text-gray-400">Do you want to delete this parcel?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  onDelete?.(deletingId);
                  setDeletingId(null);
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDeliveries;
