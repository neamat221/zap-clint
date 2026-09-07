import React from "react";

const steps = [
  {
    id: 1,
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    id: 2,
    title: "Cash On Delivery",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    id: 3,
    title: "Delivery Hub",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    id: 4,
    title: "Booking SME & Corporate",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#EAEBED] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B252C] mb-8">
          How it Works
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-transparent shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#C0E75A]"
            >
              <div>
                {/* Truck & Pin Icon */}
                <div className="mb-6 text-[#0B252C]">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Location Pin */}
                    <path d="M19 16C19 13.2386 16.7614 11 14 11C11.2386 11 9 13.2386 9 16C9 19.5 14 23 14 23C14 23 19 19.5 19 16Z" />
                    <circle cx="14" cy="16" r="1.5" />

                    {/* Truck Body */}
                    <path d="M10 25H26V33H10V25Z" />
                    <path d="M26 28H32L36 30.5V33H26V28Z" />

                    {/* Wheels & Ground Lines */}
                    <circle cx="15" cy="35" r="2" />
                    <circle cx="31" cy="35" r="2" />
                    <path d="M17 35H29" />
                    <path d="M6 35H13" />
                  </svg>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-[#0B252C] mb-3 leading-snug">
                  {step.title}
                </h3>

                {/* Card Description */}
                <p className="text-gray-500 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
