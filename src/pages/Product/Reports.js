import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SearchFilters from '../../components/Functionalities/SearchFilters';
import ReportResultsComp from '../../components/Functionalities/ReportResultsComp';
import { isSessionTokenValid } from '../api/UtilFunctions';
import { useRouter } from 'next/navigation';

export default function Reports() {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    const auth = isSessionTokenValid();
    if (!auth) {
      alert('Please login to access product-based services.');
      router.push('/Login');
    }
  }, [router]);

  const getAppliedFiltersFromChild = (filters) => {
    setAppliedFilters({ ...filters });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
          <div className="mb-6 sm:flex sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Research Reports</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Browse report results in a clean responsive page with consistent Research theme styling.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <SearchFilters onDataSend={getAppliedFiltersFromChild} />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
          <ReportResultsComp researchType="Reports" result={appliedFilters} />
        </section>
      </div>
    </DashboardLayout>
  );
}