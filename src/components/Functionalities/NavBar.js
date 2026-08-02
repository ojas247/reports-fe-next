'use client';

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { isSessionTokenValid, pushGTMEvent } from "../../pages/api/UtilFunctions";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Track open dropdown by ID ('services1', 'services2', 'services3', or null)
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navRef = useRef(null);

  const toggleNav = () => {
    setIsOpen(!isOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  useEffect(() => {
    setIsAuthenticated(isSessionTokenValid());

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeAllMenus();
      }
    };

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClick = (eventName) => {
    pushGTMEvent({
      eventName: "prelogin_nav_click",
      eventParams: {
        page: typeof window !== "undefined" ? window.location.pathname : "",
        btnName: eventName
      },
      userId: "anonymous_user",
      userProperties: {
        role: 'anonymous-user',
        plan: 'xxx',
        country: 'IN'
      }
    });

    closeAllMenus();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('token');
    window.location.href = "/Login";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 font-sans text-slate-900" ref={navRef}>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link href="/" onClick={closeAllMenus} className="flex items-center">
            <Image 
              className="h-8 w-auto object-contain" 
              src="/Assets/Images/Logo-Trans.svg" 
              alt="MarketInsight" 
              width={180} 
              height={40} 
              priority
            />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition"
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={toggleNav}
        >
          {isOpen ? (
            <i className="bi bi-x-lg text-lg"></i>
          ) : (
            <i className="bi bi-list text-2xl"></i>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav
          id="primary-navigation"
          className="hidden md:flex items-center gap-1 font-medium text-xs"
        >
          <ul className="flex items-center gap-1">
            
            {/* Home */}
            <li>
              <Link 
                href="/" 
                onClick={closeAllMenus}
                className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                Home
              </Link>
            </li>

            {/* MarketResearch Dropdown */}
            <li className="relative">
              <button 
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                onClick={() => toggleDropdown('services1')}
                aria-expanded={activeDropdown === 'services1'}
              >
                <span>MarketResearch</span>
                <i className={`bi bi-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${activeDropdown === 'services1' ? 'rotate-180 text-slate-900' : ''}`}></i>
              </button>

              {activeDropdown === 'services1' && (
                <div className="absolute left-0 mt-2 w-52 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link 
                    onClick={() => handleClick("Research-Reports")} 
                    href="/Research/Reports" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-newspaper text-slate-800"></i>
                    <span>Reports</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-Data")} 
                    href="/Research/Data" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-pie-chart text-slate-800"></i>
                    <span>Data</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-Correlations")} 
                    href="/Research/Correlations" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-reception-3 text-slate-800"></i>
                    <span>Correlations</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-AIInsights")} 
                    href="/Research/AI-Insights" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-claude text-slate-800"></i>
                    <span>AI Insights</span>
                  </Link>
                </div>
              )}
            </li>

            {/* Resources Dropdown */}
            <li className="relative">
              <button 
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                onClick={() => toggleDropdown('services2')}
                aria-expanded={activeDropdown === 'services2'}
              >
                <span>Resources</span>
                <i className={`bi bi-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${activeDropdown === 'services2' ? 'rotate-180 text-slate-900' : ''}`}></i>
              </button>

              {activeDropdown === 'services2' && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link 
                    onClick={() => handleClick("Resources-DataSets")} 
                    href="/DataSets" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-clipboard-data text-slate-800"></i>
                    <span>DataSets</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Resources-Insights")} 
                    href="/Insights" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                  >
                    <i className="bi bi-layout-text-sidebar text-slate-800"></i>
                    <span>Insights</span>
                  </Link>
                </div>
              )}
            </li>

            {/* Pricing */}
            <li>
              <Link 
                onClick={() => handleClick("Clicked_NavBar-Pricing")} 
                href="/Pricing"
                className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                Pricing
              </Link>
            </li>
          </ul>

          {/* User Auth Section */}
          <div className="pl-4 ml-2 border-l border-slate-200 flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link 
                  onClick={() => handleClick("Clicked_NavBar-Login")} 
                  href="/Login"
                  className="px-3 py-1.5 text-slate-700 hover:text-slate-900 font-medium transition"
                >
                  Login
                </Link>
                <Link 
                  onClick={() => handleClick("Clicked_NavBar-Signup")} 
                  href="/Register"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition shadow-2xs"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  className="flex items-center p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  onClick={() => toggleDropdown('services3')}
                  aria-label="User profile options"
                  aria-expanded={activeDropdown === 'services3'}
                >
                  <i className="bi bi-person-circle text-lg"></i>
                </button>

                {activeDropdown === 'services3' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link 
                      href="/Settings/Profile" 
                      onClick={closeAllMenus} 
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                    >
                      <i className="bi bi-person-badge text-slate-800"></i>
                      <span>Your Profile</span>
                    </Link>
                    <Link 
                      href="/Pricing" 
                      onClick={closeAllMenus} 
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100/80 rounded-lg transition"
                    >
                      <i className="bi bi-award text-slate-800"></i>
                      <span>Upgrade</span>
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <Link 
                      href="/Login" 
                      onClick={handleLogout} 
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-medium"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 font-medium text-sm max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/" 
                onClick={closeAllMenus}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                Home
              </Link>
            </li>

            {/* Mobile MarketResearch */}
            <li>
              <button 
                onClick={() => toggleDropdown('services1')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                <span>MarketResearch</span>
                <i className={`bi bi-chevron-down text-xs text-slate-400 transition-transform ${activeDropdown === 'services1' ? 'rotate-180' : ''}`}></i>
              </button>

              {activeDropdown === 'services1' && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/80 rounded-lg my-1">
                  <Link 
                    onClick={() => handleClick("Research-Reports")} 
                    href="/Research/Reports" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-newspaper"></i>
                    <span>Reports</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-Data")} 
                    href="/Research/Data" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-pie-chart"></i>
                    <span>Data</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-Correlations")} 
                    href="/Research/Correlations" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-reception-3"></i>
                    <span>Correlations</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Research-AIInsights")} 
                    href="/Research/AI-Insights" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-claude"></i>
                    <span>AI Insights</span>
                  </Link>
                </div>
              )}
            </li>

            {/* Mobile Resources */}
            <li>
              <button 
                onClick={() => toggleDropdown('services2')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                <span>Resources</span>
                <i className={`bi bi-chevron-down text-xs text-slate-400 transition-transform ${activeDropdown === 'services2' ? 'rotate-180' : ''}`}></i>
              </button>

              {activeDropdown === 'services2' && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/80 rounded-lg my-1">
                  <Link 
                    onClick={() => handleClick("Resources-DataSets")} 
                    href="/DataSets" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-clipboard-data"></i>
                    <span>DataSets</span>
                  </Link>
                  <Link 
                    onClick={() => handleClick("Resources-Insights")} 
                    href="/Insights" 
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    <i className="bi bi-layout-text-sidebar"></i>
                    <span>Insights</span>
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link 
                onClick={() => handleClick("Clicked_NavBar-Pricing")} 
                href="/Pricing"
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              >
                Pricing
              </Link>
            </li>
          </ul>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link 
                  onClick={() => handleClick("Clicked_NavBar-Login")} 
                  href="/Login"
                  className="w-full text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  onClick={() => handleClick("Clicked_NavBar-Signup")} 
                  href="/Register"
                  className="w-full text-center py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg transition shadow-2xs"
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="space-y-1">
                <Link 
                  href="/Settings/Profile" 
                  onClick={closeAllMenus} 
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <i className="bi bi-person-badge"></i>
                  <span>Your Profile</span>
                </Link>
                <Link 
                  href="/Pricing" 
                  onClick={closeAllMenus} 
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <i className="bi bi-award"></i>
                  <span>Upgrade</span>
                </Link>
                <Link 
                  href="/Login" 
                  onClick={handleLogout} 
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}