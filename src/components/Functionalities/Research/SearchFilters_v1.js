'use client'

import React, { useState, useEffect } from 'react';
import SingleDropDown from "../../UtilityComponents/SingleDropdown";
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../../pages/api/Api';
import FactsLoader from '@/components/UtilityComponents/Tools/FactsLoader';

const SearchFilters_v1 = (props) => {
  const [loading, setLoading] = useState(true);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [Tagdata, setTagdata] = useState([]);

  // Controlled local state for filters
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
  };

  const handleFilters = () => {
    props.onDataSend(filtersState);
  };

  const handleReset = () => {
    const emptyFilters = {
      author: null,
      year: null,
      tags: null,
      sector_filters: null,
    };
    setFiltersState(emptyFilters);
    props.onDataSend(emptyFilters);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <FactsLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Sector Hierarchy Panel */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <SectorHierarchyDropDown
          onSelect={(val) => updateFilterField('sector_filters', val)}
        />
      </div>

      {/* Dataset Filter Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-slate-800 tracking-tight">
          Dataset Category
        </label>

        <div className="space-y-4">
          {/* Author Selector */}
          <div>
            <SingleDropDown
              options={Authordata}
              placeholder="Select Author"
              onSelect={(val) => updateFilterField('author', val)}
            />
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Year
            </label>
            <SingleDropDown
              options={Yeardata}
              placeholder="Select Year"
              onSelect={(val) => updateFilterField('year', val)}
            />
          </div>

          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Tag
            </label>
            <SingleDropDown
              options={Tagdata}
              placeholder="Select Tag"
              onSelect={(val) => updateFilterField('tags', val)}
            />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors duration-150"
        >
          Clear Filters
        </button>

        <button
          type="button"
          onClick={handleFilters}
          className="px-7 py-2.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-sm transition-all duration-150"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default SearchFilters_v1;