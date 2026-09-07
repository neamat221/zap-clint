import React, { useState } from "react";

// Mock Data
const statCards = [
  { label: "To Pay", count: 129 },
  { label: "Ready Pick UP", count: "1,325" },
  { label: "In Transit", count: 50 },
  { label: "Ready to Deliver", count: 50 },
  { label: "Delivered", count: 50 },
];

const shippingReports = [
  {
    id: "#RG21534",
    client: "Rasel Ahmed",
    date: "Jan 6, 2025",
    weight: "10 kg",
    shipper: "DHL",
    price: "4500.00",
    status: "Delivered",
    statusBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "#RG21534",
    client: "Rakib Hossain",
    date: "Jan 8, 2025",
    weight: "15 kg",
    shipper: "Inpost",
    price: "9800.00",
    status: "Delivered",
    statusBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "#RG21534",
    client: "Rakib",
    date: "12 Feb, 2025",
    weight: "5 kg",
    shipper: "Pathao",
    price: "2000.00",
    status: "Transit",
    statusBg: "bg-sky-100 text-sky-700",
  },
  {
    id: "#RG21534",
    client: "Abu Sufian",
    date: "08 Jan, 2025",
    weight: "7 kg",
    shipper: "Steadfast",
    price: "2700.00",
    status: "Waiting",
    statusBg: "bg-rose-100 text-rose-700",
  },
  {
    id: "#RG21534",
    client: "Rasel Ahmed",
    date: "Jan 5, 2025",
    weight: "15 kg",
    shipper: "UPS",
    price: "1920.00",
    status: "Transit",
    statusBg: "bg-sky-100 text-sky-700",
  },
  {
    id: "#RG21534",
    client: "Jhankar Mahbub",
    date: "22 Dec, 2024",
    weight: "10 kg",
    shipper: "DHL",
    price: "6500.00",
    status: "Pending",
    statusBg: "bg-amber-100 text-amber-700",
  },
];

const lateInvoices = [
  { id: "#PTD14542547", price: "4500.00", date: "10 day ago" },
  { id: "#PTD14542547", price: "9800.00", date: "1 day ago" },
  { id: "#PTD14542547", price: "2000.00", date: "1h ago" },
  { id: "#PTD14542547", price: "2700.00", date: "2h ago" },
  { id: "#PTD14542547", price: "1920.00", date: "3h ago" },
  { id: "#PTD14542547", price: "6500.00", date: "4h ago" },
];

const DashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="bg-[#EAEBED] min-h-screen flex text-[#0B252C]">
      {/* Sidebar */}
      <aside className="w-64 bg-white min-h-screen p-6 flex flex-col justify-between shrink-0 border-r border-gray-100 hidden lg:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-[#C0E75A] rounded-md flex items-center justify-center font-black text-xs text-[#0B252C] transform -skew-x-12">
              Z
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              ZapShift
            </span>
          </div>

          {/* MENU Section */}
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">
            MENU
          </p>
          <nav className="space-y-1 mb-8">
            {[
              {
                name: "Dashboard",
                icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z",
              },
              {
                name: "Deliveries",
                icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z",
              },
              {
                name: "Invoices",
                icon: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
              },
              {
                name: "Stores",
                icon: "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z",
              },
              {
                name: "Pricing Plan",
                icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1H6.32c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
              },
              {
                name: "Coverage Area",
                icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeMenu === item.name
                    ? "bg-[#C0E75A] text-[#0B252C]"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                {item.name}
              </button>
            ))}
          </nav>

          {/* GENERAL Section */}
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">
            GENERAL
          </p>
          <nav className="space-y-1">
            {[
              {
                name: "Settings",
                icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
              },
              {
                name: "Change Password",
                icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
              },
              {
                name: "Help",
                icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z",
              },
              {
                name: "Logout",
                icon: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current text-gray-400"
                  viewBox="0 0 24 24"
                >
                  <path d={item.icon} />
                </svg>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 relative">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute top-2 right-2" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/100?img=33"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold leading-tight">Zahid Hossain</p>
                <p className="text-[10px] text-gray-400">Admin</p>
              </div>
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Dashboard Main Area */}
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black">
                Dashboard Overview
              </h1>
              <p className="text-xs text-gray-400">
                You can access all your data and information from anywhere.
              </p>
            </div>
            <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto">
              <span>+</span> Add Parcel
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-lg font-black">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Statistics Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold">Overall Statistics</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  This Week
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative h-52 w-full">
              <svg
                className="w-full h-full"
                viewBox="0 0 700 200"
                preserveAspectRatio="none"
              >
                {/* Horizontal Grid lines */}
                {[40, 80, 120, 160].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="680"
                    y2={y}
                    stroke="#F1F3F6"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Y Axis Labels */}
                <text x="10" y="45" fill="#9CA3AF" fontSize="10">
                  25k
                </text>
                <text x="10" y="85" fill="#9CA3AF" fontSize="10">
                  20k
                </text>
                <text x="10" y="125" fill="#9CA3AF" fontSize="10">
                  15k
                </text>
                <text x="10" y="165" fill="#9CA3AF" fontSize="10">
                  5k
                </text>

                {/* Line Gradient Fill */}
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#C0E75A" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#C0E75A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Wave Area */}
                <path
                  d="M 50 120 Q 100 120 150 90 T 250 90 T 350 130 T 450 120 T 550 110 T 620 70 T 670 140 L 670 180 L 50 180 Z"
                  fill="url(#chartGradient)"
                />
                {/* Wave Line */}
                <path
                  d="M 50 120 Q 100 120 150 90 T 250 90 T 350 130 T 450 120 T 550 110 T 620 70 T 670 140"
                  fill="none"
                  stroke="#A2D636"
                  strokeWidth="3"
                />

                {/* Active Hover Guideline & Indicator Pin */}
                <line
                  x1="420"
                  y1="40"
                  x2="420"
                  y2="180"
                  stroke="#A2D636"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="420"
                  cy="120"
                  r="4"
                  fill="#0B252C"
                  stroke="#A2D636"
                  strokeWidth="2"
                />

                {/* X Axis Day Labels */}
                <text x="50" y="195" fill="#9CA3AF" fontSize="10">
                  Mon
                </text>
                <text x="150" y="195" fill="#9CA3AF" fontSize="10">
                  Tue
                </text>
                <text x="250" y="195" fill="#9CA3AF" fontSize="10">
                  Wed
                </text>
                <text x="410" y="195" fill="#9CA3AF" fontSize="10">
                  Thu
                </text>
                <text x="510" y="195" fill="#9CA3AF" fontSize="10">
                  Fri
                </text>
                <text x="590" y="195" fill="#9CA3AF" fontSize="10">
                  Sat
                </text>
                <text x="660" y="195" fill="#9CA3AF" fontSize="10">
                  Sun
                </text>
              </svg>

              {/* Tooltip Overlay */}
              <div className="absolute top-10 left-[55%] bg-white border border-gray-100 shadow-md rounded-lg px-3 py-1.5 text-[10px] transform -translate-x-1/2">
                <p className="text-gray-400">Sun, Jul 13, 2025</p>
                <p className="font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A2D636]" />{" "}
                  $15210.00
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Reports Table */}
          <div className="bg-white rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold">Shipping Reports</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  This Week
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button className="border border-gray-200 p-1.5 rounded-xl text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] text-gray-400">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Weight</th>
                    <th className="pb-3 font-semibold">Shipper</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {shippingReports.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-medium">{row.id}</td>
                      <td className="py-3.5 text-gray-600">{row.client}</td>
                      <td className="py-3.5 text-gray-400">{row.date}</td>
                      <td className="py-3.5 text-gray-600">{row.weight}</td>
                      <td className="py-3.5 text-gray-600">{row.shipper}</td>
                      <td className="py-3.5 font-semibold">{row.price}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.statusBg}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-400">
                          <button className="hover:text-gray-600 flex items-center gap-1 text-[11px]">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button className="hover:text-gray-600">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                &larr; Previous
              </button>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-[#C0E75A] font-bold text-[#0B252C]">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100">
                  3
                </button>
                <span className="text-gray-400 px-1">...</span>
                <button className="w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100">
                  8
                </button>
                <button className="w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100">
                  9
                </button>
                <button className="w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100">
                  10
                </button>
              </div>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                Next &rarr;
              </button>
            </div>
          </div>

          {/* Bottom Grid: Late Invoices & Shipment Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Late Invoices Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold">Late Invoices</h2>
                <div className="flex items-center gap-2">
                  <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-[11px] px-3 py-1.5 rounded-xl">
                    View All Invoices
                  </button>
                  <button className="border border-gray-200 p-1.5 rounded-xl text-gray-400">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] text-gray-400">
                      <th className="pb-2 font-semibold">No</th>
                      <th className="pb-2 font-semibold">Price</th>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {lateInvoices.map((invoice, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 font-medium">{invoice.id}</td>
                        <td className="py-2.5 font-semibold">
                          {invoice.price}
                        </td>
                        <td className="py-2.5 text-gray-400">{invoice.date}</td>
                        <td className="py-2.5 text-right text-gray-400">
                          <button className="hover:text-gray-600">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipment Alerts Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">Shipment Alerts</h2>
                  <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-[11px] px-3 py-1.5 rounded-xl">
                    View All Invoices
                  </button>
                </div>

                {/* Counter Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-3 rounded-xl text-center">
                  <div>
                    <p className="text-lg font-black">2</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Damaged
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black">10</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Weather Delays
                    </p>
                  </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                  {[
                    { color: "text-sky-500 bg-sky-50" },
                    { color: "text-rose-500 bg-rose-50" },
                    { color: "text-emerald-500 bg-emerald-50" },
                    { color: "text-amber-500 bg-amber-50" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shrink-0`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold">Damaged</p>
                          <p className="text-[10px] text-gray-400">
                            Shipment{" "}
                            <span className="font-semibold text-gray-600">
                              #SP11251C
                            </span>{" "}
                            • 2 Hours ago
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
