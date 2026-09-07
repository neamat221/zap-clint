import React, { useState } from "react";

const PriorityBanner = () => {
  const [active, setActive] = useState("merchant");
  return (
    <section id="coverage" className="bg-[#EAEBED] py-12 px-6 md:px-12 flex items-center justify-center">
      <div className="relative w-full bg-[#052C30] rounded-3xl p-8 md:p-14 overflow-hidden shadow-xl zap-container">
        {/* Top Wave Background Effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#C0E75A]/20 via-[#C0E75A]/5 to-transparent pointer-events-none opacity-40 blur-xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Merchant and Customer Satisfaction is Our First Priority
            </h2>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xl">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActive("merchant")}
                className={`font-bold text-sm px-6 py-3.5 rounded-full transition-colors duration-200 ${
                  active === "merchant"
                    ? "bg-[#C0E75A] hover:bg-[#b0d84b] text-[#052C30]"
                    : "border border-[#C0E75A] text-[#C0E75A] hover:bg-[#C0E75A]/10"
                }`}
              >
                Become a Merchant
              </button>

              <button
                onClick={() => setActive("rider")}
                className={`font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200 ${
                  active === "rider"
                    ? "bg-[#C0E75A] hover:bg-[#b0d84b] text-[#052C30]"
                    : "border border-[#C0E75A] text-[#C0E75A] hover:bg-[#C0E75A]/10"
                }`}
              >
                Earn with ZapShift Courier
              </button>
            </div>
          </div>

          {/* Right Column: Line Art Boxes Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="w-full max-w-xs md:max-w-sm text-[#00D4B6] opacity-90">
              <svg
                viewBox="0 0 400 300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-auto drop-shadow-md"
              >
                {/* Location Pin */}
                <path d="M 270,30 C 255,30 245,45 245,60 C 245,80 270,110 270,110 C 270,110 295,80 295,60 C 295,45 285,30 270,30 Z" />
                <circle cx="270" cy="58" r="6" />

                {/* Top Package Box */}
                <polygon points="230,115 350,135 340,175 220,155" />
                <polygon points="230,115 220,155 125,125 135,85" />
                <polygon points="230,115 135,85 255,105 350,135" />
                {/* Shipping Label on Box */}
                <polygon points="290,140 330,146 327,170 287,164" />

                {/* Bottom Package Box */}
                <polygon points="220,195 300,210 290,265 210,250" />
                <polygon points="220,195 210,250 100,210 110,155" />
                <polygon points="220,195 110,155 210,175 300,210" />

                {/* Decorative Line Path */}
                <path d="M 30,225 C 60,200 80,240 100,210" />
                <path d="M 350,150 C 370,130 380,180 395,160" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriorityBanner;
