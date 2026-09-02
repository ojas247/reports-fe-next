import React, { useState } from 'react';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import ReportResultsComp from "../../components/Functionalities/ReportResultsComp";
import SearchFilters_v1 from '../../components/Functionalities/Research/SearchFilters_v1';

export default function Data() {
  const [appliedFilters, setAppliedFilters] = useState({});

  const getAppliedFiltersFromChild = (filters) => {
    setAppliedFilters({ ...filters });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <section className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-5 sm:p-6">
          <div className="mb-6 sm:flex sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Research Data</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Filter and explore high-frequency research datasets with a responsive and professional layout.
              </p>
            </div>
          </div>
          <SearchFilters_v1 onDataSend={getAppliedFiltersFromChild} />
        </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-5 sm:p-6">
          <ReportResultsComp researchType="Data" result={appliedFilters} />
        </section>

      </main>
      <Footer />
    </div>
  );
}