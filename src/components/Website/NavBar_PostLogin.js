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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 transition-all">
      
      {/* Mobile Hamburger Toggle Button */}
      <button
        className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
        onClick={toggleNav}
        aria-label="Toggle navigation menu"
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-list"} text-xl`} />
      </button>

      {/* Global Search Bar Wrapper */}
      <div className="flex-1 max-w-xl mx-2 md:mx-0">
        <div className="md:hidden">
          <SearchBarMobile />
        </div>
        <div className="hidden md:block">
          <SearchBar />
        </div>
      </div>

      {/* Navigation & Profile Wrapper */}
      <nav className="relative flex items-center gap-3">
        {/* Profile Dropdown Button */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="User Profile"
          >
            <i className="bi bi-person-fill text-base" />
          </button>

          {/* Profile Dropdown Items */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/90 rounded-xl shadow-lg py-1.5 z-50 text-xs">
              <Link
                href="/Settings/Profile"
                className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <i className="bi bi-person-badge text-sm text-slate-500" />
                <span>Your Profile</span>
              </Link>
              <Link
                href="/Pricing"
                className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <i className="bi bi-award text-sm text-slate-500" />
                <span>Upgrade Plan</span>
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <a
                href="/Login"
                className="flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  sessionStorage.removeItem('token');
                  window.location.href = "/Login";
                }}
              >
                <i className="bi bi-box-arrow-right text-sm text-rose-500" />
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Overlay Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-white border-b border-slate-200 p-4 shadow-xl space-y-2 z-40">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
            Research Services
          </p>
          <Link
            href="/Research/Reports"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-newspaper text-base text-slate-500" />
            <span>Reports</span>
          </Link>
          <Link
            href="/Research/Data"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-pie-chart text-base text-slate-500" />
            <span>Data</span>
          </Link>
          <Link
            href="/Research/Correlations"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-reception-3 text-base text-slate-500" />
            <span>Correlations</span>
          </Link>
          <Link
            href="/Research/AI-Insights"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-robot text-base text-slate-500" />
            <span>AI Insights</span>
          </Link>
        </div>
      )}
    </header>
  );
}