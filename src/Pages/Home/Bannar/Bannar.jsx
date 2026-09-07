import React, { useState, useEffect } from "react";
import banner1 from "../../../assets/banner/banner1.png";
import banner2 from "../../../assets/banner/banner2.png";
import banner3 from "../../../assets/banner/banner3.png";

const banners = [
  {
    id: 1,
    title: (
      <>
        We Make Sure Your <br />
        <span className="text-[#A3D936]">Parcel Arrives</span> On Time <br />
        – No Fuss.
      </>
    ),
    image: banner1,
  },
  {
    id: 2,
    title: (
      <>
        Fastest <br />
        <span className="text-[#A3D936]">Delivery &amp; Easy</span> <br />
        Pickup
      </>
    ),
    image: banner2,
  },
  {
    id: 3,
    title: (
      <>
        Delivery in <span className="text-[#A3D936]">30</span> <br />
        <span className="text-[#A3D936]">Minutes</span> at your <br />
        doorstep
      </>
    ),
    image: banner3,
  },
];

const Bannar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full zap-container overflow-hidden rounded-3xl my-6 group">
      {/* Slides Wrapper */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 relative bg-gradient-to-br from-[#fbfdf6] via-[#f3fad9] to-[#cbf052] rounded-3xl min-h-[380px] md:min-h-[420px] flex items-center px-8 md:px-16 overflow-hidden"
          >
            {/* Curved Bottom Accent Background */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#C0E75A] pointer-events-none"
              style={{
                clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0% 100%)",
              }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Column: Heading & Indicator Dots */}
              <div className="flex-1 text-left space-y-6">
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B252C] leading-tight tracking-tight">
                  {slide.title}
                </h1>

                {/* Inline Slider Indicators */}
                <div className="flex items-center space-x-2 pt-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? "w-8 bg-[#0B252C]"
                          : "w-4 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Primary Accent Button */}
                  <button className="flex items-center pl-6 pr-1.5 py-1.5 bg-[#C0E75A] hover:bg-[#b2dc4c] text-slate-900 font-semibold text-sm rounded-full transition-colors group">
                    <span className="mr-3">Track Your Parcel</span>
                    <div className="bg-[#1E1E1E] text-[#C0E75A] p-2 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m7 17 9.2-9.2M17 17V7H7" />
                      </svg>
                    </div>
                  </button>

                  {/* Secondary Outlined Button */}
                  <button className="px-6 py-3 text-sm font-semibold text-slate-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Be A Rider
                  </button>
                </div>
              </div>

              {/* Right Column: Illustration Image */}
              <div className="flex-1 flex justify-center md:justify-end items-center relative z-10">
                <img
                  src={slide.image}
                  alt="Delivery Illustration"
                  className="max-h-[280px] md:max-h-[340px] w-auto object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Bannar;