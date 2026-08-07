'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    console.log('Received filters from SearchFilters:', filters);
    setAppliedFilters({ ...filters });
  };

  // Proper loader – same style as CrawlerBoard
  if (loading || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">
            AUTHENTICATING...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        
        {/* Page Header */}
        <div className="border-b border-slate-200/80 pb-4">
          <h1 className="text-sm font-semibold tracking-tight text-slate-900">
            Research Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search and filter high-frequency datasets across sectors.
          </p>
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
    </DashboardLayout>
  );
}