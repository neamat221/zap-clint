import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import logo from "../../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY && y > 80) {
        setHidden(true);
      } else if (y < lastScrollY) {
        setHidden(false);
      }
      lastScrollY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Reflect logged-in state from both Firebase and stored session
    const updateFromStorage = () => {
      try {
        setCurrentUser(
          JSON.parse(localStorage.getItem("zapshift_current_user")) || null
        );
      } catch {
        setCurrentUser(null);
      }
    };
    updateFromStorage();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          name: firebaseUser.displayName || "",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
        });
        localStorage.setItem(
          "zapshift_current_user",
          JSON.stringify({
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || null,
          })
        );
      } else {
        updateFromStorage();
      }
    });

    return () => unsubscribe();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem("zapshift_current_user");
    setCurrentUser(null);
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Services", href: currentUser ? "#services" : "/login" },
    { label: "Coverage", href: "/coverage-districts" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Send A Parcel", href: "/send-a-parcel" },
    { label: "Take Order", href: "/take-order" },
    { label: "Be a Rider", href: "/be-a-rider" },
  ];

  const protectedLinks = ["/pricing", "/send-a-parcel", "/take-order", "/be-a-rider"];
  const visibleLinks = currentUser
    ? links
    : links.filter((link) => !protectedLinks.includes(link.href));

  const isActive = (href) => {
    if (href.startsWith("#")) {
      return location.pathname === "/" && location.hash === href;
    }
    return location.pathname === href;
  };

  return (
    <nav className={`sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-sm shadow-sm zap-container rounded-2xl border border-gray-100 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      {/* Hamburger - visible below md */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img src={logo} alt="ZapShift logo" className="h-8 w-auto" />
        <span className="text-xl font-bold tracking-tight text-slate-900">
          ZapShift
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-2">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive(link.href)
                ? "bg-[#C0E75A] text-slate-900"
                : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-[#C0E75A] transition-shadow cursor-pointer"
              aria-label="Open dashboard"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#C0E75A] flex items-center justify-center font-bold text-sm text-[#0B252C] uppercase">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </div>
              )}
            </button>

            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="ml-1 w-6 h-6 -mr-2 flex items-center justify-center text-gray-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="User menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#C0E75A] flex items-center justify-center font-bold text-lg text-[#0B252C] uppercase">
                        {currentUser.name ? currentUser.name.charAt(0) : "U"}
                      </div>
                    )}
                    <div className="min-w-0"> 
                      <p className="text-sm font-bold text-[#0B252C] truncate">
                        {currentUser.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/dashboard");
                    }}
                    className="w-full mb-2 bg-[#F1F3F6] hover:bg-[#e8ebef] text-[#0B252C] font-bold text-xs py-2 rounded-xl transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#C0E75A] hover:bg-[#b0d84b] text-[#0B252C] font-bold text-xs py-2 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden sm:block px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        )}
        <Link
          to={currentUser ? "/be-a-rider" : "/login"}
          className="flex items-center space-x-2 pl-5 pr-2 py-2 bg-[#C0E75A] text-slate-900 font-medium text-sm rounded-xl hover:bg-[#b2dc4c] transition-colors"
        >
          <span className="hidden sm:block">Be a rider</span>
          <div className="bg-slate-900 text-white p-1.5 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m7 17 9.2-9.2M17 17V7H7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[calc(100%-2rem)] max-w-6xl bg-white border border-gray-100 rounded-2xl shadow-lg p-4 flex flex-col space-y-1 z-50">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive(link.href)
                  ? "bg-[#C0E75A]/40 text-slate-900"
                  : "text-gray-600 hover:text-slate-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {currentUser ? (
            <div className="flex items-center gap-2 mt-2 px-4 py-2.5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#C0E75A] flex items-center justify-center font-bold text-sm text-[#0B252C] uppercase">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 truncate">
                {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
                className="ml-auto px-3 py-1.5 text-xs font-medium text-[#0B252C] bg-[#C0E75A] rounded-lg hover:bg-[#b0d84b] transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors sm:hidden text-left"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;