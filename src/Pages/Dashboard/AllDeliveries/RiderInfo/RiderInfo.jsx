import React from "react";
import AllDeliveries from "../AllDeliveries";

const RiderInfo = ({
  rider,
  parcels = [],
  onEdit,
  onPaymentSuccess,
  onDelete,
  onShowAll,
}) => {
  const rid = rider?._id || rider?.id;
  const isApproved =
    !!rider &&
    ["approved", "accepted"].includes(
      String(rider.status || "").toLowerCase()
    );

  const riderDeliveries = rider
    ? parcels.filter((p) => {
        if (!p.assignedRiderId && !p.assignedRiderName) return false;
        const byId =
          rid && p.assignedRiderId && String(p.assignedRiderId) === String(rid);
        const byName =
          p.assignedRiderName &&
          String(p.assignedRiderName).toLowerCase() ===
            String(rider.name || rider.email || "").toLowerCase();
        return byId || byName;
      })
    : [];

  const trackingNumbers = riderDeliveries
    .map((p) => p.trackingCode || p._id || p.id)
    .filter(Boolean);

  if (!rider) {
    return (
      <AllDeliveries
        parcels={parcels}
        onEdit={onEdit}
        onPaymentSuccess={onPaymentSuccess}
        onDelete={onDelete}
      />
    );
  }

  if (!isApproved) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-xs">
        <p className="text-sm text-gray-400 font-semibold">
          Only the delivery associated with an approved rider is shown here.
        </p>
        {onShowAll && (
          <button
            onClick={onShowAll}
            className="mt-4 text-xs font-bold text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl"
          >
            Show All Deliveries
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C0E75A] flex items-center justify-center font-black text-sm text-[#0B252C] uppercase">
            {(rider.name || "R").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-[#0B252C]">{rider.name}</p>
            <p className="text-xs text-gray-400">
              {rider.email}{" "}
              {rider.phone ? `• ${rider.phone}` : ""}
              {rider.district ? ` • ${rider.district}` : ""}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">
              Approved Rider
            </p>
          </div>
          {onShowAll && (
            <button
              onClick={onShowAll}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-xl"
            >
              Show All Deliveries
            </button>
          )}
        </div>
        {trackingNumbers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 mb-2">
              Tracking Number
              {trackingNumbers.length === 1 ? "" : "s"} ({trackingNumbers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {trackingNumbers.map((tn) => (
                <span
                  key={tn}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-semibold text-gray-600"
                >
                  {tn}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <AllDeliveries
        key={rid || "all"}
        parcels={parcels}
        riderFilter={rider}
        onEdit={onEdit}
        onPaymentSuccess={onPaymentSuccess}
        onDelete={onDelete}
      />
    </>
  );
};

export default RiderInfo;