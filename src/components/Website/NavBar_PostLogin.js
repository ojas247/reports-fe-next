'use client';

import { useEffect, useState } from "react";
import { isSessionTokenValid } from "../../pages/api/UtilFunctions";
import SearchBar from '../../components/Functionalities/SearchBar';
import SearchBarMobile from '../../components/Functionalities/SearchBarMobile';
import Link from 'next/link';

export default function NavBar_PostLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    setIsAuthenticated(isSessionTokenValid());

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 flex items-center px-3 sm:px-4 md:px-6 shrink-0 gap-2">
      
      {/* Left: Hamburger (Mobile only) */}
      <button
        className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none shrink-0"
        onClick={toggleNav}
        aria-label="Toggle navigation menu"
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"} text-xl`} />
      </button>

      {/* Center: Desktop Search */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
      </div>

      {/* Spacer for mobile so right side stays right */}
      <div className="flex-1 md:hidden" />

      {/* Right side: Search (mobile) + Avatar */}
    {/* Right side: Search + Avatar */}
<div className="flex items-center gap-3 shrink-0">

   <div className="md:hidden flex items-center shrink-0 ">
    <SearchBarMobile />
</div>

    {/* Profile Avatar */}
    <div className="relative profile-dropdown shrink-0">
        <button
            onClick={toggleProfile}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="User Profile"
        >
            <i className="bi bi-person-fill text-base" />
        </button>

        {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <Link
                    href="/Settings/Profile"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsProfileOpen(false)}
                >
                    <i className="bi bi-person-badge text-sm text-slate-500" />
                    <span>Your Profile</span>
                </Link>

                <Link
                    href="/Pricing"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsProfileOpen(false)}
                >
                    <i className="bi bi-award text-sm text-slate-500" />
                    <span>Upgrade Plan</span>
                </Link>

                <div className="border-t border-slate-100 my-1" />

                <button
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                        sessionStorage.removeItem("token");
                        window.location.href = "/Login";
                    }}
                >
                    <i className="bi bi-box-arrow-right text-sm" />
                    <span>Logout</span>
                </button>
            </div>
        )}
    </div>
</div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-white border-b border-slate-200 p-4 shadow-xl space-y-1 z-40">
          <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Research Services
          </p>

          {[
            { href: "/Research/Data", icon: "bi-pie-chart", label: "Research Data" },
            { href: "/Research/Reports", icon: "bi-newspaper", label: "Research Reports" },
            { href: "/Research/Correlations", icon: "bi-reception-3", label: "Data Correlation" },
            { href: "/Research/AI-Insights", icon: "bi-robot", label: "AI Insights" },
            { href: "/services/support", icon: "bi-headset", label: "Support" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              <i className={`bi ${item.icon} text-base text-slate-500`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}