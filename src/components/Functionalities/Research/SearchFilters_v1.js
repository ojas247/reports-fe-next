'use client'

import React, { useState, useEffect, useRef } from 'react';
import SingleDropDown_v1 from "../../UtilityComponents/SingleDropdown_v1";
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../../pages/api/Api';
import FactsLoader from '@/components/UtilityComponents/Tools/FactsLoader';

const SearchFilters_v1 = (props) => {
  const [loading, setLoading] = useState(true);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [Tagdata, setTagdata] = useState([]);

  // State for tracking selected values
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [resetSector, setResetSector] = useState(false);

  const [filtersState, setFiltersState] = useState({
    author: null,
    year: null,
    tags: null,
    sector_filters: null,
  });

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const OptionsSub1actualData = await fetchSetorSubOptions();
        setSecSubdata(OptionsSub1actualData);

        const OptionsAuthorData = await fetchAuthors();
        setAuthordata(OptionsAuthorData);

        const OptionsYearData = { options_list: [2024, 2023, 2022, 2021, 2020, 2018] };
        setYeardata(OptionsYearData);

        const OptionsTagData = await fetchTags();
        setTagdata(OptionsTagData);
      } catch (error) {
        console.error('Failed to load filter metadata:', error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const updateFilterField = (field, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update selected values for dropdowns
    if (field === 'author') setSelectedAuthor(value);
    if (field === 'year') setSelectedYear(value);
    if (field === 'tags') setSelectedTag(value);
    if (field === 'sector_filters') setSelectedSector(value);
  };

  const handleFilters = () => {
    // Send filters to parent
    props.onDataSend(filtersState);
  };

  const handleReset = () => {
    const emptyFilters = {
      author: null,
      year: null,
      tags: null,
      sector_filters: null,
    };
    
    // Reset all states
    setFiltersState(emptyFilters);
    setSelectedAuthor(null);
    setSelectedYear(null);
    setSelectedTag(null);
    setSelectedSector(null);
    
    // Trigger reset for SectorHierarchyDropDown
    setResetSector(true);
    setTimeout(() => setResetSector(false), 100);
    
    // Send empty filters to parent
    props.onDataSend(emptyFilters);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <FactsLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Sector Hierarchy Panel */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
        <SectorHierarchyDropDown
          reset={resetSector}
          onSelect={(val) => updateFilterField('sector_filters', val)}
        />
      </div>

      {/* Dataset Filter Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-4 sm:space-y-5">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600">
          Dataset Category
        </h3>

        <div className="space-y-4 sm:space-y-5">
          {/* Author Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Select Author
            </label>
            <SingleDropDown_v1
              options={Authordata}
              placeholder="Select Author"
              value={selectedAuthor}
              onSelect={(val) => updateFilterField('author', val)}
            />
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Year
            </label>
            <SingleDropDown_v1
              options={Yeardata}
              placeholder="Select Year"
              value={selectedYear}
              onSelect={(val) => updateFilterField('year', val)}
            />
          </div>

          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Tag
            </label>
            <SingleDropDown_v1
              options={Tagdata}
              placeholder="Select Tag"
              value={selectedTag}
              onSelect={(val) => updateFilterField('tags', val)}
            />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 sm:py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-150 order-2 sm:order-1"
        >
          <i className="bi bi-arrow-counterclockwise mr-1.5"></i>
          Clear Filters
        </button>

        <button
          type="button"
          onClick={handleFilters}
          className="px-6 sm:px-8 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] shadow-sm transition-all duration-150 order-1 sm:order-2 flex items-center justify-center gap-2"
        >
          <i className="bi bi-search text-xs"></i>
          Go
        </button>
      </div>
    </div>
  );
};

export default SearchFilters_v1;