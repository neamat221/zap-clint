import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login submit logic
  };

  const handleGoogleLogin = () => {
    // Google OAuth logic
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        {/* Left Form Section */}
        <div className="p-8 md:p-12 flex flex-col justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C0E75A] rounded-md flex items-center justify-center font-black text-xs text-[#0B252C] transform -skew-x-12">
              Z
            </div>
            <span className="text-xl font-extrabold text-[#0B252C] tracking-tight">
              ZapShift
            </span>
          </div>

          {/* Form Content */}
          <div className="my-auto py-6 max-w-sm w-full mx-auto">
            <h1 className="text-3xl font-extrabold text-[#0B252C] mb-1">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Login with ZapShift
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#71C5C7] transition-colors placeholder-gray-300"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-left">
                <a
                  href="#forgot"
                  className="text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                >
                  Forget Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs py-2.5 rounded-lg transition-colors duration-200 shadow-xs mt-2"
              >
                Login
              </button>

              {/* Registration Link */}
              <p className="text-xs text-center text-gray-500 pt-1">
                Don't have any account?{" "}
                <a
                  href="#register"
                  className="text-[#84A927] font-semibold hover:underline"
                >
                  Register
                </a>
              </p>

              {/* Divider */}
              <div className="text-center text-xs text-gray-400 my-2">Or</div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#EBEEF2] hover:bg-[#e0e4ea] text-[#0B252C] font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {/* Google Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Login with google
              </button>
            </form>
          </div>

          <div />
        </div>

        {/* Right Illustration Section */}
        <div className="bg-[#F5FAEE] hidden md:flex items-center justify-center p-8 relative">
          <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
            {/* Replace this SVG blob/illustration container with your actual image asset:
                <img src={loginIllustration} alt="Delivery Illustration" className="w-full h-auto object-contain" />
            */}

            {/* Embedded Placeholder Visual */}
            <div className="w-72 h-72 rounded-full bg-[#A3C86A]/30 absolute blur-2xl -z-0" />

            <svg
              viewBox="0 0 300 300"
              className="w-full h-full relative z-10 drop-shadow-sm"
              fill="none"
            >
              {/* Background Organic Blob */}
              <path
                d="M150 30 C220 30 270 80 270 150 C270 220 210 270 150 270 C80 270 30 220 30 150 C30 80 80 30 150 30 Z"
                fill="#94BD4B"
                opacity="0.8"
              />

              {/* Delivery Courier & Customer Vector Representation */}
              {/* Courier Guy */}
              <rect
                x="190"
                y="100"
                width="60"
                height="130"
                rx="20"
                fill="#2D2B6B"
              />
              <circle cx="220" cy="80" r="20" fill="#E8B08D" />
              <path d="M200 65 Q220 50 240 65" fill="#1A184B" />

              {/* Customer */}
              <rect
                x="80"
                y="120"
                width="55"
                height="110"
                rx="15"
                fill="#2F70D8"
              />
              <circle cx="107" cy="98" r="18" fill="#E8B08D" />
              <path d="M90 90 Q107 75 125 90" fill="#522C1B" />

              {/* Delivery Box */}
              <rect
                x="130"
                y="135"
                width="60"
                height="45"
                rx="6"
                fill="#C5EE61"
                stroke="#2D2B6B"
                strokeWidth="3"
              />
              <line
                x1="160"
                y1="135"
                x2="160"
                y2="180"
                stroke="#2D2B6B"
                strokeWidth="3"
              />

              {/* Map Location Pin */}
              <path
                d="M150 50 C140 50 132 58 132 68 C132 80 150 95 150 95 C150 95 168 80 168 68 C168 58 160 50 150 50 Z"
                fill="#FFFFFF"
              />
              <circle cx="150" cy="66" r="6" fill="#94BD4B" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
