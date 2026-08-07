'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReportResultsComp from '../../components/Functionalities/ReportResultsComp';
import SearchFilters from '../../components/Functionalities/SearchFilters';
import FilterTags from '../../components/UtilityComponents/FilterTags';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '../../styles/Pages/reports.module.css';

export default function Reports() {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isToggled, setIsToggled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = isSessionTokenValid();
    setIsAuthenticated(auth);

    if (!auth) {
      alert('Please login to access product-based services.');
      router.push('/Login');
    }
  }, [router]);

  const getAppliedFiltersFromChild = (filters) => {
    console.log('Received filters from SearchFilters:', filters);
    setAppliedFilters({ ...filters });
  };

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
  };

  return (
    <DashboardLayout>
      <div className={`${styles.resultBodyContainer || ''} w-full min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6`}>
        {/* Search & Filter Header Bar */}
        <div className={`${styles.searchRow || ''} w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm`}>
          <div className={`${styles.searchToggle || ''} flex items-center gap-2`}>
            <button
              type="button"
              onClick={handleToggle}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle Filters"
            >
              <i className={`bi ${isToggled ? 'bi-x-lg' : 'bi-funnel'} text-lg`}></i>
            </button>
          </div>
          
          <div className="w-full">
            <SearchFilters onDataSend={getAppliedFiltersFromChild} />
          </div>
        </div>

        {/* Filter Tags Bar */}
        <div className={`${styles.filterTags || ''} w-full`}>
          <FilterTags applied_filters={appliedFilters} />
        </div>

        {/* Results Body */}
        <div className={`${styles.resultContainer || ''} w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6`}>
          <ReportResultsComp researchType="Reports" result={appliedFilters} />
        </div>
      </div>
    </DashboardLayout>
  );
}