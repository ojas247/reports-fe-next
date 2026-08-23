'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import CrawlerBoard from './CrawlerBoard/Data';
import RepubData_v1 from './Edit_v1/RepubData_v1';
import Data_v1 from './Publishing/Data_v1';
import SectorHierarchyManager from './Publishing/SectorHierarchyManager';
import CompanyPublishing from './Publishing/CompanyPublishing';
import PublishStagingData from './Publishing/StagingData';
import Authors from './Authors/Authors';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navConfig = [
  {
    category: 'Crawler',
    icon: 'bi-search',
    items: [
      {
        id: 'crawler',
        title: 'Data Site Crawler',
        description: 'Monitor active crawl jobs and launch new site crawls.',
        meta: '14 running',
        icon: 'bi-robot',
      },
      {
        id: 'crawler_submission',
        title: 'Crawler Site Submission',
        description: 'Submit new sites and review the submission queue.',
        meta: '3 pending',
        icon: 'bi-plus-circle-dotted',
      },
    ],
  },
  {
    category: 'Publishing',
    icon: 'bi-cloud-upload',
    items: [
      {
        id: 'publishing',
        title: 'Publishing Data',
        description: 'Push validated datasets from staging to live.',
        meta: '2 ready',
        icon: 'bi-cloud-upload',
      },
      {
        id: 'company_publishing',
        title: 'Company Publishing',
        description: 'Control which company profiles are public.',
        meta: '1,204 live',
        icon: 'bi-building-up',
      },
      {
        id: 'publish_staging',
        title: 'Publish Staging Data',
        description: 'Give final review to changes before they go live.',
        meta: '2 in review',
        icon: 'bi-database-check',
      },
    ],
  },
  {
    category: 'Re-Publishing',
    icon: 'bi-arrow-repeat',
    items: [
      {
        id: 'republish',
        title: 'Re-Publishing Studio',
        description: 'Edit a live item and push corrections directly.',
        meta: '4 editable',
        icon: 'bi-pencil-square',
      },
    ],
  },
  {
    category: 'Linkages',
    icon: 'bi-link-45deg',
    items: [
      {
        id: 'authors',
        title: 'Tags & Linkages',
        description: 'Manage the tag vocabulary across records.',
        meta: '128 tags',
        icon: 'bi-tags',
      },
      {
        id: 'sector_hierarchy',
        title: 'Sector Hierarchy',
        description: 'Maintain the sector tree used for classification.',
        meta: '3 roots',
        icon: 'bi-diagram-3',
      },
    ],
  },
];

 const renderDashboard = () => (
  <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px w-full">

      {navConfig.map((category, idx) => (
        <section
          key={idx}
          className="
            flex
            min-w-0
            flex-col
            bg-white
            min-h-[300px]
            sm:min-h-[360px]
            lg:min-h-[calc(100vh-86px)]
          "
        >

          {/* Category Header */}
          <div
            className="
              shrink-0
              px-4
              py-4
              sm:px-5
              sm:py-5
            "
          >
            <div className="flex min-w-0 items-center gap-2.5">

              <span className="shrink-0 text-base sm:text-lg text-gray-700">
                <i className={`bi ${category.icon}`}></i>
              </span>

              <h2
                className="
                  min-w-0
                  truncate
                  text-base
                  sm:text-lg
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                {category.category}
              </h2>

            </div>
          </div>

          {/* Cards */}
          <div
            className="
              flex-1
              min-w-0
              px-2.5
              pb-3
              sm:px-3
              sm:pb-4
              space-y-2.5
            "
          >

            {category.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className="
                  group
                  block
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-3.5
                  sm:p-4
                  text-left
                  transition-all
                  duration-150
                  hover:-translate-y-0.5
                  hover:border-gray-900
                  hover:shadow-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-900/20
                  cursor-pointer
                "
              >

                {/* Card Content */}
                <div className="min-w-0">

                  {/* Icon + Title */}
                  <div className="flex min-w-0 items-start gap-2.5">

                <span
  className="
    mt-0.5
    shrink-0
    text-base
    text-gray-700
  "
>
  <i className={`bi ${item.icon}`}></i>
</span>

                    <h3
                      className="
                        min-w-0
                        flex-1
                        text-sm
                        sm:text-[15px]
                        font-semibold
                        leading-snug
                        text-slate-900
                        break-words
                      "
                    >
                      {item.title}
                    </h3>

                  </div>

                  {/* Description */}
                  <p
                    className="
                      mt-1.5
                      pl-[26px]
                      text-[11px]
                      sm:text-xs
                      leading-relaxed
                      text-slate-500
                      break-words
                    "
                  >
                    {item.description}
                  </p>

                  {/* Bottom Meta */}
                  <div
                    className="
                      mt-3
                      flex
                      min-w-0
                      items-center
                      justify-between
                      gap-2
                      border-t
                      border-slate-200
                      pt-2
                    "
                  >

                    <span
                      className="
                        min-w-0
                        truncate
                        text-[10px]
                        sm:text-[10.5px]
                        font-mono
                        text-slate-400
                      "
                    >
                      {item.meta}
                    </span>

                    <span
                      className="
                        shrink-0
                        text-sm
                        text-gary-700
                        transition-transform
                        duration-150
                        group-hover:translate-x-0.5
                      "
                    >
                      <i className="bi bi-arrow-right"></i>
                    </span>

                  </div>

                </div>
              </button>
            ))}

          </div>
        </section>
      ))}

    </div>
  </div>
);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'crawler':
        return <CrawlerBoard />;

      case 'crawler_submission':
        return (
          <PlaceholderView
            title="Crawler Site Submission"
            icon="bi-plus-circle-dotted"
            subtitle="Submit domain URLs, API payloads, and configure crawler job frequencies."
          />
        );

      case 'republish':
        return <RepubData_v1 />;

      case 'publish_staging':
        return <PublishStagingData />;

      case 'publishing':
        return <Data_v1 />;

      case 'company_publishing':
        return <CompanyPublishing />;

      case 'sector_hierarchy':
        return <SectorHierarchyManager />;

      case 'authors':
        return <Authors />;

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 backdrop-blur-md sm:px-5 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              className="h-6 w-auto object-contain sm:h-7"
              src="/Assets/Images/Logo-Trans.svg"
              alt="MarketInsight"
              width={140}
              height={30}
              priority
            />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50 px-2 py-1 sm:gap-2 sm:px-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="whitespace-nowrap font-mono text-[9px] font-medium text-slate-600 sm:text-[11px]">
              API v2.4
              <span className="hidden sm:inline"> Online</span>
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:px-2.5"
          >
            <i className="bi bi-box-arrow-left text-sm text-slate-500" />
            <span className="hidden sm:inline">Exit</span>
          </Link>

          <div className="flex items-center border-l border-slate-200 pl-2">
            <div className="flex h-8 w-8 select-none items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white shadow-sm">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 xl:px-10">
          {activeTab !== 'dashboard' && (
            <div className="mb-4 flex min-w-0 flex-col items-stretch gap-3 border-b border-slate-200/80 pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 sm:w-auto sm:justify-start"
              >
                <i className="bi bi-arrow-left text-sm" />
                <span>Back to Dashboard</span>
              </button>

              <span
                className="min-w-0 max-w-full truncate text-center font-mono text-[10px] uppercase tracking-wider text-slate-400 sm:text-right"
                title={`Module: ${activeTab.replace(/_/g, ' ')}`}
              >
                Module: {activeTab.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          <div className="w-full min-w-0">{renderActivePage()}</div>
        </div>
      </main>
    </div>
  );
}

function PlaceholderView({ title, icon, subtitle }) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h1>

        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm sm:p-12 lg:p-16">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <i className={`bi ${icon} text-2xl`} />
        </div>

        <p className="text-sm font-semibold text-slate-800">
          API Integration Ready
        </p>

        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-400">
          The placeholder for{' '}
          <span className="font-semibold text-slate-600">{title}</span> is
          set up. You can now pass your API endpoint details here to connect
          the backend functions.
        </p>
      </div>
    </div>
  );
}