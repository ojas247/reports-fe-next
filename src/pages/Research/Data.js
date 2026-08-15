'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportResultsComp from '../../components/Functionalities/ReportResultsComp';
import SearchFilters_v1 from '../../components/Functionalities/Research/SearchFilters_v1';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Data() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = isSessionTokenValid();
    setIsAuthenticated(auth);

    if (!auth) {
      alert('Please login to access product-based services.');
      router.push('/Login');
      return;
    }
    setLoading(false);
  }, [router]);

  const getAppliedFiltersFromChild = (filters) => {
    const cleanFilters = {};

    if (
      filters?.sector_filters &&
      Object.keys(filters.sector_filters).length > 0
    ) {
      cleanFilters.sector_filters = filters.sector_filters;
    }

    if (filters?.author) {
      if (typeof filters.author === "object" && filters.author.value) {
        cleanFilters.author = {
          value: filters.author.value,
          label: filters.author.label || filters.author.value,
        };
      } else if (typeof filters.author === "string" && filters.author.trim()) {
        cleanFilters.author = {
          value: filters.author,
          label: filters.author,
        };
      }
    }

    if (
      filters?.year !== null &&
      filters?.year !== undefined &&
      filters?.year !== ""
    ) {
      cleanFilters.year =
        typeof filters.year === "object"
          ? filters.year.value
          : filters.year;
    }

    if (filters?.tags) {
      if (Array.isArray(filters.tags) && filters.tags.length > 0) {
        cleanFilters.tags = filters.tags;
      } else if (
        typeof filters.tags === "object" &&
        filters.tags.value
      ) {
        cleanFilters.tags = filters.tags;
      } else if (
        typeof filters.tags === "string" &&
        filters.tags.trim()
      ) {
        cleanFilters.tags = filters.tags;
      }
    }

    console.log("API FILTERS:", cleanFilters);

    setAppliedFilters(cleanFilters);
  };

  if (loading || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">
              AUTHENTICATING...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Research Data
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Search and filter high-frequency datasets across sectors.
                </p>
              </div>
            </div>

            {/* Search & Filters Section */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs">
              <SearchFilters_v1 onDataSend={getAppliedFiltersFromChild} />
            </div>

            {/* Results Container */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs min-h-[420px]">
              <ReportResultsComp researchType="Data" result={appliedFilters} />
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}