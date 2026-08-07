'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const sampleServices = [
  { id: 1, name: "Research Data", icon: "bi-pie-chart", href: "/Research/Data" },
  { id: 2, name: "Research Reports", icon: "bi-newspaper", href: "/Research/Reports" },
  { id: 3, name: "Data Correlation", icon: "bi-reception-3", href: "/Research/Correlations" },
  { id: 4, name: "AI Insights", icon: "bi-robot", href: "/Research/AI-Insights" },
  { id: 5, name: "Support", icon: "bi-headset", href: "/services/support" },
];

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen transition-all duration-300 ease-in-out shrink-0 z-30 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Header Logo */}
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-3.5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <Image
            src="/favicon.ico"
            alt="MarketInsight"
            width={28}
            height={28}
            className="shrink-0"
          />
          {!isCollapsed && (
            <span className="font-bold text-sm tracking-tight text-slate-900 whitespace-nowrap">
              MarketInsight
            </span>
          )}
        </Link>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i className={`bi ${isCollapsed ? "bi-layout-sidebar-inset" : "bi-layout-sidebar"} text-sm`} />
        </button>
      </div>

      {/* Services Navigation List */}
      <nav className="p-2 space-y-1 overflow-y-auto flex-1">
        {!isCollapsed && (
          <p className="px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Services
          </p>
        )}

        <ul className="space-y-1">
          {sampleServices.map((service) => (
            <li key={service.id}>
              <a
                href={service.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all ${
                  isCollapsed ? "justify-center px-0" : ""
                }`}
                title={isCollapsed ? service.name : ""}
              >
                <i className={`bi ${service.icon} text-base text-slate-500 shrink-0`} />
                {!isCollapsed && (
                  <span className="truncate">{service.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}