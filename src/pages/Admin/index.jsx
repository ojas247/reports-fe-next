'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Imported Pages
import CrawlerBoard from './CrawlerBoard/Data';
import RepubData_v1 from './Edit_v1/RepubData_v1';
import Data_v1 from './Publishing/Data_v1';
import SectorHierarchyManager from './Publishing/SectorHierarchyManager';
import CompanyPublishing from './Publishing/CompanyPublishing';
import PublishStagingData from './Publishing/StagingData';
import Authors from './Authors/Authors';
export default function AdminLayout() {
  // 'dashboard' is the home view; selecting a page switches the workspace directly
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Operations List Configuration
  const coreOperations = [
    {
      id: 'crawler',
      title: 'Data Site Crawler',
      description: 'Monitor, manage, and inspect real-time web crawlers and incoming data pipelines.',
      icon: 'bi-robot',
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'crawler_submission',
      title: 'Crawler Site Submission',
      description: 'Submit new target domain URLs and configured endpoints for automatic scraping.',
      icon: 'bi-plus-circle-dotted',
      badge: 'New',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'republish',
      title: 'Re-Publishing Studio',
      description: 'Edit, review, and handle multi-channel dataset republishing workflows.',
      icon: 'bi-journal-arrow-up',
      badge: 'v1.0',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      id: 'publish_staging',
      title: 'Publish Staging Data',
      description: 'Inspect, edit staging metrics, and publish staging datasets directly to production.',
      icon: 'bi-database-gear',
      badge: 'Staging',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'publishing',
      title: 'Publishing Data',
      description: 'Upload files, assign metadata, and directly publish structured market datasets.',
      icon: 'bi-cloud-upload',
    },
    {
      id: 'sector_hierarchy',
      title: 'Sector Hierarchy',
      description: 'Configure and update system taxonomy, sector trees, and sub-category nodes.',
      icon: 'bi-diagram-3',
    },
    {
      id: 'authors',
      title: 'Tag & Author Addition',
      description: 'Manage global taxonomy tags, author profiles, and content metadata references.',
      icon: 'bi-tags',
      badge: 'New',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
  id: 'company_publishing',
  title: 'Company Publishing',
  description:
    'Create and publish company intelligence mappings including raw materials, output products, and market indicators.',
  icon: 'bi-building-up',
  badge: 'New',
  badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
},
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-900 selection:text-white">
      
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
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

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-600">
              API v2.4 <span className="hidden sm:inline">Online</span>
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <i className="bi bi-box-arrow-left text-sm text-slate-500"></i>
            <span className="hidden sm:inline">Exit</span>
          </Link>

          <div className="flex items-center pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs select-none">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
          
          {/* Back Button Navigation Header (Only visible when inside a page) */}
          {activeTab !== 'dashboard' && (
            <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              >
                <i className="bi bi-arrow-left text-sm"></i>
                <span>Back to Dashboard</span>
              </button>

              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Module: {activeTab.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {/* VIEW 1: Dashboard Home Grid */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Header */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Core Operations</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Select an administrative engine module below to manage platform data and workflows.
                </p>
              </div>

              {/* Grid Layout of Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {coreOperations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setActiveTab(op.id)}
                    className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-left cursor-pointer overflow-hidden"
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <i className={`bi ${op.icon} text-xl`}></i>
                        </div>
                        {op.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${op.badgeColor}`}>
                            {op.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">
                        {op.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {op.description}
                      </p>
                    </div>

                    {/* Bottom Link CTA */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-slate-900">
                      <span>Open Engine</span>
                      <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: Active Dynamic Pages */}
          {activeTab === 'crawler' && <CrawlerBoard />}

          {activeTab === 'crawler_submission' && (
            <PlaceholderView 
              title="Crawler Site Submission" 
              icon="bi-plus-circle-dotted" 
              subtitle="Submit domain URLs, API payloads, and configure crawler job frequencies."
            />
          )}

          {activeTab === 'republish' && <RepubData_v1 />}

          {activeTab === 'publish_staging' && <PublishStagingData />}

          {activeTab === 'publishing' && <Data_v1 />}
          {activeTab === 'company_publishing' && <CompanyPublishing />}

          {activeTab === 'sector_hierarchy' && <SectorHierarchyManager />}

         {activeTab === 'authors' && <Authors />}

        </div>
      </main>

    </div>
  );
}

// Sub-page Placeholder Component for upcoming APIs
function PlaceholderView({ title, icon, subtitle }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="border border-dashed border-slate-300 rounded-2xl p-10 sm:p-16 text-center bg-white/70 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-600">
          <i className={`bi ${icon} text-2xl`}></i>
        </div>
        <p className="text-sm font-semibold text-slate-800">API Integration Ready</p>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
          The placeholder for <span className="font-semibold text-slate-600">{title}</span> is set up. You can now pass your API endpoint details here to connect the backend functions.
        </p>
      </div>
    </div>
  );
}