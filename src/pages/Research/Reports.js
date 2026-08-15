'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportResultsComp from '../../components/Functionalities/ReportResultsComp';
import SearchFilters from '../../components/Functionalities/SearchFilters';
import FilterTags from '../../components/UtilityComponents/FilterTags';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Reports() {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isToggled, setIsToggled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
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
                  Research Reports
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Search and filter research reports across sectors.
                </p>
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs">
              <SearchFilters onDataSend={getAppliedFiltersFromChild} />
            </div>

            {/* Filter Tags */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs">
              <FilterTags applied_filters={appliedFilters} />
            </div>

            {/* Results Container */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs min-h-[420px]">
              <ReportResultsComp researchType="Reports" result={appliedFilters} />
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}