import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hok/UseAxiosSecure";
import Select from "./Select";

const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "approved" || s === "accepted")
    return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
};

const RiderDetails = () => {
  const axiosSecure = UseAxiosSecure();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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

  if (selected) {
    return <Select rider={selected} onBack={() => setSelected(null)} />;
  }

  const approvedRiders = riders.filter((r) =>
    ["approved", "accepted"].includes(String(r.status || "").toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-black text-[#0B252C]">Rider Details</h2>
        <p className="text-xs text-gray-400">
          All riders who have applied. Click a rider to view their full details.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-gray-400">Loading riders...</div>
      ) : approvedRiders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400 font-semibold">No approved riders found</p>
          <p className="text-xs text-gray-400 mt-1">
            Approved riders from "Approve Riders" will appear here.
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
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {approvedRiders.map((rider) => (
                <tr
                  key={rider._id || rider.id}
                  onClick={() => setSelected(rider)}
                  className="hover:bg-gray-300 cursor-pointer"
                >
                  <td className="py-3.5 font-semibold text-[#0B252C] hover:text-[#7a9f2b]">
                    {rider.name}
                  </td>
                  <td className="py-3.5 text-gray-600">{rider.email}</td>
                  <td className="py-3.5 text-gray-600">{rider.phone}</td>
                  <td className="py-3.5 text-gray-600">{rider.district}</td>
                  <td className="py-3.5 text-gray-600">{rider.bike}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(rider.status)}`}
                    >
                      {rider.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiderDetails;
