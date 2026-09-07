import React, { useState } from "react";

const services = [
  {
    id: 1,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6 hours from pick-up to drop-off.",
    highlighted: false,
  },
  {
    id: 2,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.",
    highlighted: true,
  },
  {
    id: 3,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    highlighted: false,
  },
  {
    id: 4,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    highlighted: false,
  },
  {
    id: 5,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    highlighted: false,
  },
  {
    id: 6,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    highlighted: false,
  },
];

// Placeholder component for the card illustration/icon
const CardIcon = () => (
  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 mx-auto">
    <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
      <span className="text-xs">📍</span>
    </div>
  </div>
);

const OurServices = () => {
  const [selectedId, setSelectedId] = useState(2);

  return (
    <section id="services" className="bg-black text-white py-16 px-6 md:px-12 rounded-3xl zap-container my-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          Our Services
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedId(service.id)}
            className={`rounded-2xl p-8 text-center flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 cursor-pointer ${
              selectedId === service.id
                ? "bg-[#C0E75A] text-[#052C30]"
                : "bg-white text-[#052C30]"
            }`}
          >
            <div>
              {/* Icon / Illustration */}
              <CardIcon />

              {/* Title */}
              <h3 className="text-lg font-bold mb-3 leading-snug">
                {service.title}
              </h3>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed ${
                  selectedId === service.id ? "text-[#052C30]/80" : "text-gray-500"
                }`}
              >
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
