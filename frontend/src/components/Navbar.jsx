import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "relative text-sky-600 font-medium after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-sky-500 after:rounded-full"
      : "text-gray-600 hover:text-sky-600 font-medium transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand + Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 tracking-tight"
          >
            Skill<span className="text-sky-500">Swap</span>
          </Link>

          {token && (
            <div className="hidden md:flex items-center gap-6 text-sm">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/requests" className={navLinkClass}>
                Requests
              </NavLink>
              <NavLink to="/search" className={navLinkClass}>
                Search
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
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
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

          {/* Desktop auth */}
          <div className="hidden md:block">
            {!token ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-sky-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-6 py-4 flex flex-col gap-3 text-sm">
            {token && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/requests" className={navLinkClass}>
                  Requests
                </NavLink>
                <NavLink to="/search" className={navLinkClass}>
                  Search
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
                <NavLink to="/messages" className={navLinkClass}>
                  Messages
                </NavLink>
              </>
            )}

            {!token ? (
              <div className="flex gap-3 pt-3">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 rounded-lg border border-gray-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 bg-sky-500 text-white py-2 rounded-lg text-center font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition mt-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
