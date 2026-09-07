import React, { useState } from "react";

const faqData = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, our design includes adjustable straps and flexible support to comfortably accommodate a wide variety of body types and age groups.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Consistent use helps align your spine, relieve tension on strained muscles, and build muscle memory for long-term posture correction.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Selected models feature smart sensors that gently vibrate whenever you slouch, helping you train your posture mindfully.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can sign up with your email on the product page to receive an instant alert as soon as stock is replenished.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="about" className="bg-[#EAEBED] py-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title and Subtitle */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B252C] mb-3">
          Frequently Asked Question (FAQ)
        </h2>
        <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto mb-10 leading-relaxed">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>

        {/* FAQ Accordion List */}
        <div className="space-y-4 text-left">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#E5F4F4]/60 border-[#71C5C7]"
                    : "bg-white border-transparent hover:border-gray-200"
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 md:px-6 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-bold text-[#0B252C] pr-4">
                    {item.question}
                  </span>
                  <span className="text-[#0B252C] shrink-0">
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-5 md:px-6 text-gray-600 text-xs md:text-sm leading-relaxed border-t border-[#71C5C7]/30 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* See More FAQ Button */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-sm px-6 py-3 rounded-full transition-colors flex items-center gap-2">
            <span>See More FAQ's</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#1A2525] flex items-center justify-center text-[#C0E75A]">
            <svg
              className="w-4 h-4 transform -rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;