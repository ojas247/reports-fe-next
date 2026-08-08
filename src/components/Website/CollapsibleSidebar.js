'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

const sampleServices = [
  { id: 1, name: "Research Data", icon: "bi-pie-chart", href: "/Research/Data" },
  { id: 2, name: "Research Reports", icon: "bi-newspaper", href: "/Research/Reports" },
  { id: 3, name: "Data Correlation", icon: "bi-reception-3", href: "/Research/Correlations" },
  { id: 4, name: "AI Insights", icon: "bi-robot", href: "/Research/AI-Insights" },
  { id: 5, name: "Support", icon: "bi-headset", href: "/services/support" },
];

export default function CollapsibleSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* ========== HEADER ========== */}
      <div className="h-14 border-b border-slate-100 flex items-center shrink-0 px-3">
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center">
            <div className="w-9 h-9 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <Image
                src="/favicon.ico"
                alt="MarketInsight"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="MarketInsight"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-slate-900 whitespace-nowrap">
                MarketInsight
              </span>
            </Link>

            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Collapse sidebar"
            >
        <i className="bi bi-list text-base" />
            </button>
          </div>
        )}
      </div>

      {/* ========== NAVIGATION ========== */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 relative">
        {/* Invisible click overlay when collapsed - clicking anywhere expands */}
        {isCollapsed && (
          <div
            onClick={toggleCollapse}
            className="absolute inset-0 z-10 cursor-pointer"
            title="Click to expand sidebar"
          />
        )}

        {!isCollapsed && (
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Services
          </p>
        )}

        <ul className="space-y-1">
          {sampleServices.map((service) => {
            const isActive =
              pathname === service.href || pathname?.startsWith(service.href + "/");

            return (
              <li key={service.id}>
                <Link
                  href={service.href}
                  onClick={(e) => {
                    // Prevent navigation when collapsed (just expand instead)
                    if (isCollapsed) {
                      e.preventDefault();
                      toggleCollapse();
                    }
                  }}
                  className={`
                    flex items-center rounded-xl text-[13px] font-medium transition-all duration-150
                    ${isCollapsed 
                      ? "justify-center w-11 h-11 mx-auto" 
                      : "gap-3 px-3 py-2.5"
                    }
                    ${
                      isActive
                        ? "bg-[#1e3a5f] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }
                  `}
                  title={isCollapsed ? service.name : undefined}
                >
                  <i
                    className={`bi ${service.icon} text-[16px] shrink-0 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{service.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ========== FOOTER ========== */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400">© 2026 MarketInsight</span>
        </div>
      )}
    </aside>
  );
}