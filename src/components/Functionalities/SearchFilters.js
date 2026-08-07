'use client';

import React, { useState, useEffect } from 'react';
import SingleDropDown from '../UtilityComponents/SingleDropdown';
import CascadingDropDown from '../UtilityComponents/CascadingDropdown';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../pages/api/Api';
import Image from 'next/image';

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

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-6">
        <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={80} height={60} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr_0.9fr_0.9fr] gap-4 items-end">
        <div className="col-span-1 lg:col-span-2 min-w-0">
          <CascadingDropDown
            options={SecSubdata}
            onSelect={(val) => updateFilterField('sector_filters', val)}
          />
        </div>

        <div className="min-w-0">
          <SingleDropDown
            options={Authordata}
            placeholder="Select Author"
            onSelect={(val) => updateFilterField('author', val)}
          />
        </div>

        <div className="min-w-0">
          <SingleDropDown
            options={Yeardata}
            placeholder="Select Year"
            onSelect={(val) => updateFilterField('year', val)}
          />
        </div>

        <div className="min-w-0">
          <SingleDropDown
            options={Tagdata}
            placeholder="Select Tag"
            onSelect={(val) => updateFilterField('tags', val)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleFilters}
          className="w-full sm:w-auto px-8 py-2.5 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;