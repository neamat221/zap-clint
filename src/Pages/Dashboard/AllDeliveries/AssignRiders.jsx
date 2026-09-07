import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hok/UseAxiosSecure";
import ParcelDetails from "./ParcelDetails";

const rejectedIds = (parcel) =>
  Array.isArray(parcel.rejectedRiderIds) ? parcel.rejectedRiderIds : [];

const AssignRiders = ({ onViewDeliveries }) => {
  const axiosSecure = UseAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("unassigned");
  const [drafts, setDrafts] = useState({});
  const [toast, setToast] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [riderFilter, setRiderFilter] = useState("");
  const perPage = 10;

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parcelRes, riderRes] = await Promise.all([
          axiosSecure.get("/parceals"),
          axiosSecure.get("/riders"),
        ]);
        if (cancelled) return;
        setParcels(Array.isArray(parcelRes.data) ? parcelRes.data : []);
        setRiders(Array.isArray(riderRes.data) ? riderRes.data : []);
      } catch (error) {
        console.error("Failed to load assignments data:", error);
        if (!cancelled) showToast("Failed to load data. Please try again.", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const keyOf = (p) => p._id || p.id || p.trackingCode;
  const idOf = (r) => r._id || r.id;
  const isPaid = (p) =>
    p.paid === true || /paid/i.test(String(p.paymentStatus || ""));

  const rejectedRiderNames = useCallback(
    (parcel) =>
      rejectedIds(parcel)
        .map((rid) => {
          const r = riders.find((x) => String(idOf(x)) === String(rid));
          return r?.name || r?.email || "";
        })
        .filter(Boolean),
    [riders]
  );

  const paidParcels = useMemo(() => parcels.filter(isPaid), [parcels]);

  const approvedRiders = useMemo(
    () =>
      riders.filter((r) =>
        ["approved", "accepted"].includes(
          String(r.status || "").toLowerCase()
        )
      ),
    [riders]
  );

  const counts = useMemo(
    () => ({
      total: paidParcels.length,
      assigned: paidParcels.filter((p) => p.assignedRiderId).length,
      unassigned: paidParcels.filter((p) => !p.assignedRiderId).length,
      rejected: paidParcels.filter((p) => rejectedIds(p).length > 0).length,
      accepted: paidParcels.filter(
        (p) => String(p.assignmentStatus || "").toLowerCase() === "accepted"
      ).length,
    }),
    [paidParcels]
  );

  const filteredParcels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return paidParcels
      .filter((p) => {
        if (tab === "assigned" && !p.assignedRiderId) return false;
        if (tab === "unassigned" && p.assignedRiderId) return false;
        if (tab === "rejected" && rejectedIds(p).length === 0) return false;
        if (
          tab === "select" &&
          String(p.assignmentStatus || "").toLowerCase() !== "accepted"
        )
          return false;
        if (
          riderFilter &&
          String(p.assignedRiderId) !== String(riderFilter) &&
          !rejectedIds(p).includes(riderFilter)
        )
          return false;
        if (!q) return true;
        const track = String(p.trackingCode || "").toLowerCase();
        const store = String(p.storeName || p.shipper || "").toLowerCase();
        const receiver = String(
          p.receiverName || p.recipientName || ""
        ).toLowerCase();
        const rider = String(p.assignedRiderName || "").toLowerCase();
        const rejectedNames = rejectedRiderNames(p)
          .join(" ")
          .toLowerCase();
        return (
          track.includes(q) ||
          store.includes(q) ||
          receiver.includes(q) ||
          rider.includes(q) ||
          rejectedNames.includes(q)
        );
      })
      .sort(
        (a, b) =>
          Number(!!b.assignedRiderId) - Number(!!a.assignedRiderId)
      );
  }, [paidParcels, tab, search, riderFilter, rejectedRiderNames]);

  const totalPages = Math.max(1, Math.ceil(filteredParcels.length / perPage));
  const currentParcels = filteredParcels.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleAssign = async (parcel) => {
    const id = keyOf(parcel);
    const riderId = drafts[id];
    if (!id) return;
    if (!riderId) {
      showToast("Please select a rider first.", "error");
      return;
    }
    const rider = approvedRiders.find((r) => idOf(r) === riderId);
    setSavingId(id);
    try {
      const rejectedRiderIds = (
        Array.isArray(parcel.rejectedRiderIds) ? parcel.rejectedRiderIds : []
      ).filter((rid) => String(rid) !== String(riderId));
      const payload = {
        assignedRiderId: riderId,
        assignedRiderName: rider?.name || rider?.email || "Rider",
        assignedRiderPhone: rider?.phone || "",
        assignedRiderEmail: rider?.email || "",
        riderAssignedAt: new Date().toISOString(),
        assignmentStatus: "pending",
        rejectedRiderIds,
      };
      await axiosSecure.patch(`/parceals/${id}`, payload);
      setParcels((prev) =>
        prev.map((p) => (keyOf(p) === id ? { ...p, ...payload } : p))
      );
      showToast(`Assigned to ${payload.assignedRiderName}`);
    } catch (error) {
      console.error("Failed to assign rider:", error);
      showToast("Failed to save assignment. Please try again.", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleUnassign = async (parcel) => {
    const id = keyOf(parcel);
    const riderName = parcel.assignedRiderName || "this rider";

    const result = await Swal.fire({
      icon: "warning",
      title: "Remove Assignment?",
      text: `Are you sure you want to unassign ${riderName} from ${parcel.trackingCode || "this parcel"}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "No",
      confirmButtonColor: "#C0E75A",
      cancelButtonColor: "#d1d5db",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSavingId(id);
    try {
      await axiosSecure.patch(`/parceals/${id}`, {
        assignedRiderId: null,
        assignedRiderName: null,
        assignedRiderPhone: null,
        riderAssignedAt: null,
      });
      setParcels((prev) =>
        prev.map((p) =>
          keyOf(p) === id
            ? {
                ...p,
                assignedRiderId: null,
                assignedRiderName: null,
                assignedRiderPhone: null,
                riderAssignedAt: null,
              }
            : p
        )
      );
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "The rider assignment has been removed.",
        confirmButtonColor: "#C0E75A",
      });
    } catch (error) {
      console.error("Failed to unassign rider:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#C0E75A",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleRejectRider = async (parcel) => {
    const id = keyOf(parcel);
    const riderId = parcel.assignedRiderId;
    const riderName = parcel.assignedRiderName || "this rider";
    if (!riderId) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Reject Rider?",
      text: `Reject ${riderName} for ${parcel.trackingCode || "this parcel"}? They will no longer be eligible to be assigned to this parcel.`,
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "No",
      confirmButtonColor: "#C0E75A",
      cancelButtonColor: "#d1d5db",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setSavingId(id);
    try {
      const rejectedRiderIds = [
        ...rejectedIds(parcel),
        riderId,
      ];
      await axiosSecure.patch(`/parceals/${id}`, {
        assignedRiderId: null,
        assignedRiderName: null,
        assignedRiderPhone: null,
        assignedRiderEmail: null,
        riderAssignedAt: null,
        assignmentStatus: "rejected",
        rejectedRiderIds,
      });
      setParcels((prev) =>
        prev.map((p) =>
          keyOf(p) === id
            ? {
                ...p,
                assignedRiderId: null,
                assignedRiderName: null,
                assignedRiderPhone: null,
                assignedRiderEmail: null,
                riderAssignedAt: null,
                assignmentStatus: "rejected",
                rejectedRiderIds,
              }
            : p
        )
      );
      showToast(`${riderName} rejected for this parcel`);
    } catch (error) {
      console.error("Failed to reject rider:", error);
      showToast("Failed to reject rider. Please try again.", "error");
    } finally {
      setSavingId(null);
    }
  };

  const renderRiderBadge = (parcel) => (
    <div className="flex flex-col gap-1 items-start">
      {parcel.assignedRiderId ? (
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {parcel.assignedRiderName || "Rider"}
          </span>
          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
            {parcel.assignmentStatus === "accepted"
              ? "Accepted"
              : "Pending response"}
          </span>
          <button
            onClick={() => handleRejectRider(parcel)}
            disabled={savingId !== null}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold disabled:opacity-50"
            title="Reject this rider for this parcel"
          >
            Reject
          </button>
          <button
            onClick={() => handleUnassign(parcel)}
            disabled={savingId !== null}
            className="text-[11px] text-gray-400 hover:text-gray-600 font-semibold disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
          Unassigned
        </span>
      )}
      {rejectedRiderNames(parcel).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rejectedRiderNames(parcel).map((name, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold inline-flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-rose-500" />
              {name} · Rejected
            </span>
          ))}
        </div>
      )}
    </div>
  );

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
          <h2 className="text-lg font-black text-[#0B252C]">Assign Riders</h2>
          <p className="text-xs text-gray-400">
            Assign approved riders to delivery parcels.
          </p>
        </div>
        {onViewDeliveries && (
          <button
            onClick={onViewDeliveries}
            className="text-xs font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            View Deliveries by Rider
          </button>
        )}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by ID, store, recipient or rider..."
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C0E75A]"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 max-w-3xl">
        {[
          { label: "Total", count: counts.total },
          { label: "Assigned", count: counts.assigned },
          { label: "Unassigned", count: counts.unassigned },
          { label: "Rejected", count: counts.rejected },
          { label: "Select", count: counts.accepted },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/80 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-extrabold text-[#0B252C]">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-100 pb-3">
        {[
          { id: "unassigned", label: "Unassigned", count: counts.unassigned },
          { id: "assigned", label: "Assigned", count: counts.assigned },
          { id: "rejected", label: "Rejected", count: counts.rejected },
          { id: "select", label: "Select", count: counts.accepted },
          { id: "all", label: "All", count: counts.total },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === t.id
                ? "bg-[#C0E75A] text-[#0B252C]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
        <select
          value={riderFilter}
          onChange={(e) => {
            setRiderFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="ml-auto px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C0E75A]"
          title="Filter by rider"
        >
          <option value="">Select rider (All)</option>
          {riders
            .filter((r) =>
              ["approved", "accepted", "rejected", "pending"].includes(
                String(r.status || "").toLowerCase()
              )
            )
            .map((r) => (
              <option key={idOf(r)} value={idOf(r)}>
                {r.name || r.email} ({String(r.status || "pending")})
              </option>
            ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">
          Loading deliveries...
        </div>
      ) : approvedRiders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No approved riders available
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Approve riders from the "Approve Riders" section to assign them
            to deliveries.
          </p>
        </div>
      ) : filteredParcels.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No {tab === "all" ? "" : tab} paid deliveries found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {tab === "unassigned"
              ? "All paid deliveries have a rider assigned."
              : "Try a different search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
                <th className="py-4 px-4 font-semibold">trackingCode</th>
                <th className="py-4 px-4 font-semibold">Store</th>
                <th className="py-4 px-4 font-semibold">Parcel Info</th>
                <th className="py-4 px-4 font-semibold">Recipient</th>
                <th className="py-4 px-4 font-semibold">Delivery Status</th>
                <th className="py-4 px-4 font-semibold">Assigned Rider</th>
                <th className="py-4 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentParcels.map((parcel) => {
                const id = keyOf(parcel);
                const defaultRider =
                  drafts[id] || parcel.assignedRiderId || "";
                return (
                  <tr key={id} className="hover:bg-gray-50/40">
                    <td className="py-4 px-4 font-semibold text-gray-700 whitespace-nowrap">
                      {parcel.trackingCode || id}
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                      {parcel.storeName || parcel.shipper || "ZapShift"}
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap space-y-0.5">
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="font-semibold text-gray-700 hover:text-white hover:bg-red-400 px-2 py-1 rounded-lg text-left transition-colors"
                        title="View parcel details"
                      >
                        {parcel.parcelName || "—"}
                      </button>
                      <p className="text-gray-400 text-[11px] capitalize">
                        {parcel.parcelType || "document"}
                        {parcel.parcelWeight ? ` • ${parcel.parcelWeight} KG` : ""}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        {parcel.deliveryCost ? `৳ ${parcel.deliveryCost}` : "৳ 0"} charge
                      </p>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <p className="font-semibold text-gray-700">
                        {parcel.receiverName || parcel.recipientName || "—"}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        {parcel.receiverAddress || parcel.deliveryAddress || ""}
                      </p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-emerald-600 font-semibold">
                        {parcel.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {renderRiderBadge(parcel)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={defaultRider}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [id]: e.target.value,
                            }))
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C0E75A] max-w-[150px]"
                        >
                          {parcel.assignedRiderId &&
                            !approvedRiders.some(
                              (r) => idOf(r) === parcel.assignedRiderId
                            ) && (
                              <option value={parcel.assignedRiderId}>
                                {parcel.assignedRiderName || "Rider"}
                              </option>
                            )}
                          {approvedRiders
                            .filter(
                              (r) =>
                                !rejectedIds(parcel).includes(idOf(r))
                            )
                            .map((rider) => (
                              <option key={idOf(rider)} value={idOf(rider)}>
                                {rider.name || rider.email}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleAssign(parcel)}
                          disabled={savingId !== null}
                          className="bg-[#0B252C] text-white hover:bg-opacity-90 font-bold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                        >
                          {parcel.assignedRiderId ? "Change" : "Assign"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredParcels.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-400">
            Showing {(currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, filteredParcels.length)} of{" "}
            {filteredParcels.length}
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg bg-[#0B252C]">
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AssignRiders;