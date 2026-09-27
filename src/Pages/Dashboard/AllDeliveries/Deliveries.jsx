import React, { useEffect, useMemo, useState } from "react";
import ParcelDetails from "./ParcelDetails";
import { getParcels, getRiders, isPaidParcel, onStoreChange } from "../../../Hok/ClientStore";

const perPage = 10;

const Deliveries = ({ onBack, onSelectRider }) => {
  const [riders, setRiders] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      setRiders(getRiders());
      setParcels(getParcels());
      setLoading(false);
    };
    refresh();
    const un = onStoreChange(refresh);
    return () => {
      cancelled = true;
      un();
    };
  }, []);

  const approvedRiders = useMemo(
    () =>
      riders.filter((r) =>
        ["approved", "accepted"].includes(
          String(r.status || "").toLowerCase()
        )
      ),
    [riders]
  );

  const idOf = (r) => r._id || r.id;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rowTime = (row) =>
      row.assigned.reduce(
        (max, p) =>
          Math.max(
            max,
            new Date(p.riderAssignedAt || p.updatedAt || p.createdAt || 0).getTime() ||
              0
          ),
        0
      );
    return approvedRiders
      .map((rider) => {
        const rid = idOf(rider);
        const assigned = parcels.filter(
          (p) =>
            p.assignedRiderId &&
            (String(p.assignedRiderId) === String(rid) ||
              String(p.assignedRiderName || "").toLowerCase() ===
                String(rider.name || rider.email || "").toLowerCase())
        );
        return { rider, assigned };
      })
      .filter((row) => {
        if (!q) return true;
        const r = row.rider;
        return (
          String(r.name || "").toLowerCase().includes(q) ||
          String(r.email || "").toLowerCase().includes(q) ||
          String(r.phone || "").toLowerCase().includes(q) ||
          String(r.district || "").toLowerCase().includes(q) ||
          row.assigned.some((p) =>
            String(p.trackingCode || "").toLowerCase().includes(q)
          )
        );
      })
      .sort((a, b) => rowTime(b) - rowTime(a));
  }, [approvedRiders, parcels, search]);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const currentRows = rows.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (selectedParcel) {
    return (
      <ParcelDetails
        parcel={selectedParcel}
        onBack={() => setSelectedParcel(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#0B252C]">
              Deliveries by Rider
            </h2>
            {onBack && (
              <button
                onClick={onBack}
                className="text-[11px] font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1 rounded-lg"
              >
                &larr; Assign Riders
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Full details of approved riders and their assigned deliveries.
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search rider, district or tracking..."
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C0E75A]"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">
          Loading rider deliveries...
        </div>
      ) : approvedRiders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No approved riders found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Approve riders from the "Approve Riders" section to see their
            deliveries here.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">No results found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentRows.map(({ rider, assigned }) => (
            <div
              key={idOf(rider)}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-50/80 p-4 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C0E75A] flex items-center justify-center font-black text-sm text-[#0B252C] uppercase">
                  {(rider.name || "R").charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onSelectRider?.(rider)}
                    className="text-sm font-black text-[#0B252C] hover:text-[#71C5C7] text-left"
                    title="View this rider's deliveries"
                  >
                    {rider.name}
                  </button>
                  <p className="text-[11px] text-gray-400">
                    {rider.email} {rider.phone ? `• ${rider.phone}` : ""}
                    {rider.district ? ` • ${rider.district}` : ""}
                  </p>
                </div>
                {onSelectRider && (
                  <button
                    onClick={() => onSelectRider(rider)}
                    className="text-[11px] font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View in Deliveries
                  </button>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Bike</p>
                    <p className="font-semibold text-gray-700">
                      {rider.bike || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Reg. No.
                    </p>
                    <p className="font-semibold text-gray-700">
                      {rider.bikeRegistration || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">NID</p>
                    <p className="font-semibold text-gray-700">
                      {rider.nid || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Assigned
                    </p>
                    <p className="font-semibold text-gray-700">
                      {assigned.length} parcel{assigned.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              {assigned.length === 0 ? (
                <p className="p-4 text-center text-xs text-gray-400">
                  No deliveries assigned yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
                        <th className="py-3 px-4 font-semibold">Tracking Code</th>
                        <th className="py-3 px-4 font-semibold">Parcel</th>
                        <th className="py-3 px-4 font-semibold">Recipient</th>
                        <th className="py-3 px-4 font-semibold">Address</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assigned.map((p) => (
                        <tr key={p._id || p.trackingCode || p.id}>
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">
                            <button
                              onClick={() => setSelectedParcel(p)}
                              title="View in Deliveries"
                              className="text-[#71C5C7] hover:text-[#0B252C] hover:underline text-left"
                            >
                              {p.trackingCode || p._id || p.id}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {p.parcelName || p.title || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {p.receiverName || p.recipientName || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {p.receiverAddress || p.deliveryAddress || "—"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                              {p.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium">
                            <span
                              className={
                                isPaidParcel(p)
                                  ? "text-emerald-600"
                                  : "text-amber-500"
                              }
                            >
                              {isPaidParcel(p)
                                ? "Paid"
                                : "Unpaid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rows.length > perPage && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
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

export default Deliveries;
