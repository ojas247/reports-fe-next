'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CrawlerBoard from './CrawlerBoard/Data';
import RepubData_v1 from './Edit_v1/RepubData_v1';
import Data_v1 from './Publishing/Data_v1';
import SectorHierarchyManager from './Publishing/SectorHierarchyManager';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('crawler'); 
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


  const navItems = [
    {
      group: 'Core Operations',
      items: [
        {
          id: 'crawler',
          label: 'Data Site Crawler',
          icon: 'bi-robot',
          badge: 'Live',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        },
        {
          id: 'republish',
          label: 'Re-Publishing Studio',
          icon: 'bi-journal-arrow-up',
          badge: 'v1.0',
          badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
        },
        {
          id: 'publishing',
          label: 'Publishing Data',
          icon: 'bi-cloud-upload',
        },
        {
          id: 'sector_hierarchy',
          label: 'Sector Hierarchy',
          icon: 'bi-diagram-3',
        },
      ],
    },
    {
      group: 'Configuration',
      items: [
        {
          id: 'settings',
          label: 'System Settings',
          icon: 'bi-gear',
        },
      ],
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false); 
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-900 selection:text-white">
      

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 flex items-center justify-between px-3 sm:px-6 shrink-0 transition-all">
        <div className="flex items-center gap-2 sm:gap-3">
          
        
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Mobile Navigation Menu"
          >
            <i className={`bi ${isMobileSidebarOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
          </button>

        
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`bi ${isSidebarCollapsed ? 'bi-sidebar-resp' : 'bi-sidebar'} text-sm`}></i>
          </button>

        
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              className="h-6 sm:h-7 w-auto object-contain"
              src="/Assets/Images/Logo-Trans.svg"
              alt="MarketInsight"
              width={140}
              height={30}
              priority
            />
           
          </Link>
        </div>

      
        <div className="flex items-center gap-2 sm:gap-4">
          
    
          <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-600">
              API v2.4 <span className="hidden sm:inline">Online</span>
            </span>
          </div>

        
          <div className="flex items-center pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs select-none">
              AD
            </div>
          </div>
        </div>
      </header>

  
      <div className="flex flex-1 relative overflow-hidden">
        
   
        <aside
          className={`fixed md:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
            isMobileSidebarOpen 
              ? 'translate-x-0 w-64 shadow-2xl md:shadow-none' 
              : '-translate-x-full md:translate-x-0'
          } ${
            isSidebarCollapsed ? 'md:w-16' : 'md:w-60'
          } shrink-0`}
        >
          {/* Top Mobile Close Bar */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-100">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <i className="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="p-3 space-y-5 overflow-y-auto flex-1">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1">
                
                {/* Section Group Header */}
                {!isSidebarCollapsed && (
                  <p className="px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5 select-none">
                    {group.group}
                  </p>
                )}

                {/* Navigation Links */}
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      title={isSidebarCollapsed ? item.label : ''}
                      className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <i className={`bi ${item.icon} text-base md:text-sm ${isActive ? 'text-white' : 'text-slate-500'}`}></i>
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border leading-none ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Link */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                isSidebarCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <i className="bi bi-box-arrow-left text-sm text-slate-500"></i>
              {!isSidebarCollapsed && <span className="font-medium">Exit Admin Portal</span>}
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] min-w-0">
          <div className="w-full h-full p-3 sm:p-6 lg:p-8">
            
            {/* Page View Switches */}
            {activeTab === 'crawler' && <CrawlerBoard />}

            {activeTab === 'republish' && <RepubData_v1 />}

            {activeTab === 'publishing' && <Data_v1 />}

            {activeTab === 'sector_hierarchy' && <SectorHierarchyManager />}

            {activeTab === 'settings' && <PlaceholderView title="System Settings" icon="bi-gear" />}

          </div>
        </main>
      </div>

    </div>
  );
}

// Sub-page Placeholder Fallback Component
function PlaceholderView({ title, icon }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">System module configuration and management view.</p>
        </div>
      </div>

      <div className="border border-dashed border-slate-300 rounded-xl p-8 sm:p-12 text-center bg-white/70 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
          <i className={`bi ${icon} text-xl`}></i>
        </div>
        <p className="text-xs font-semibold text-slate-800">Module Under Active Development</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
          The {title} dashboard section is currently being integrated. Check back shortly for updates.
        </p>
      </div>
    </div>
  );
}