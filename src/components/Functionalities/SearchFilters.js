'use client';

import React, { useState, useEffect } from 'react';
import SingleDropDown_v1 from '../UtilityComponents/SingleDropdown_v1';
import SectorHierarchyDropDown from './Admin/SectorHierarchyDropDown';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../pages/api/Api';
import FactsLoader from '@/components/UtilityComponents/Tools/FactsLoader';

const SearchFilters = (props) => {
  const [loading, setLoading] = useState(true);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [Tagdata, setTagdata] = useState([]);

  const [filtersState, setFiltersState] = useState({
    sector_filters: null,
    author: null,
    year: null,
    tags: null,
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
        console.error('Error fetching filter options:', error);
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
    if (props.onDataSend) {
      props.onDataSend(filtersState);
    }
  };

  const handleReset = () => {
    const emptyFilters = {
      sector_filters: null,
      author: null,
      year: null,
      tags: null,
    };
    setFiltersState(emptyFilters);
    if (props.onDataSend) {
      props.onDataSend(emptyFilters);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[200px] flex items-center justify-center p-6">
        <FactsLoader />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      {/* Sector Hierarchy */}
      <div>
        <SectorHierarchyDropDown
          onSelect={(val) => updateFilterField('sector_filters', val)}
        />
      </div>

      {/* Filter Row - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Author */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Author
          </label>
          <SingleDropDown_v1
            options={Authordata}
            placeholder="Select Author"
            onSelect={(val) => updateFilterField('author', val)}
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Year
          </label>
          <SingleDropDown_v1
            options={Yeardata}
            placeholder="Select Year"
            onSelect={(val) => updateFilterField('year', val)}
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Tag
          </label>
          <SingleDropDown_v1
            options={Tagdata}
            placeholder="Select Tag"
            onSelect={(val) => updateFilterField('tags', val)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 sm:py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
          Clear Filters
        </button>

        <button
          type="button"
          onClick={handleFilters}
          className="px-6 sm:px-8 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
        >
          <i className="bi bi-search"></i>
          Search Reports
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;