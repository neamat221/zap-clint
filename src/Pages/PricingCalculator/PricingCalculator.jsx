import React from "react";
import PriceCalcForm from "./PriceCalcForm";

const pricingTable = [
  {
    type: "Document",
    weight: "Any",
    within: "৳60",
    outside: "৳80",
  },
  {
    type: "Non-Document",
    weight: "Up to 3kg",
    within: "৳110",
    outside: "৳150",
  },
  {
    type: "Non-Document",
    weight: ">3kg",
    within: "+৳40/kg",
    outside: "+৳40/kg +৳40 extra",
  },
];

const PricingCalculator = () => {
  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-14 max-w-6xl w-full shadow-sm">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          Pricing Calculator
        </h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-2xl mb-10 leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <PriceCalcForm />

        <div className="border-t border-gray-100 my-10" />

        <h2 className="text-xl md:text-2xl font-bold text-[#0B252C] mb-6">
          Delivery Price List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-gray-100 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#0B252C] text-white">
                <th className="px-4 py-3 font-semibold">Parcel Type</th>
                <th className="px-4 py-3 font-semibold">Weight</th>
                <th className="px-4 py-3 font-semibold">Within City</th>
                <th className="px-4 py-3 font-semibold">
                  Outside City/District
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pricingTable.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#F1F3F6]" : "bg-white"}
                >
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.weight}</td>
                  <td className="px-4 py-3 text-gray-700">{row.within}</td>
                  <td className="px-4 py-3 text-gray-700">{row.outside}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;