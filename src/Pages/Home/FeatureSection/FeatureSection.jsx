import React from "react";

// Feature Illustrations
import liveTracking from "../../../assets/live-tracking.png";
import safeDelivery from "../../../assets/safe-delivery.png";
import customerTop from "../../../assets/customer-top.png";

// Brand Logo Images
import casioLogo from "../../../assets/brands/casio.png";
import amazonLogo from "../../../assets/brands/amazon.png";
import moonstarLogo from "../../../assets/brands/moonstar.png";
import starLogo from "../../../assets/brands/star.png";
import startPeopleLogo from "../../../assets/brands/start_people.png";
import randstadLogo from "../../../assets/brands/randstad.png";

const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: liveTracking,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safeDelivery,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: customerTop,
  },
];

const brandLogos = [
  { name: "Casio", src: casioLogo },
  { name: "Amazon", src: amazonLogo },
  { name: "Moonstar", src: moonstarLogo },
  { name: "Star+", src: starLogo },
  { name: "Start People", src: startPeopleLogo },
  { name: "Randstad", src: randstadLogo },
];

const FeatureSection = () => {
  return (
    <section className="bg-[#EAEBED] py-16 px-6 md:px-12">
      <div className="zap-container max-w-6xl mx-auto">
        {/* Brand Logos Header */}
        <div className="text-center mb-10">
          <h3 className="text-xl md:text-2xl font-extrabold text-[#0B252C] mb-8">
            We've helped thousands of sales teams
          </h3>

          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 md:gap-6 px-4">
            {brandLogos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="h-6 md:h-7 object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            ))}
          </div>
        </div>

        {/* Top Dashed Divider */}
        <div className="my-10 border-t border-dashed border-gray-400/60 w-full" />

        {/* Feature Cards Stack */}
        <div className="space-y-6">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xs border border-transparent hover:shadow-md transition-shadow duration-200"
            >
              {/* Left Column: Illustration */}
              <div className="w-full md:w-1/3 flex justify-center items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-36 md:max-h-44 object-contain"
                />
              </div>

              {/* Dashed Vertical Divider (Desktop) */}
              <div className="hidden md:block w-px h-32 border-r border-dashed border-gray-300" />

              {/* Right Column: Content */}
              <div className="w-full md:w-2/3 text-left">
                <h3 className="text-xl md:text-2xl font-bold text-[#0B252C] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Dashed Divider */}
        <div className="mt-12 border-t border-dashed border-gray-400/60 w-full" />
      </div>
    </section>
  );
};

export default FeatureSection;
