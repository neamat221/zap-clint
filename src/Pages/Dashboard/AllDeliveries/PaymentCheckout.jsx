import React, { useState } from "react";

const METHOD_KEY = "zap_payment_method";

const PaymentCheckout = ({ parcel, onBack, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState(
    () => localStorage.getItem(METHOD_KEY) || "stripe"
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");

  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [bkashError, setBkashError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const amount = parcel?.deliveryCost || parcel?.amount?.cod || 0;
  const parcelName = parcel?.parcelName || parcel?.title || "Parcel";
  const trackingCode = parcel?.trackingCode || parcel?._id || parcel?.id || "N/A";

  const completePayment = () => {
    const txn =
      transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionId(txn);
    onPaymentSuccess?.({
      trackingCode,
      method: paymentMethod,
      amount: Number(amount) || 0,
      parcelId: parcel?._id || parcel?.id || trackingCode,
      parcelName,
      transactionId: txn,
      account: paymentMethod === "bkash" ? bkashNumber : "",
    });
  };

  const handleBkashSubmit = (e) => {
    e.preventDefault();
    const isNumberValid = /^01\d{9}$/.test(bkashNumber);
    const isPinValid = /^\d{5}$/.test(bkashPin);

    if (!isNumberValid) {
      setBkashError("Enter a valid bKash number (11 digits starting with 01).");
      return;
    }
    if (!isPinValid) {
      setBkashError("Enter a valid 5-digit bKash PIN.");
      return;
    }
    setBkashError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      completePayment();
    }, 2000);
  };

  const handleVisaSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      completePayment();
    }, 2000);
  };

  const handleStripeSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStripeError("");
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      completePayment();
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setBkashNumber("");
    setBkashPin("");
    setBkashError("");
    setStripeError("");
    setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
    setTransactionId("");
  };

  const switchMethod = (m) => {
    setPaymentMethod(m);
    localStorage.setItem(METHOD_KEY, m);
    setBkashError("");
    setStripeError("");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10 text-[#0B252C] font-sans flex justify-center items-center">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm max-w-md w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#0B252C]">Complete Payment</h2>
            <p className="text-xs text-gray-400 mt-1">{parcelName} — {trackingCode}</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 bg-[#0B252C] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-opacity-90"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>

        {step === 1 && (
          <>
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button
                type="button"
                onClick={() => switchMethod("stripe")}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === "stripe"
                    ? "bg-[#635BFF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>Stripe</span>
              </button>
              <button
                type="button"
                onClick={() => switchMethod("bkash")}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === "bkash"
                    ? "bg-[#E2136E] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>bKash</span>
              </button>
              <button
                type="button"
                onClick={() => switchMethod("visa")}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === "visa"
                    ? "bg-[#1A1F71] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>Card</span>
              </button>
            </div>

            {paymentMethod === "stripe" && (
              <form onSubmit={handleStripeSubmit} className="space-y-4">
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#635BFF]">Pay with Stripe</span>
                    <span className="text-xs font-semibold text-gray-500">Amount: ৳ {amount}</span>
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    Demo payment — no real charge will be made. Click to simulate a
                    successful Stripe payment.
                  </div>
                  {stripeError && (
                    <p className="text-[11px] font-semibold text-rose-500">{stripeError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#635BFF] hover:bg-[#4f47e8] text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Processing demo payment..." : "Demo Pay with Stripe"}
                </button>
              </form>
            )}

            {paymentMethod === "bkash" && (
              <form onSubmit={handleBkashSubmit} className="space-y-4">
                <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E2136E]">bKash Payment</span>
                    <span className="text-xs font-semibold text-gray-500">Amount: ৳ {amount}</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">Your bKash Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 01700000000"
                      maxLength={11}
                      required
                      value={bkashNumber}
                      onChange={(e) => {
                        setBkashNumber(e.target.value.replace(/\D/g, ""));
                        setBkashError("");
                      }}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E2136E] ${bkashError && bkashNumber && !/^01\d{9}$/.test(bkashNumber) ? "border-rose-400" : "border-pink-200"}`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">bKash PIN</label>
                    <input
                      type="password"
                      placeholder="•••••"
                      required
                      maxLength={5}
                      value={bkashPin}
                      onChange={(e) => {
                        setBkashPin(e.target.value.replace(/\D/g, ""));
                        setBkashError("");
                      }}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E2136E] ${bkashError && bkashPin && !/^\d{5}$/.test(bkashPin) ? "border-rose-400" : "border-pink-200"}`}
                    />
                  </div>
                  {bkashError && (
                    <p className="text-[11px] font-semibold text-rose-500">{bkashError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E2136E] hover:bg-[#c90f60] text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Processing Payment..." : "Confirm bKash Payment"}
                </button>
              </form>
            )}

            {paymentMethod === "visa" && (
              <form onSubmit={handleVisaSubmit} className="space-y-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1F71]">Visa / Mastercard</span>
                    <span className="text-xs font-semibold text-gray-500">Amount: ৳ {amount}</span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1F71]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      required
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1F71]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1F71]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        required
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1F71]"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1F71] hover:bg-[#121653] text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Processing Card..." : "Pay with Visa Card"}
                </button>
              </form>
            )}
          </>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B252C]">Payment Successful!</h3>
              <p className="text-xs text-gray-400 mt-1">Transaction ID: {transactionId}</p>
            </div>
            <button
              onClick={onBack || resetForm}
              className="bg-[#C0E75A] text-[#0B252C] font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#b0d84b] transition-colors"
            >
              Back to Deliveries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCheckout;
