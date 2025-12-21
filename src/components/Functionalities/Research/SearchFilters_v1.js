'use client'

import React, { useState, useEffect } from 'react';
import styles from '../../../styles/searchFilters.module.css';
import SingleDropDown from "../../UtilityComponents/SingleDropdown"
import CascadingDropDown from "../../UtilityComponents/CascadingDropdown"
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';
import { useRouter } from 'next/router';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../../pages/api/Api';
import Image from 'next/image';
import FactsLoader from '@/components/UtilityComponents/Tools/FactsLoader';


const SearchFilters_v1 = (props) => {
  const router = useRouter();
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  console.log("Props received:", props);
  const initialData = {};
  const [loading, setLoading] = useState(true);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [Tagdata, setTagdata] = useState([]);

  useEffect(() => {
    async function getData() {
      setLoading(true); // Start loader
      const OptionsSub1actualData = await fetchSetorSubOptions();
      setSecSubdata(OptionsSub1actualData);

      const OptionsAuthorData = await fetchAuthors();
      setAuthordata(OptionsAuthorData);

      // const OptionsYearData = await fetchYears();
      const OptionsYearData = { "options_list": [2022, 2021, 2018, 2020, 2024, 2023] };
      setYeardata(OptionsYearData);

      const OptionsTagData = await fetchTags();
      setTagdata(OptionsTagData);
      setLoading(false); // Stop loader
    }
    getData()
  }, [])

  if (loading) {
    return (
      <div style={{ width: "80%", marginLeft: "40%" }} >
        {/* <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={100} height={80} /> */}
        <FactsLoader isLoading={loading} />
      </div>
    );
  }

  const filter_options_json = {};
  const year_placeholder = "Select Year"
  const author_placeholder = "Select Author"

  const getYear = (data) => {
    console.log("Coming from child Year", data);
    filter_options_json['year'] = data;
  }

  const getAuthor = (data) => {
    console.log("Coming from child Author", data);
    filter_options_json['author'] = data;
  }

  const getSectorFilters = (data) => {
    console.log("Coming from child Sectors", data);
    filter_options_json['sector_filters'] = data;
  }

  const getTags = (data) => {
    console.log("Coming from child Tags", data);
    filter_options_json['tags'] = data;
  }

  const handleFilters = () => {
    console.log("filter_options_json:", filter_options_json);
    props.onDataSend(filter_options_json);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sector Hierarchy */}
          <div className="px-4 py-2 shadow-md rounded-2xl">
            <SectorHierarchyDropDown
              preSelectedData={initialData.sectorChain}
              options={SecSubdata}
              onSelect={getSectorFilters}
            />
          </div>

          {/* Dataset Filters */}
          <div className="px-4 py-6 shadow-md rounded-2xl">
            {/* Dataset Category */}
            <label className="block text-sm font-medium text-gray-600 mb-1 sm:px-10">
              Dataset Category
            </label>
            <div className="px-0 py-0 sm:px-5 sm:py-0.5 space-y-3">
              <SingleDropDown
                options={Authordata}
                placeholder={author_placeholder}
                onSelect={getAuthor}
              />

              {/* Year */}
              <label className="block text-sm font-medium text-gray-600 mb-1 sm:px-6">
                Year
              </label>
              <SingleDropDown
                options={Yeardata}
                placeholder={year_placeholder}
                onSelect={getYear}
              />

              {/* Tag */}
              <label className="block text-sm font-medium text-gray-600 mb-1 sm:px-6">
                Tag
              </label>
              <SingleDropDown
                options={Tagdata}
                placeholder="Select Tag"
                onSelect={getTags}
              />
            </div>
          </div>
        </div>

        <div className="flex pt-[5px]">
          <button
            type="button"
            onClick={handleFilters}
            className={styles.GoButton}
          >
            Go
          </button>
        </div>
      </div>
    </>
  );

}

export default SearchFilters_v1;
