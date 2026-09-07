import React, { useState } from "react";
import { calcParcelCost, priceBreakdown } from "./pricing";

const PriceCalcForm = ({
  prefill = {},
  onBack,
  onConfirm,
  confirmLabel = "Confirm Booking",
}) => {
  const [parcelType, setParcelType] = useState(prefill.parcelType || "");
  const [destination, setDestination] = useState(prefill.destination || "within");
  const [weight, setWeight] = useState(prefill.weight || "");
  const [cost, setCost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!parcelType || !weight) {
      alert("Please select parcel type and enter weight!");
      return;
    }
    const rate = calcParcelCost({ type: parcelType, weight });
    setCost(destination === "within" ? rate.within : rate.outside);
  };

  const handleReset = () => {
    setWeight("");
    setCost(null);
  };

  const confirmBooking = () => {
    if (pendingResult) {
      onConfirm(pendingResult);
    }
    setPendingResult(null);
    setShowConfirm(false);
  };

  const info = priceBreakdown({ type: parcelType, weight });

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          Pricing Calculator
        </h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-2xl mb-10 leading-relaxed">
          Review your delivery cost before confirming your booking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Parcel type
              </label>
              <div className="relative">
                <select
                  value={parcelType}
                  onChange={(e) => {
                    setParcelType(e.target.value);
                    setCost(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-500 appearance-none bg-white focus:outline-none focus:border-[#71C5C7] transition-colors cursor-pointer"
                >
                  <option value="" disabled>
                    Select Parcel type
                  </option>
                  <option value="document">Document</option>
                  <option value="non-document">Non-Document</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Delivery Destination
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setCost(null);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-500 appearance-none bg-white focus:outline-none focus:border-[#71C5C7] transition-colors cursor-pointer"
                >
                  <option value="within">Within City</option>
                  <option value="outside">Outside City/District</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Weight (KG)
              </label>
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setCost(null);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-1/3 bg-[#F0F2E6] hover:bg-[#e4e8d2] text-[#0B252C] font-semibold text-xs py-2.5 rounded-lg transition-colors border border-gray-200"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 bg-[#F0F2E6] hover:bg-[#e4e8d2] text-[#0B252C] font-semibold text-xs py-2.5 rounded-lg transition-colors border border-gray-200"
              >
                Reset
              </button>

              <button
                type="submit"
                className="w-2/3 bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs py-2.5 rounded-lg transition-colors shadow-xs"
              >
                Calculate
              </button>
            </div>
          </form>

          <div className="space-y-4 text-center">
            <div className="flex justify-center items-center py-6 md:py-4">
              <span className="text-5xl md:text-6xl font-black text-[#0B252C] tracking-tight">
                {cost !== null ? `৳${cost}` : "৳—"}
              </span>
            </div>

            {cost !== null && (
              <div className="bg-[#F1F3F6] rounded-2xl p-4 text-left space-y-1 text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-700">
                    Breakdown :
                  </span>{" "}
                  {info.base}
                </p>
                <p className="text-gray-400">{info.note}</p>
              </div>
            )}

            {onConfirm && cost !== null && (
              <button
                onClick={() => {
                  setPendingResult({ parcelType, destination, weight, cost });
                  setShowConfirm(true);
                }}
                className="w-full bg-[#0B252C] hover:bg-[#14343d] text-white font-bold text-xs py-3 rounded-xl transition-colors"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#C0E75A]/30">
              <svg
                className="w-8 h-8 text-[#0B252C]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0B252C] mb-2">
              Confirm Booking?
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Delivery cost{" "}
              <span className="font-bold text-[#0B252C]">
                {pendingResult ? `৳${pendingResult.cost}` : ""} TK
              </span>
              . Do you want to confirm this parcel?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmBooking}
                className="flex-1 bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setPendingResult(null);
                  setShowConfirm(false);
                }}
                className="flex-1 bg-[#F1F3F6] hover:bg-[#e8ebef] text-[#0B252C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCalcForm;