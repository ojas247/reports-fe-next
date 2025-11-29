'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const sampleServices = [
  { id: 1, name: "Research Data", icon: <i className="bi bi-pie-chart text-blue-900" />, href: "/Research/Data" },
  { id: 2, name: "Research Reports", icon: <i className="bi bi-newspaper text-blue-900" />, href: "/Research/Reports" },
  { id: 3, name: "Data Correlation", icon: <i className="bi bi-reception-3 text-blue-900" />, href: "/Research/Correlations" },
  { id: 4, name: "AI Insights", icon: <i className="bi bi-robot text-blue-900" />, href: "/Research/AI-Insights" },
  { id: 5, name: "Support", icon: "🛠️", href: "/services/support" },
];

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR (Desktop ONLY) */}
      <aside
        className={`hidden md:block bg-white shadow-lg transition-all duration-300 ease-in-out 
        fixed inset-y-0 left-0 z-40 transform w-64 md:relative 
        ${isCollapsed ? "md:w-16" : "md:w-64"}
        `}
      >
        {/* LOGO */}
        <div
          className={`flex items-center justify-center p-4 border-b transition-all
            ${isCollapsed ? "px-2" : "px-4"}`}
        >
          <Link href="/">
            <Image
              src="/favicon.ico"
              alt="MarketInsight"
              width={isCollapsed ? 32 : 40}
              height={isCollapsed ? 32 : 40}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Collapse Button */}
        <div className="hidden md:flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">Services</h2>}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isCollapsed ? <i className="bi bi-list" /> : <i className="bi bi-x" />}
          </button>
        </div>

        {/* Menu List */}
        <nav className="p-2 overflow-y-auto h-[calc(100vh-120px)]">
          <ul className="space-y-2">
            {sampleServices.map((service) => (
              <li key={service.id}>
                <a
                  href={service.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 transition group
                    ${isCollapsed ? "justify-center" : "justify-start"}`}
                >
                  <span className="text-2xl mr-3">{service.icon}</span>

                  {!isCollapsed && (
                    <span className="text-gray-700 font-medium whitespace-nowrap">
                      {service.name}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>


    </div>
  );
}
