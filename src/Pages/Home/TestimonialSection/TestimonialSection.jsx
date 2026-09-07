import React, { useEffect, useState } from "react";
import customerTop from "../../../assets/customer-top.png"; // Replace with your image path

const testimonials = [
  {
    name: "Rasel Ahamed",
    role: "CTO",
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Awlad Hossin",
    role: "Senior Product Designer",
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=33",
    active: true,
  },
  {
    name: "Nasir Uddin",
    role: "CEO",
    text: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Sumaiya Akter",
    role: "Marketing Lead",
    text: "ZapShift made delivery simple and stress-free. Real-time tracking meant I always knew exactly where my parcels were. Highly recommended for any business.",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Tanvir Ahmed",
    role: "Founder",
    text: "Fast, reliable and genuinely affordable. The team handles every shipment with care and the support is always quick to respond. Five stars all the way.",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    name: "Nusrat Jahan",
    role: "Operations Manager",
    text: "Cash on delivery plus nationwide coverage changed the game for us. Our customers trust ZapShift and so do we. Delivery has never been this easy.",
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    name: "Mehedi Hasan",
    role: "E-commerce Owner",
    text: "From booking to doorstep, everything is smooth. Live tracking keeps my customers informed and the parcels always arrive right on schedule.",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    name: "Farhana Binte Ali",
    role: "Customer Success",
    text: "The 24/7 support team is amazing. Every issue is resolved quickly and the delivery quality is consistent. A partner you can rely on.",
    avatar: "https://i.pravatar.cc/150?img=31",
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [lime, setLime] = useState(true);
  const total = testimonials.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    setLime((prev) => !prev);
  };

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(handleNext, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const orderedIndexes = [
    (currentIndex - 1 + total) % total,
    currentIndex,
    (currentIndex + 1) % total,
  ];

  return (
    <div className={`py-16 px-4 md:px-12 overflow-hidden transition-colors duration-500 ${
      lime ? "bg-[#EAEBED]" : "bg-[#F4FAD9]"
    }`}>
      <div className="zap-container text-center">
        {/* Top Header Illustration */}
        <div className="flex justify-center mb-4">
          <img
            src={customerTop}
            alt="Delivery Illustration"
            className="h-20 md:h-24 object-contain"
          />
        </div>

        {/* Section Heading & Subtitle */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B252C] mb-3">
          What our customers are sayings
        </h2>
        <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        {/* Testimonials Carousel Wrapper */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6">
          {orderedIndexes.map((idx) => {
          const item = testimonials[idx];
          return (
            <div
              key={item.name}
              className={`rounded-3xl p-6 md:p-8 flex flex-col justify-between text-left transition-all duration-300 ${
                idx === currentIndex
                  ? lime
                    ? "bg-[#C0E75A] shadow-xl scale-105 z-10 w-full max-w-sm md:max-w-md border border-[#C0E75A]"
                    : "bg-white shadow-xl scale-105 z-10 w-full max-w-sm md:max-w-md border border-gray-100"
                  : "bg-white/50 backdrop-blur-xs opacity-40 blur-[1px] hidden sm:flex sm:w-72 md:w-80"
              }`}
            >
              <div>
                {/* Quote Icon */}
                <div className="text-4xl text-[#71C5C7] leading-none mb-3 font-serif">
                  “
                </div>

                {/* Testimonial Text */}
                <p className={`text-xs md:text-sm leading-relaxed mb-6 ${
                    idx === currentIndex ? "text-[#052C30]/80" : "text-gray-600"
                  }`}>
                  {item.text}
                </p>
              </div>

              <div>
                {/* Dashed Separator */}
                <div className="border-t border-dashed border-gray-300 my-4" />

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className={`text-sm font-bold ${
                    idx === currentIndex ? "text-[#052C30]" : "text-[#0B252C]"
                  }`}>
                      {item.name}
                    </h4>
                    <p className={`text-xs ${
                      idx === currentIndex ? "text-[#052C30]/70" : "text-gray-400"
                    }`}>{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Controls: Arrows & Pagination Dots */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div className="flex items-center gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-2.5 h-2.5 bg-[#0B252C]"
                    : "w-2 h-2 bg-gray-400 hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors duration-500 ${
              lime
                ? "bg-[#C0E75A] text-[#0B252C] hover:bg-[#b0d84b]"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
