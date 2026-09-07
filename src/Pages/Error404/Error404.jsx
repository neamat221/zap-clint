import React from "react";

// You can replace this inline SVG with your local asset import:
// import errorIllustration from "../../../assets/error-illustration.png";

const Error404 = () => {
  return (
    <div className="bg-[#EAEBED] min-h-screen py-5 px-4 md:px-12 flex justify-center items-center">
      <div className="bg-white rounded-[32px] p-8 md:p-16 max-w-6xl w-full min-h-[500px] shadow-sm flex flex-col justify-center items-center text-center">
        {/* Character Illustration / Image */}
        <div className="mb-6 flex justify-center items-center">
          {/* Option A: Use image asset */}
          {/* <img src={errorIllustration} alt="Error 404 Worker" className="w-44 md:w-52 h-auto object-contain" /> */}

          {/* Option B: Embedded SVG Illustration for preview */}
          <div className="w-44 md:w-52 h-44 md:h-52 relative flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-md"
            >
              {/* Shadow underneath */}
              <ellipse cx="100" cy="182" rx="40" ry="6" fill="#D8DCE0" />

              {/* Character Body */}
              <rect
                x="60"
                y="65"
                width="80"
                height="100"
                rx="35"
                fill="#FF6B93"
                stroke="#1E1E1E"
                strokeWidth="5"
              />

              {/* Legs */}
              <path
                d="M80 165 V180 M120 165 V180"
                stroke="#1E1E1E"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M72 180 H88 M112 180 H128"
                stroke="#1E1E1E"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Left Arm */}
              <path
                d="M60 115 C48 115 42 130 45 142"
                stroke="#1E1E1E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Eyes */}
              <circle cx="85" cy="100" r="5" fill="#1E1E1E" />
              <circle cx="115" cy="100" r="5" fill="#1E1E1E" />

              {/* Mouth (Surprised/Stressed expression) */}
              <rect
                x="88"
                y="118"
                width="24"
                height="22"
                rx="6"
                fill="#FFFFFF"
                stroke="#1E1E1E"
                strokeWidth="4"
              />
              <path d="M88 126 H112" stroke="#1E1E1E" strokeWidth="3" />

              {/* Hard Hat / Helmet */}
              <path
                d="M68 66 C68 45 132 45 132 66 Z"
                fill="#FFAE00"
                stroke="#1E1E1E"
                strokeWidth="5"
              />
              <rect
                x="62"
                y="63"
                width="76"
                height="8"
                rx="4"
                fill="#FFAE00"
                stroke="#1E1E1E"
                strokeWidth="4"
              />
              <path
                d="M93 47 V63 M107 47 V63"
                stroke="#1E1E1E"
                strokeWidth="3"
              />

              {/* Right Arm holding Wrench */}
              <path
                d="M140 115 C152 110 160 120 155 135"
                stroke="#1E1E1E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Wrench */}
              <g transform="translate(148, 100) rotate(25)">
                <path
                  d="M10 5 H18 V45 H10 Z"
                  fill="#D1D5DB"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                />
                <circle
                  cx="14"
                  cy="6"
                  r="10"
                  fill="#D1D5DB"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                />
                <path d="M10 0 V8 H18 V0" fill="#FFFFFF" />
              </g>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-black text-[#0B252C] tracking-tight mb-8">
          Error 404
        </h1>

        {/* Go Home Button */}
        <div>
          <a
            href="/"
            className="inline-block bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs md:text-sm px-7 py-2.5 rounded-xl transition-colors duration-200 shadow-xs"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Error404;
