import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "relative text-sky-600 font-semibold px-3 py-1.5 bg-sky-50 rounded-lg transition-all"
      : "text-gray-600 hover:text-sky-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium transition-all";

  return (
    <nav className="sticky top-0 z-50 w-full py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto glass rounded-2xl shadow-lg border border-white/40">
        <div className="px-6 h-16 flex items-center justify-between gap-4">

          {/* Left: Brand + Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="group flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>

            {token && (
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/requests" className={navLinkClass}>
                  Requests
                </NavLink>
                <NavLink to="/search" className={navLinkClass}>
                  Search
                </NavLink>
                <NavLink to="/matches" className={navLinkClass}>
                  Matches
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
                <NavLink to="/messages" className={navLinkClass}>
                  Messages
                </NavLink>
              </div>
            )}
          </div>

          {/* Right: Auth buttons + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Desktop auth */}
            <div className="hidden md:block">
              {!token ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-sky-600 font-medium px-4 py-2 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-semibold"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications((s) => !s)}
                      className="p-2.5 text-gray-500 hover:text-sky-600 hover:bg-white/50 rounded-xl transition-all relative border border-transparent hover:border-white/40"
                      aria-label="Notifications"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-all border border-transparent hover:border-white/40 text-gray-600"
              onClick={() => setOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d={
                    open
                      ? "M6 18L18 6M6 6l12 12"
                      : "M3 12h18M3 6h18M3 18h18"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-white/20 bg-white/40 backdrop-blur-md">
            <div className="px-6 py-6 flex flex-col gap-2 text-sm">
              {token && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/requests" className={navLinkClass} onClick={() => setOpen(false)}>
                    Requests
                  </NavLink>
                  <NavLink to="/search" className={navLinkClass} onClick={() => setOpen(false)}>
                    Search
                  </NavLink>
                  <NavLink to="/matches" className={navLinkClass} onClick={() => setOpen(false)}>
                    Matches
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                    Profile
                  </NavLink>
                  <NavLink to="/messages" className={navLinkClass} onClick={() => setOpen(false)}>
                    Messages
                  </NavLink>
                </>
              )}

              {!token ? (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
                  <Link
                    to="/login"
                    className="text-center py-2.5 rounded-xl border border-white/40 text-gray-600 bg-white/20"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-sky-500 text-white py-2.5 rounded-xl text-center font-semibold shadow-sm"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2.5 rounded-xl transition-all mt-4 font-semibold border border-red-100"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
