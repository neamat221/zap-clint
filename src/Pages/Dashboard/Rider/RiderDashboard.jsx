import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hok/UseAxiosSecure";
import useHandleAssignedRider from "./HandelAssineRider";
import { auth } from "../../../firebase";
import ParcelDetails from "../AllDeliveries/ParcelDetails";

const RiderDashboard = ({ forAdmin = false }) => {
  const axiosSecure = UseAxiosSecure();
  const { syncTracking } = useHandleAssignedRider(axiosSecure);
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("pending");
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [viewParcel, setViewParcel] = useState(null);

  const userEmail = auth.currentUser?.email || "";

  const approvedRiders = useMemo(
    () =>
      riders.filter((r) =>
        ["approved", "accepted"].includes(
          String(r.status || "").toLowerCase()
        )
      ),
    [riders]
  );

  const effectiveSelectedId =
    selectedRiderId ||
    (forAdmin && approvedRiders[0]
      ? String(approvedRiders[0]._id || approvedRiders[0].id)
      : "");

  const rider = useMemo(() => {
    if (forAdmin) {
      if (effectiveSelectedId) {
        return (
          riders.find((r) => String(r._id || r.id) === String(effectiveSelectedId)) ||
          null
        );
      }
      return approvedRiders[0] || null;
    }
    return riders.find(
      (r) =>
        String(r.email || "").toLowerCase() ===
        String(userEmail || "").toLowerCase()
    );
  }, [riders, approvedRiders, forAdmin, effectiveSelectedId, userEmail]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async (showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        const parcelUrl = forAdmin
          ? "/parceals"
          : `/parceals?riderEmail=${encodeURIComponent(userEmail)}`;
        const [parcelRes, riderRes] = await Promise.all([
          axiosSecure.get(parcelUrl),
          axiosSecure.get("/riders"),
        ]);
        if (cancelled) return;
        setParcels(Array.isArray(parcelRes.data) ? parcelRes.data : []);
        setRiders(Array.isArray(riderRes.data) ? riderRes.data : []);
      } catch (error) {
        console.error("Failed to load rider deliveries:", error);
      } finally {
        if (!cancelled && showLoader) setLoading(false);
      }
    };
    fetchData();
    const onFocus = () => fetchData(false);
    const interval = window.setInterval(() => fetchData(false), 15000);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, [axiosSecure, forAdmin, userEmail]);

  const riderId = rider?._id || rider?.id;

  const isMyParcel = useCallback(
    (p) => {
      if (!riderId || !p.assignedRiderId) return false;
      if (String(p.assignedRiderId) === String(riderId)) return true;
      return Boolean(
        p.assignedRiderEmail &&
          rider?.email &&
          String(p.assignedRiderEmail).toLowerCase() ===
            String(rider.email).toLowerCase()
      );
    },
    [riderId, rider]
  );

  const myParcels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parcels
      .filter((p) => {
        if (!isMyParcel(p)) return false;
        const status = String(p.assignmentStatus || "pending").toLowerCase();
        if (tab === "pending" && status !== "pending") return false;
        if (tab === "accepted" && status !== "accepted") return false;
        if (!q) return true;
        return [
          p.trackingCode,
          p.parcelName,
          p.receiverName || p.recipientName,
          p.receiverAddress || p.deliveryAddress,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      })
      .sort((a, b) => {
        const ta = a.riderAssignedAt ? new Date(a.riderAssignedAt).getTime() : 0;
        const tb = b.riderAssignedAt ? new Date(b.riderAssignedAt).getTime() : 0;
        return tb - ta;
      });
  }, [parcels, isMyParcel, tab, search]);

  const countFor = (status) =>
    parcels.filter((p) => {
      if (!isMyParcel(p)) return false;
      const s = String(p.assignmentStatus || "").toLowerCase();
      if (status === "pending") return !s || s === "pending";
      return s === status;
    }).length;

  const pendingCount = countFor("pending");
  const acceptedCount = countFor("accepted");

  const handleAccept = async (parcel) => {
    const id = parcel._id || parcel.id || parcel.trackingCode;
    setSavingId(id);
    try {
      const acceptedAt = new Date().toISOString();
      await axiosSecure.patch(`/parceals/${id}`, {
        assignmentStatus: "accepted",
        riderAcceptedAt: acceptedAt,
      });
      const updatedParcel = {
        ...parcel,
        assignmentStatus: "accepted",
        riderAcceptedAt: acceptedAt,
      };
      setParcels((prev) =>
        prev.map((p) =>
          (p._id || p.id || p.trackingCode) === id ? updatedParcel : p
        )
      );
      await syncTracking(updatedParcel, {
        type: "assignment",
        assignmentStatus: "accepted",
        message: "Rider accepted the delivery.",
      });
      Swal.fire({
        icon: "success",
        title: "Delivery Accepted!",
        text: `You are now responsible for delivering ${parcel.trackingCode || "this parcel"}.`,
        confirmButtonColor: "#C0E75A",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to accept delivery:", error);
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

  const handleReject = async (parcel) => {
    const id = parcel._id || parcel.id || parcel.trackingCode;
    const result = await Swal.fire({
      icon: "warning",
      title: "Reject this delivery?",
      text: `If you reject ${parcel.trackingCode || "this parcel"}, it will be returned for another rider to be assigned, and you will not be eligible for it again.`,
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
      const rejectedRiderIds = Array.isArray(parcel.rejectedRiderIds)
        ? parcel.rejectedRiderIds
        : [];
      if (riderId && !rejectedRiderIds.includes(riderId)) {
        rejectedRiderIds.push(riderId);
      }
      await axiosSecure.patch(`/parceals/${id}`, {
        assignedRiderId: null,
        assignedRiderName: null,
        assignedRiderPhone: null,
        assignedRiderEmail: null,
        riderAssignedAt: null,
        assignmentStatus: "rejected",
        rejectedRiderIds,
      });
      const updatedParcel = {
        ...parcel,
        assignedRiderId: null,
        assignedRiderName: null,
        assignedRiderPhone: null,
        assignedRiderEmail: null,
        riderAssignedAt: null,
        assignmentStatus: "rejected",
        rejectedRiderIds,
      };
      setParcels((prev) =>
        prev.map((p) =>
          (p._id || p.id || p.trackingCode) === id ? updatedParcel : p
        )
      );
      await syncTracking(updatedParcel, {
        type: "assignment",
        assignmentStatus: "rejected",
        message: "Rider rejected the delivery.",
      });
      Swal.fire({
        icon: "success",
        title: "Delivery Rejected",
        text: `The parcel has been returned to be assigned to another rider.`,
        confirmButtonColor: "#C0E75A",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to reject delivery:", error);
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

  const statusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "accepted") return "bg-emerald-100 text-emerald-700";
    if (s === "rejected") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-black text-[#0B252C]">
            {forAdmin ? "Rider Dashboard" : "My Deliveries"}
          </h2>
          <p className="text-xs text-gray-400">
            {forAdmin
              ? "View the deliveries assigned to each rider."
              : rider
              ? `Welcome back, ${rider.name}. Review and accept or reject your assigned deliveries.`
              : "Your assigned deliveries will appear here."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {forAdmin && (
            <select
              value={effectiveSelectedId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C0E75A]"
            >
              <option value="">Select a rider...</option>
              {approvedRiders.map((r) => (
                <option key={r._id || r.id} value={r._id || r.id}>
                  {r.name || r.email}
                </option>
              ))}
            </select>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tracking, parcel, recipient..."
            className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C0E75A]"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-lg">
        {[
          { label: "Pending", count: pendingCount },
          { label: "Accepted", count: acceptedCount },
          { label: "Total", count: pendingCount + acceptedCount },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/80 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-extrabold text-[#0B252C]">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
        {[
          { id: "pending", label: "Pending Response", count: pendingCount },
          { id: "accepted", label: "Accepted", count: acceptedCount },
          { id: "all", label: "All", count: pendingCount + acceptedCount },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === t.id
                ? "bg-[#C0E75A] text-[#0B252C]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">
          Loading deliveries...
        </div>
      ) : !riderId ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            {forAdmin ? "No rider selected" : "No rider profile found"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {forAdmin
              ? "Select a rider from the dropdown to view their deliveries."
              : "Your rider account must be approved before deliveries can be assigned to you."}
          </p>
        </div>
      ) : myParcels.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No {tab === "all" ? "" : tab} deliveries found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {tab === "pending"
              ? "No deliveries are waiting for your response right now."
              : "Try a different search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/60 text-gray-500 border-b border-gray-100">
                <th className="py-4 px-4 font-semibold">Tracking Code</th>
                <th className="py-4 px-4 font-semibold">Parcel Info</th>
                <th className="py-4 px-4 font-semibold">Recipient</th>
                <th className="py-4 px-4 font-semibold">Address</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myParcels.map((parcel) => {
                const id = parcel._id || parcel.id || parcel.trackingCode;
                const isPending =
                  String(parcel.assignmentStatus || "pending").toLowerCase() ===
                  "pending";
                return (
                  <tr key={id} className="hover:bg-gray-50/40">
                    <td className="py-4 px-4 font-semibold whitespace-nowrap">
                      <button
                        onClick={() => setViewParcel(parcel)}
                        className="text-[#0B252C] underline decoration-[#C0E75A] underline-offset-2 hover:text-[#C0E75A]"
                      >
                        {parcel.trackingCode || id}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                      <p className="font-semibold text-gray-700">
                        {parcel.parcelName || "—"}
                      </p>
                      <p className="text-gray-400 text-[11px] capitalize">
                        {parcel.parcelType || "document"}
                        {parcel.parcelWeight ? ` • ${parcel.parcelWeight} KG` : ""}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                      {parcel.receiverName || parcel.recipientName || "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {parcel.receiverAddress || parcel.deliveryAddress || ""}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-emerald-600 font-semibold">
                        {parcel.status || "Pending"}
                      </span>
                      <span
                        className={`ml-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusBadge(
                          parcel.assignmentStatus
                        )}`}
                      >
                        {String(parcel.assignmentStatus || "pending").toLowerCase() ===
                        "accepted"
                          ? "Accepted"
                          : "Pending Response"}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(parcel)}
                            disabled={savingId !== null}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs disabled:opacity-50"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleReject(parcel)}
                            disabled={savingId !== null}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs disabled:opacity-50"
                          >
                            No
                          </button>
                          <button
                            onClick={() => setViewParcel(parcel)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-1.5 rounded-lg text-xs"
                          >
                            Details
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-600">
                            Accepted
                          </span>
                          <button
                            onClick={() => setViewParcel(parcel)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-1.5 rounded-lg text-xs"
                          >
                            Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {viewParcel && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">
          <ParcelDetails
            parcel={viewParcel}
            onBack={() => setViewParcel(null)}
          />
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;
