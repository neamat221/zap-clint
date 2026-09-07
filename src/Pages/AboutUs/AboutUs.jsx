import React, { useState } from "react";

const tabData = {
  Story: [
    "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
  ],
  Mission: [
    "Our mission is to revolutionize regional logistics by providing seamless, transparent, and ultra-efficient delivery solutions for businesses and individuals alike.",
    "We strive to leverage cutting-edge tracking technology and dedicated support teams to redefine speed, security, and customer satisfaction standard in the industry.",
  ],
  Success: [
    "Having completed over millions of successful deliveries, we take pride in maintaining a 99.8% on-time fulfillment rate across all regions.",
    "Our rapid growth is fueled by continuous innovation, empowering small merchants and enterprise partners to scale effortlessly.",
  ],
  "Team & Others": [
    "Behind our seamless logistics network is a team of dedicated drivers, customer support agents, and tech innovators working around the clock.",
    "We foster a collaborative culture committed to sustainability, safety, and empowering local communities through reliable service.",
  ],
};

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("Story");

  const tabs = ["Story", "Mission", "Success", "Team & Others"];

  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-6xl w-full shadow-sm">
        {/* Main Title & Subtitle */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B252C] mb-2">
          About Us
        </h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-2xl mb-10 leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-base md:text-lg transition-colors font-bold focus:outline-none ${
                activeTab === tab
                  ? "text-[#6C8E28]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        <div className="space-y-6 max-w-5xl">
          {tabData[activeTab].map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-500 text-xs md:text-sm leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;