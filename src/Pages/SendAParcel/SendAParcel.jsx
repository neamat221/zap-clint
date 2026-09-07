import React, { useState } from "react";
import DistrictSelect from "./DistrictSelect";

const SendAParcel = ({ onProceed }) => {
  const [parcelType, setParcelType] = useState("document");
  const [formData, setFormData] = useState({
    parcelName: "",
    parcelWeight: "",
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    senderDistrict: "",
    pickupInstruction: "",
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    receiverDistrict: "",
    deliveryInstruction: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.parcelName.trim()) {
      alert("Please enter the parcel name!");
      return;
    }
    if (!formData.parcelWeight.trim()) {
      alert("Please enter the parcel weight (KG)!");
      return;
    }
    if (!formData.senderName.trim()) {
      alert("Please enter the sender name!");
      return;
    }
    if (!formData.senderPhone.trim()) {
      alert("Please enter the sender phone!");
      return;
    }
    if (!formData.senderDistrict) {
      alert("Please select the sender district!");
      return;
    }
    if (!formData.receiverName.trim()) {
      alert("Please enter the receiver name!");
      return;
    }
    if (!formData.receiverPhone.trim()) {
      alert("Please enter the receiver phone!");
      return;
    }
    if (!formData.receiverDistrict) {
      alert("Please select the receiver district!");
      return;
    }
    onProceed({
      parcelType,
      ...formData,
    });
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0B252C] mb-4">
            Enter your parcel details
          </h2>

          <div className="flex items-center gap-8 mb-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0B252C]">
              <input
                type="radio"
                name="parcelType"
                value="document"
                checked={parcelType === "document"}
                onChange={() => setParcelType("document")}
                className="accent-[#10B981] w-4 h-4 cursor-pointer"
              />
              Document
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0B252C]">
              <input
                type="radio"
                name="parcelType"
                value="non-document"
                checked={parcelType === "non-document"}
                onChange={() => setParcelType("non-document")}
                className="accent-[#10B981] w-4 h-4 cursor-pointer"
              />
              Not-Document
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Parcel Name
              </label>
              <input
                type="text"
                name="parcelName"
                placeholder="Parcel Name"
                value={formData.parcelName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Parcel Weight (KG)
              </label>
              <input
                type="number"
                name="parcelWeight"
                placeholder="Parcel Weight (KG)"
                value={formData.parcelWeight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B252C] mb-4">
              Sender Details
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Sender Name
              </label>
              <input
                type="text"
                name="senderName"
                placeholder="Sender Name"
                value={formData.senderName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="senderAddress"
                placeholder="Address"
                value={formData.senderAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Sender Phone No
              </label>
              <input
                type="tel"
                name="senderPhone"
                placeholder="Sender Phone No"
                value={formData.senderPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Your District
              </label>
              <DistrictSelect
                value={formData.senderDistrict}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, senderDistrict: val }))
                }
                placeholder="Select your District"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Pickup Instruction
              </label>
              <textarea
                name="pickupInstruction"
                rows={4}
                placeholder="Pickup Instruction"
                value={formData.pickupInstruction}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300 resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B252C] mb-4">
              Receiver Details
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Receiver Name
              </label>
              <input
                type="text"
                name="receiverName"
                placeholder="Receiver Name"
                value={formData.receiverName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Receiver Address
              </label>
              <input
                type="text"
                name="receiverAddress"
                placeholder="Receiver Address"
                value={formData.receiverAddress}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Receiver Contact No
              </label>
              <input
                type="tel"
                name="receiverPhone"
                placeholder="Receiver Contact No"
                value={formData.receiverPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Receiver District
              </label>
              <DistrictSelect
                value={formData.receiverDistrict}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, receiverDistrict: val }))
                }
                placeholder="Select Receiver District"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B252C] mb-1.5">
                Delivery Instruction
              </label>
              <textarea
                name="deliveryInstruction"
                rows={4}
                placeholder="Delivery Instruction"
                value={formData.deliveryInstruction}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-xs text-gray-500 font-medium">
            * PickUp all Time.
          </p>
          <button
            type="submit"
            className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs px-8 py-3 rounded-xl transition-colors duration-200 shadow-xs"
          >
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendAParcel;
