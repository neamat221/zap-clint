import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hok/UseAxiosSecure";
import Select from "./Select";

const AprovierRider = ({ onApprove }) => {
  const axiosSecure = UseAxiosSecure();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRider, setSelectedRider] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const perPage = 10;

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const { data } = await axiosSecure.get("/riders");
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            const timeA =
              (a.createdAt && new Date(a.createdAt).getTime()) ||
              (a._id && a._id.timestamp ? a._id.timestamp * 1000 : 0) ||
              a.insertedId || 0;
            const timeB =
              (b.createdAt && new Date(b.createdAt).getTime()) ||
              (b._id && b._id.timestamp ? b._id.timestamp * 1000 : 0) ||
              b.insertedId || 0;
            return timeB - timeA;
          });
          setRiders(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch riders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRiders();
  }, [axiosSecure]);

  const handleStatus = async (rider, status) => {
    const id = rider._id || rider.id;
    if (!id) return;
    setUpdatingId(rider._id || id);
    try {
      const { data } = await axiosSecure.patch(`/riders/${id}`, { status });
      setRiders((prev) =>
        prev.map((r) =>
          (r._id || r.id) === (rider._id || rider.id) ? { ...r, status: data.status } : r
        )
      );
      if (status.toLowerCase() === "approved") {
        if (onApprove) {
          onApprove({ ...rider, ...data });
        } else {
          setSelectedRider({ ...rider, ...data });
        }
      }
    } catch (error) {
      console.error("Failed to update rider:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved" || s === "accepted")
      return "bg-emerald-100 text-emerald-700";
    if (s === "rejected")
      return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  const filteredRiders = riders.filter((r) => {
    const s = String(r.status || "").toLowerCase();
    if (activeTab === "Pending") return s !== "approved" && s !== "rejected";
    if (activeTab === "Approved")
      return s === "approved" || s === "accepted";
    if (activeTab === "Rejected") return s === "rejected";
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRiders.length / perPage));
  const currentRiders = filteredRiders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (selectedRider) {
    return (
      <Select
        rider={selectedRider}
        onBack={() => setSelectedRider(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-black text-[#0B252C]">Rider Applications</h2>
          <p className="text-xs text-gray-400">
            Review and approve or reject rider applications.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
        {["Pending", "Approved", "Rejected"].map((tab) => {
          const count =
            tab === "Approved"
              ? riders.filter((r) =>
                  ["approved", "accepted"].includes(String(r.status || "").toLowerCase())
                ).length
              : tab === "Rejected"
              ? riders.filter((r) => String(r.status || "").toLowerCase() === "rejected").length
              : riders.filter(
                  (r) =>
                    !["approved", "rejected"].includes(
                      String(r.status || "").toLowerCase()
                    )
                ).length;
          return (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab
                  ? "bg-[#C0E75A] text-[#0B252C]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading riders...</div>
      ) : filteredRiders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">
            No {activeTab === "Pending" ? "pending" : activeTab.toLowerCase()} rider applications
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {activeTab === "Pending"
              ? 'Applications submitted from "Be a Rider" will appear here.'
              : "No riders in this category yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] text-gray-400">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Phone</th>
                <th className="pb-3 font-semibold">District</th>
                <th className="pb-3 font-semibold">Bike</th>
                <th className="pb-3 font-semibold">Bike Registration Number</th>
                <th className="pb-3 font-semibold">NID</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {currentRiders.map((rider) => (
                <tr key={rider._id || rider.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 font-semibold">{rider.name}</td>
                  <td className="py-3.5 text-gray-600">{rider.email}</td>
                  <td className="py-3.5 text-gray-600">{rider.phone}</td>
                  <td className="py-3.5 text-gray-600">{rider.district}</td>
                  <td className="py-3.5 text-gray-600">{rider.bike}</td>
                  <td className="py-3.5 text-gray-600">{rider.bikeRegistration}</td>
                  <td className="py-3.5 text-gray-600">{rider.nid}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(rider.status)}`}
                    >
                      {rider.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatus(rider, "Approved")}
                        disabled={updatingId !== null}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatus(rider, "Rejected")}
                        disabled={updatingId !== null}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredRiders.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
          <span className="text-gray-400">
            Showing {(currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, filteredRiders.length)} of{" "}
            {filteredRiders.length}
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

export default AprovierRider;
