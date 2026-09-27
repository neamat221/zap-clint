import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import UseAxiosSecure from "../../Hok/UseAxiosSecure";
import useHandleAssignedRider from "./Rider/HandelAssineRider";
import UseRole from "../../Hok/UseRole";
import PrivateRouter from "../../PrivateRouter/PrivateRouter";
import Navbar from "../Sherd/Navbar/Navbar";
import Footer from "../Sherd/Footer/Footer";
import AllDeliveries from "./AllDeliveries/AllDeliveries";
import AssignRiders from "./AllDeliveries/AssignRiders";
import Deliveries from "./AllDeliveries/Deliveries";
import RiderInfo from "./AllDeliveries/RiderInfo/RiderInfo";
import AprovierRider from "./AprovierRider/AprovierRider";
import RiderDetails from "./AprovierRider/RiderDetails";
import UserManagement from "./UserManagement/UserManagement";
import RiderDashboard from "./Rider/RiderDashboard";
import { getParcels, mergeKeepFirst, onStoreChange, scopeParcels } from "../../Hok/ClientStore";

// ==========================================
// 1. SIDEBAR COMPONENT
// ==========================================
const Sidebar = ({ activeMenu, setActiveMenu, onLogout, sidebarOpen, onClose, isAdmin, isRider }) => {
  const riderMenuItems = [
    { name: "My Deliveries", icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" },
  ];
  const baseMenuItems = [
    { name: "Dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" },
    { name: "Deliveries", icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" },
    { name: "Invoices", icon: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" },
    { name: "Stores", icon: "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" },
    { name: "Pricing Plan", icon: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1H6.32c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" },
    { name: "Coverage Area", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
  ];
  const adminMenuItems = [
    { name: "Assign Riders", icon: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" },
    { name: "Approve Riders", icon: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
    { name: "User Management", icon: "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 13.17 10.33 12 8 12zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },
    { name: "RiderDetails", icon: "M12 2l8 3v6c0 5-3.4 8.8-8 11-4.6-2.2-8-6-8-11V5l8-3zm0 2.1L6 6.6V11c0 4.1 2.4 7.1 6 8.9 3.6-1.8 6-4.8 6-8.9V6.6L12 4.1zM7 9h10v1.5H7V9zm0 3h10v1.5H7V12zm0 3h7v1.5H7V15z" },
    { name: "Rider Dashboard", icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 14v-2h8v2h-2v3h-2v-3H6zm8-4H6V8h8v2z" },
  ];
  const menuItems = isRider
    ? riderMenuItems
    : isAdmin
    ? [...adminMenuItems, ...baseMenuItems]
    : baseMenuItems;

  const generalItems = [
    { name: "Settings" },
    { name: "Change Password" },
    { name: "Help" },
    { name: "Logout" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-white p-6 flex flex-col justify-between shrink-0 border-r border-gray-100
          lg:flex
          ${sidebarOpen
            ? "fixed inset-y-0 left-0 z-50 flex shadow-xl"
            : "hidden lg:flex"}
        `}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-[#C0E75A] rounded-md flex items-center justify-center font-black text-xs text-[#0B252C] transform -skew-x-12">
              Z
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0B252C]">ZapShift</span>
            {sidebarOpen && (
              <button
                onClick={onClose}
                className="ml-auto lg:hidden text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Menu Section */}
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">MENU</p>
          <nav className="space-y-1 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setAssignSubView(null);
                  setViewRider(null);
                  if (onClose) onClose();
                }}
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

          {!isRider && (
            <button
              onClick={() => {
                setActiveMenu("All Deliveries");
                setViewRider(null);
                if (onClose) onClose();
              }}
              className={`flex items-center justify-between gap-3 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-colors w-full max-w-[200px] mb-8 ${
                activeMenu === "All Deliveries"
                  ? "bg-white text-[#0B252C] border border-[#C0E75A]"
                  : "bg-white text-[#0B252C] hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <span>All Deliveries</span>
              </div>
              <svg
                className="w-3.5 h-3.5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}

          {/* General Section */}
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">GENERAL</p>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === "Logout") {
                    onLogout();
                    return;
                  }
                  setActiveMenu(item.name);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors ${
                  activeMenu === item.name ? "text-[#0B252C] font-bold" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

// ==========================================
// 2. HEADER COMPONENT
// ==========================================
const Header = ({ user, onToggleSidebar }) => {
  const displayRole = user?.role || "User";
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <button onClick={onToggleSidebar} className="text-gray-400 hover:text-gray-600 lg:hidden">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        {user?.name || user?.email ? (
          <>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 relative">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute top-2 right-2" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-[#C0E75A] flex items-center justify-center font-bold text-xs text-[#0B252C] uppercase">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                )}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold leading-tight text-[#0B252C]">{user?.name || "User"}</p>
                <p className="text-[10px] text-gray-400 capitalize">{displayRole}</p>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
};

// ==========================================
// 3. OVERALL STATISTICS GRAPH COMPONENT
// ==========================================
const StatisticsGraph = ({ parcels }) => {
  const periods = [
    { label: "This Week", weekOffset: 0 },
    { label: "Last Week", weekOffset: 1 },
    { label: "2 Weeks Ago", weekOffset: 2 },
    { label: "This Month", weekOffset: -1 },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const active = periods.find((p) => p.label === selectedPeriod);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const mondayOffset = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);

  const startOfRange = (() => {
    if (active.weekOffset < 0) {
      const s = new Date(startOfWeek);
      s.setDate(1);
      s.setHours(0, 0, 0, 0);
      return s;
    }
    const s = new Date(startOfWeek);
    s.setDate(s.getDate() - active.weekOffset * 7);
    return s;
  })();

  const endOfRange = (() => {
    if (active.weekOffset < 0) {
      const e = new Date(startOfRange);
      e.setMonth(e.getMonth() + 1, 0);
      e.setHours(23, 59, 59, 999);
      return e;
    }
    const e = new Date(startOfRange);
    e.setDate(e.getDate() + 7);
    return e;
  })();

  const counts = days.map((_, i) => {
    const start = new Date(startOfRange);
    start.setDate(start.getDate() + i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return parcels.filter((p) => {
      if (!p.createdAt) return false;
      const t = new Date(p.createdAt).getTime();
      return t >= start.getTime() && t < Math.min(end.getTime(), endOfRange.getTime());
    }).length;
  });

  const dayDates = days.map((_, i) => {
    const d = new Date(startOfRange);
    d.setDate(d.getDate() + i);
    return d;
  });

  const activeDay = hoveredDay != null ? hoveredDay : days.length - 1;
  const hoveredCount = counts[activeDay];

  const max = Math.max(...counts, 1);
  const width = 700;
  const padLeft = 40;
  const padRight = 20;
  const top = 20;
  const bottom = 165;
  const plotW = width - padLeft - padRight;

  const points = counts.map((c, i) => {
    const x = padLeft + (plotW * i) / (days.length - 1);
    const y = bottom - (c / max) * (bottom - top);
    return [x, y];
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1][0].toFixed(1)} ${bottom} L ${points[0][0].toFixed(1)} ${bottom} Z`;

  const hoveredPoint = points[activeDay];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-[#0B252C]">Overall Statistics</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl"
            >
              {selectedPeriod}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md z-10 py-1 min-w-[130px]">
                {periods.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setSelectedPeriod(p.label);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#C0E75A]/10 ${
                      p.label === selectedPeriod ? "font-bold text-[#0B252C]" : "text-gray-500"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative h-52 w-full">
        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
          {[0, 1, 2, 3].map((i) => {
            const y = top + (i * (bottom - top)) / 3;
            const val = max - (i * max) / 3;
            return (
              <g key={i}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#F1F3F6" strokeDasharray="4 4" />
                <text x="10" y={y + 3} fill="#9CA3AF" fontSize="10">
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C0E75A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C0E75A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#chartGradient)" />
          <path d={linePath} fill="none" stroke="#A2D636" strokeWidth="3" />

          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hoveredDay === i ? 5 : 3}
              fill="#0B252C"
              stroke="#A2D636"
              strokeWidth="2"
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(days.length - 1)}
              className="cursor-pointer"
            />
          ))}

          {days.map((d, i) => (
            <text
              key={d}
              x={points[i][0]}
              y="195"
              fill={hoveredDay === i ? "#0B252C" : "#9CA3AF"}
              fontSize="10"
              fontWeight={hoveredDay === i ? "bold" : "normal"}
              textAnchor="middle"
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(days.length - 1)}
              className="cursor-pointer"
            >
              {d}
            </text>
          ))}
        </svg>

        {hoveredPoint && (
          <div
            className="absolute bg-white border border-gray-100 shadow-md rounded-lg px-3 py-1.5 text-[10px] pointer-events-none transform -translate-x-1/2"
            style={{
              left: `${(hoveredPoint[0] / 700) * 100}%`,
              top: `${(hoveredPoint[1] / 200) * 100 - 8}%`,
            }}
          >
            <p className="text-gray-400 whitespace-nowrap">
              {dayDates[activeDay].toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="font-bold flex items-center gap-1 text-[#0B252C] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A2D636]" /> {hoveredCount} parcel{hoveredCount === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. SHIPPING REPORTS & INVOICES TABLES COMPONENT
// ==========================================
const statusColors = (status) => {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "transit":
    case "in transit":
      return "bg-sky-100 text-sky-700";
    case "ready to deliver":
      return "bg-violet-100 text-violet-700";
    case "to pay":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const lateInvoices = [
  { id: "#PTD14542547", price: "4500.00", date: "10 day ago" },
  { id: "#PTD14542547", price: "9800.00", date: "1 day ago" },
  { id: "#PTD14542547", price: "2000.00", date: "1h ago" },
  { id: "#PTD14542547", price: "2700.00", date: "2h ago" },
  { id: "#PTD14542547", price: "1920.00", date: "3h ago" },
  { id: "#PTD14542547", price: "6500.00", date: "4h ago" },
];

const DashboardTables = ({ parcels, onEdit }) => {
  const reportPeriods = [
    { label: "This Week" },
    { label: "Last Week" },
    { label: "2 Weeks Ago" },
    { label: "This Month" },
  ];
  const [reportPeriod, setReportPeriod] = useState("This Week");
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [reportSort, setReportSort] = useState("newest");

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const mondayOffset = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - mondayOffset);

  const reportOffset = reportPeriod === "This Week" ? 0
    : reportPeriod === "Last Week" ? 1
    : reportPeriod === "2 Weeks Ago" ? 2 : -1;

  const reportFrom = (() => {
    if (reportOffset < 0) {
      const s = new Date(startOfWeek);
      s.setDate(1);
      s.setHours(0, 0, 0, 0);
      return s.getTime();
    }
    const s = new Date(startOfWeek);
    s.setDate(s.getDate() - reportOffset * 7);
    return s.getTime();
  })();

  const reportTo = (() => {
    if (reportOffset < 0) {
      const e = new Date(reportFrom);
      e.setMonth(e.getMonth() + 1, 0);
      e.setHours(23, 59, 59, 999);
      return e.getTime();
    }
    const e = new Date(reportFrom);
    e.setDate(e.getDate() + 7);
    return e.getTime();
  })();

  const filteredParcels = parcels.filter((p) => {
    if (!p.createdAt) return false;
    const t = new Date(p.createdAt).getTime();
    return t >= reportFrom && t < reportTo;
  });

  const shippingReports = filteredParcels.map((p) => ({
    id: p.trackingCode || p._id || p.id,
    client: p.receiverName || p.senderName || "N/A",
    date: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "—",
    weight: `${p.parcelWeight || 0} kg`,
    shipper: "ZapShift",
    price: p.deliveryCost ? p.deliveryCost.toLocaleString() : "0",
    status: p.status || "Pending",
    bg: statusColors(p.status),
    original: p,
  }));

  const [showAllReports, setShowAllReports] = useState(false);
  const sortedReports = [...shippingReports].sort((a, b) => {
    const ta = new Date(a.original?.createdAt || 0).getTime();
    const tb = new Date(b.original?.createdAt || 0).getTime();
    return reportSort === "newest" ? tb - ta : ta - tb;
  });
  const visibleReports = showAllReports ? sortedReports : sortedReports.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Shipping Reports Table */}
      <div className="bg-white rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-[#0B252C]">Shipping Reports</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setReportMenuOpen((o) => !o)}
                className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl"
              >
                {reportPeriod}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {reportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-md z-10 py-1 min-w-[130px]">
                  {reportPeriods.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setReportPeriod(p.label);
                        setReportMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#C0E75A]/10 ${
                        p.label === reportPeriod ? "font-bold text-[#0B252C]" : "text-gray-500"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filteredParcels.length > 0 && (
              <>
                <button
                  onClick={() => setReportSort("newest")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                    reportSort === "newest"
                      ? "bg-[#0B252C] text-white"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setReportSort("oldest")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                    reportSort === "oldest"
                      ? "bg-[#0B252C] text-white"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Oldest
                </button>
              </>
            )}
            <button className="border border-gray-200 p-1.5 rounded-xl text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
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
            <tbody className="divide-y divide-gray-50 text-gray-600">
              {shippingReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No parcels yet. Create a booking and it will appear here.
                  </td>
                </tr>
              ) : (
                visibleReports.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-medium text-[#0B252C]">{row.id}</td>
                    <td className="py-3.5">{row.client}</td>
                    <td className="py-3.5 text-gray-400">{row.date}</td>
                    <td className="py-3.5">{row.weight}</td>
                    <td className="py-3.5">{row.shipper}</td>
                    <td className="py-3.5 font-semibold text-[#0B252C]">{row.price}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.bg}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit?.(row.original)}
                        className="text-gray-400 hover:text-gray-600 text-[11px] font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {shippingReports.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllReports((s) => !s)}
              className="text-xs font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-4 py-2 rounded-xl"
            >
              {showAllReports ? "Show Less" : `View All (${shippingReports.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Late Invoices & Shipment Alerts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Late Invoices Table */}
        <div className="bg-white rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0B252C]">Late Invoices</h2>
            <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-[11px] px-3 py-1.5 rounded-xl">
              View All Invoices
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-2 font-semibold">No</th>
                  <th className="pb-2 font-semibold">Price</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lateInvoices.map((inv, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-medium text-[#0B252C]">{inv.id}</td>
                    <td className="py-2.5 font-semibold text-[#0B252C]">{inv.price}</td>
                    <td className="py-2.5 text-gray-400">{inv.date}</td>
                    <td className="py-2.5 text-right text-gray-400">•••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipment Alerts Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0B252C]">Shipment Alerts</h2>
            <button className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-[11px] px-3 py-1.5 rounded-xl">
              View All Invoices
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 p-3 rounded-xl text-center">
            <div>
              <p className="text-lg font-black text-[#0B252C]">2</p>
              <p className="text-[10px] text-gray-400 font-medium">Damaged</p>
            </div>
            <div>
              <p className="text-lg font-black text-[#0B252C]">10</p>
              <p className="text-[10px] text-gray-400 font-medium">Weather Delays</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 font-bold">
                    !
                  </div>
                  <div>
                    <p className="font-bold text-[#0B252C]">Damaged</p>
                    <p className="text-[10px] text-gray-400">
                      Shipment <span className="font-semibold text-gray-600">#SP11251C</span> • 2 Hours ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN DASHBOARD CONTAINER COMPONENT
// ==========================================
const DashboardLayout = () => {
  const navigate = useNavigate();
  const axiosecure = UseAxiosSecure();
  const { syncTracking } = useHandleAssignedRider(axiosecure);
  const { isAdmin, role } = UseRole();
  const isRider = String(role || "").toLowerCase() === "rider";
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignSubView, setAssignSubView] = useState(null);
  const [viewRider, setViewRider] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [editingParcel, setEditingParcel] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [user, setUser] = useState(() => ({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    photoURL: auth.currentUser?.photoURL || null,
  }));

  useEffect(() => {
    if (isRider && ["Dashboard", "Deliveries", "All Deliveries"].includes(activeMenu)) {
      setActiveMenu("My Deliveries");
    }
  }, [isRider, activeMenu]);

  useEffect(() => {
    const emailFallback = auth.currentUser?.email;
    const applyUser = (email) => {
      setUser((prev) => ({ ...prev, email: email || prev.email }));
      if (!email) return;
      axiosecure
        .get(`/users/${email}`)
        .then(({ data }) => {
          if (data && !data.error) {
            setUser((prev) => {
              const next = {
                ...prev,
                name: data.name || prev.name,
                photoURL: data.photoURL || prev.photoURL,
                role: data.role || "User",
                createdAt: data.createdAt || "",
              };
              const current = JSON.parse(
                localStorage.getItem("zapshift_current_user") || "null"
              );
              localStorage.setItem(
                "zapshift_current_user",
                JSON.stringify({ ...current, ...next })
              );
              return next;
            });
          }
        })
        .catch(() => {});
    };
    if (emailFallback) applyUser(emailFallback);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      applyUser(user?.email || "");
    });
    const onFocusRefresh = () => {
      const email = auth.currentUser?.email;
      if (email) applyUser(email);
    };
    window.addEventListener("focus", onFocusRefresh);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", onFocusRefresh);
    };
  }, [axiosecure]);

  useEffect(() => {
    if (role) {
      setUser((prev) => {
        if (prev.role === role) return prev;
        const next = { ...prev, role };
        const current = JSON.parse(
          localStorage.getItem("zapshift_current_user") || "null"
        );
        localStorage.setItem(
          "zapshift_current_user",
          JSON.stringify({ ...current, ...next })
        );
        return next;
      });
    }
  }, [role]);

  const authUid = auth.currentUser?.uid || "";
  const authEmail = auth.currentUser?.email || "";

  useEffect(() => {
    const readLocal = () => {
      try {
        return JSON.parse(localStorage.getItem("zap_my_parcels")) || [];
      } catch {
        return [];
      }
    };

    const isAuthed = Boolean(authUid || authEmail);
    const owner = { uid: authUid, email: authEmail };

    const fetchParcels = async () => {
      // Fresh reload: wait for Firebase to restore the logged-in session
      // before showing any parcels, so another user's cached data (or all
      // server parcels) is never flashed or cached under the wrong user.
      if (!isAuthed) {
        setParcels([]);
        return;
      }
      // Load cached state first so parcels show immediately. Regular users are
      // strictly scoped to their own parcels so nothing leaks.
      const cached = readLocal();
      const cachedForUser = !isAdmin ? scopeParcels(cached, owner) : cached;
      if (cachedForUser.length) setParcels(cachedForUser);

      try {
        const scopeQuery = !isAdmin
          ? `?userId=${encodeURIComponent(authUid)}&email=${encodeURIComponent(authEmail || "")}`
          : "";
        const { data } = await axiosecure.get(`/parceals${scopeQuery}`);
        if (Array.isArray(data)) {
          // The backend filters by the same owner; the client re-scopes so a
          // missing server filter can never leak another user's parcels.
          const serverItems = !isAdmin ? scopeParcels(data, owner) : data;
          const byKey = (p) => String(p.trackingCode || p._id || p.id);
          const serverKeys = new Set(serverItems.map(byKey));
          const extraLocal = cachedForUser.filter((p) => !serverKeys.has(byKey(p)));
          // Local store wins on conflicts so frontend-made assignments survive.
          const merged = mergeKeepFirst(extraLocal, cachedForUser, serverItems);
          setParcels(merged);
          localStorage.setItem("zap_my_parcels", JSON.stringify(merged));
          return;
        }
      } catch (error) {
        console.error("Failed to fetch parcels:", error);
      }
      setParcels(cachedForUser.length ? cachedForUser : []);
    };
    fetchParcels();
  }, [axiosecure, isAdmin, authUid, authEmail]);

  // Keep the dashboard views in sync with browser-store assignment changes
  // (e.g. assigning a rider while this dashboard is mounted).
  useEffect(() => {
    const isAuthed = Boolean(authUid || authEmail);
    const owner = { uid: authUid, email: authEmail };
    return onStoreChange(() => {
      if (!isAuthed) {
        setParcels([]);
        return;
      }
      const cached = getParcels();
      setParcels(!isAdmin ? scopeParcels(cached, owner) : cached);
    });
  }, [isAdmin, authUid, authEmail]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem("zapshift_current_user");
    navigate("/login");
  };

  const handleEditClick = (parcel) => {
    setEditingParcel(parcel);
    setEditStatus(parcel.status || "Pending");
  };

  const handleEditSave = async () => {
    const id = editingParcel?._id || editingParcel?.id || editingParcel?.trackingCode;
    const updated = { ...editingParcel, status: editStatus };
    // Update locally first so the change is visible immediately, even if the
    // backend is unreachable or slow.
    const nextParcels = parcels.map((p) =>
      (p._id || p.id || p.trackingCode) === id ? updated : p
    );
    setParcels(nextParcels);
    localStorage.setItem("zap_my_parcels", JSON.stringify(nextParcels));
    setEditingParcel(null);
    if (id) {
      try {
        await axiosecure.patch(`/parceals/${id}`, { status: editStatus });
      } catch (error) {
        console.error("Failed to update parcel:", error);
      }
    }
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    const parcelId = typeof paymentInfo === "string"
      ? paymentInfo
      : (paymentInfo.parcelId || paymentInfo.trackingCode);

    const target = parcels.find((p) => (p.trackingCode || p._id || p.id) === parcelId);
    const txn =
      (typeof paymentInfo === "string" ? "" : paymentInfo.transactionId) ||
      `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const method = typeof paymentInfo === "string" ? "" : (paymentInfo.method || "");
    const account = typeof paymentInfo === "string" ? "" : (paymentInfo.account || "");
    const paidAt = new Date().toISOString();
    const paymentDetails = {
      paymentStatus: "Paid",
      paid: true,
      paidAt,
      paymentMethod: method,
      transactionId: txn,
      paymentAccount: account,
    };
    const next = parcels.map((p) =>
      (p.trackingCode || p._id || p.id) === parcelId
        ? { ...p, ...paymentDetails }
        : p
    );
    setParcels(next);
    localStorage.setItem("zap_my_parcels", JSON.stringify(next));

    // Persist to the backend so it survives reload and logout/login.
    const id = target?._id || parcelId;
    if (id) {
      try {
        await axiosecure.patch(`/parceals/${id}`, paymentDetails);
      } catch (error) {
        console.error("Failed to persist payment to backend parcel:", error);
      }
    }

    // Record the completed payment in the dedicated "payments" collection.
    try {
      await axiosecure.post("/payments", {
        paymentId: `PAY-${Date.now()}`,
        transactionId: txn,
        account,
        parcelId: target?._id || parcelId,
        trackingCode: target?.trackingCode || (typeof paymentInfo === "string" ? parcelId : paymentInfo.trackingCode),
        method,
        amount: typeof paymentInfo === "string" ? (target?.deliveryCost || 0) : (paymentInfo.amount || target?.deliveryCost || 0),
        parcelName: typeof paymentInfo === "string" ? (target?.parcelName || "") : (paymentInfo.parcelName || target?.parcelName || ""),
        userId: auth.currentUser?.uid || "",
        email: auth.currentUser?.email || "",
        status: "Paid",
        createdAt: paidAt,
      });
    } catch (error) {
      console.error("Failed to record payment in payments collection:", error);
    }

    // Sync the paid delivery into the "trackings" collection (with assigned rider info).
    if (target && (target.trackingCode || target._id || target.id)) {
      const paidParcel = {
        ...target,
        paymentStatus: "Paid",
        paid: true,
        paidAt,
      };
      try {
        await syncTracking(paidParcel, {
          type: "payment",
          status: "Paid",
          message: "Payment received for this delivery.",
        });
      } catch (error) {
        console.error(
          "Failed to sync tracking record for paid delivery:",
          error
        );
      }
    }
  };

  const handleDeleteParcel = (parcelId) => {
    const target = parcels.find((p) => (p.trackingCode || p._id || p.id) === parcelId);
    const next = parcels.filter((p) => (p.trackingCode || p._id || p.id) !== parcelId);
    setParcels(next);
    localStorage.setItem("zap_my_parcels", JSON.stringify(next));
    const id = target?._id || parcelId;
    if (id) axiosecure.delete(`/parceals/${id}`).catch(() => {});
  };

  const countBy = (statuses) =>
    parcels.filter((p) => statuses.includes(String(p.status || "").toLowerCase()))
      .length;

  const toPay = countBy(["pending", "waiting", "to pay"]);
  const readyPickup = countBy(["ready pick up", "picked up", "pickup scheduled"]);
  const inTransit = countBy(["transit", "in transit", "out for delivery"]);
  const readyToDeliver = countBy(["ready to deliver", "out for delivery"]);
  const delivered = countBy(["delivered"]);

  const metricCards = [
    { label: "To Pay", count: toPay },
    { label: "Ready Pick UP", count: readyPickup },
    { label: "In Transit", count: inTransit },
    { label: "Ready to Deliver", count: readyToDeliver },
    { label: "Delivered", count: delivered },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#EAEBED] min-h-screen flex text-[#0B252C]">
      {/* 1. Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isAdmin={isAdmin}
        isRider={isRider}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Header */}
        <Header user={user} onToggleSidebar={() => setSidebarOpen((o) => !o)} />

        {/* Dashboard Main Area */}
        <main className="p-4 md:p-8 space-y-6 overflow-y-auto">
          {isRider ? (
            <>
              <RiderDashboard />
              {editingParcel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                    <h3 className="text-sm font-bold text-[#0B252C] mb-1">Edit Parcel</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      {editingParcel.trackingCode || editingParcel._id || editingParcel.id} · {editingParcel.receiverName || editingParcel.senderName || ""}
                    </p>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0B252C] focus:outline-none focus:ring-2 focus:ring-[#C0E75A] mb-5"
                    >
                      <option value="Pending">Pending</option>
                      <option value="To Pay">To Pay</option>
                      <option value="Ready Pick Up">Ready Pick Up</option>
                      <option value="Transit">Transit</option>
                      <option value="Ready to Deliver">Ready to Deliver</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingParcel(null)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleEditSave}
                        className="text-xs font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-4 py-2 rounded-xl"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : activeMenu === "Assign Riders" && isAdmin ? (
            assignSubView === "deliveries" ? (
              <Deliveries
                onBack={() => setAssignSubView(null)}
                onSelectRider={(rider) => {
                  setViewRider(rider);
                  setActiveMenu("Deliveries");
                }}
              />
            ) : (
              <AssignRiders onViewDeliveries={() => setAssignSubView("deliveries")} />
            )
          ) : activeMenu === "Deliveries" || activeMenu === "All Deliveries" ? (
            <>
              {viewRider ? (
                <RiderInfo
                  rider={viewRider}
                  parcels={parcels}
                  onEdit={handleEditClick}
                  onPaymentSuccess={handlePaymentSuccess}
                  onDelete={handleDeleteParcel}
                  onShowAll={() => setViewRider(null)}
                />
              ) : (
                <AllDeliveries
                  parcels={parcels}
                  onEdit={handleEditClick}
                  onPaymentSuccess={handlePaymentSuccess}
                  onDelete={handleDeleteParcel}
                />
              )}
            </>
          ) : activeMenu === "Approve Riders" ? (
            <AprovierRider onApprove={() => setActiveMenu("RiderDetails")} />
          ) : activeMenu === "RiderDetails" ? (
            <RiderDetails />
          ) : activeMenu === "Rider Dashboard" ? (
            <RiderDashboard forAdmin />
          ) : activeMenu === "My Deliveries" ? (
            <RiderDashboard />
          ) : activeMenu === "User Management" ? (
            <UserManagement />
          ) : (
            <>
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black">Dashboard Overview</h1>
                {user?.name || user?.email ? (
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-gray-100 shadow-xs max-w-full">
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-[#C0E75A] flex items-center justify-center font-bold text-xs text-[#0B252C] uppercase">
                          {user?.name ? user.name.charAt(0) : "U"}
                        </div>
                      )}
                    </div>
                    <div className="text-left leading-tight min-w-0">
                      <p className="text-xs font-bold text-[#0B252C] truncate max-w-[120px] sm:max-w-none">{user?.name || "User"}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{user?.role || "User"}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-gray-400 mt-1">You can access all your data and information from anywhere.</p>
            </div>
            <button
              onClick={() => navigate("/send-a-parcel")}
              className="bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <span>+</span> Add Parcel
            </button>
          </div>

          {/* Logged-in Admin Details */}
          {isAdmin ? (
            <div className="bg-[#0B252C] text-white rounded-2xl shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-white/60 tracking-wider uppercase">Admin Panel</p>
                <span className="px-2.5 py-1 rounded-full bg-[#C0E75A] text-[#0B252C] text-[10px] font-black uppercase">Admin</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-[#C0E75A]">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-[#C0E75A] flex items-center justify-center font-black text-2xl text-[#0B252C] uppercase">
                      {user?.name ? user.name.charAt(0) : "A"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black">{user?.name || "Admin"}</h2>
                  <div className="mt-1 space-y-0.5 text-xs text-white/70">
                    <p><span className="font-semibold text-white/50">Email:</span> {user?.email}</p>
                    <p><span className="font-semibold text-white/50">Role:</span> <span className="capitalize">{user?.role || "Admin"}</span></p>
                    <p><span className="font-semibold text-white/50">Joined:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Logged-in User Profile Details */}
              {user?.email ? (
                <div className="bg-white rounded-2xl shadow-xs p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-[#C0E75A] flex items-center justify-center font-black text-2xl text-[#0B252C] uppercase">
                        {user?.name ? user.name.charAt(0) : "U"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black text-[#0B252C]">{user?.name || "User"}</h2>
                    <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                      <p><span className="font-semibold text-gray-400">Email:</span> {user?.email}</p>
                      <p><span className="font-semibold text-gray-400">Role:</span> <span className="capitalize">{user?.role || "User"}</span></p>
                      <p><span className="font-semibold text-gray-400">Joined:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {metricCards.map((stat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                  📦
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-lg font-black">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Graph Component */}
          <StatisticsGraph parcels={parcels} />

          {/* 4. Tables Component */}
          <DashboardTables parcels={parcels} onEdit={handleEditClick} />
            </>
          )}
        </main>
      </div>

      {/* Edit Parcel Modal */}
      {editingParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-sm font-bold text-[#0B252C] mb-1">Edit Parcel</h3>
            <p className="text-xs text-gray-400 mb-4">
              {editingParcel.trackingCode || editingParcel._id || editingParcel.id} · {editingParcel.receiverName || editingParcel.senderName || ""}
            </p>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#0B252C] focus:outline-none focus:ring-2 focus:ring-[#C0E75A] mb-5"
            >
              <option value="Pending">Pending</option>
              <option value="To Pay">To Pay</option>
              <option value="Ready Pick Up">Ready Pick Up</option>
              <option value="Transit">Transit</option>
              <option value="Ready to Deliver">Ready to Deliver</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingParcel(null)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="text-xs font-bold text-[#0B252C] bg-[#C0E75A] hover:bg-[#b0d84b] px-4 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;

export const dashboardRoute = {
  path: "/dashboard",
  element: <PrivateRouter />,
  children: [
    {
      index: true,
      Component: DashboardLayout,
    },
  ],
};