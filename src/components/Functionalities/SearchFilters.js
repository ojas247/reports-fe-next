'use client'

import React, { useState, useEffect } from 'react';
import styles from '../../styles/searchFilters.module.css';
import SingleDropDown from "../UtilityComponents/SingleDropdown"
import CascadingDropDown from "../UtilityComponents/CascadingDropdown"
import { useRouter } from 'next/router';
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from '../../pages/api/Api';

const SearchFilters = (props) => {
  const router = useRouter();
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  
  console.log("SearchFilters rendering...");
  console.log("Current route:", router.pathname);
  console.log("Props received:", props);
  
  const [token, setToken] = useState(null);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [Authordata, setAuthordata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [Tagdata, setTagdata] = useState([]);

  useEffect(() => {
    console.log("check123: ", props)
    async function getData() {
      const OptionsSub1actualData = await fetchSetorSubOptions();
      setSecSubdata(OptionsSub1actualData);

      const OptionsAuthorData = await fetchAuthors();
      setAuthordata(OptionsAuthorData);

      const OptionsYearData = await fetchYears();
      setYeardata(OptionsYearData);

      const OptionsTagData = await fetchTags();
      setTagdata(OptionsTagData);
    }
    getData()
  }, [])

  if (SecSubdata.length === 0 || Yeardata.length === 0 || Authordata.length === 0) {
    return (
      <div style={{ marginLeft: "40%" }} >
        <img src="./Assets/Gifs/loading.gif" alt="Loading..." width="100" height="80" />
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
      <div
        className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start p-4"
      >
        <div>
          <CascadingDropDown options={SecSubdata} onSelect={getSectorFilters} />
        </div>
  
        <div className="mt-[-8px] mb-[-9.5px]">
          <SingleDropDown
            options={Authordata}
            placeholder={author_placeholder}
            onSelect={getAuthor}
          />
        </div>
  
        <div className="mt-[-8px] mb-[-9.5px]">
          <SingleDropDown
            options={Yeardata}
            placeholder={year_placeholder}
            onSelect={getYear}
          />
        </div>
  
        <div className="mt-[-8px] mb-[-9.5px]">
          <SingleDropDown
            options={Tagdata}
            placeholder="Select Tag"
            onSelect={getTags}
          />
        </div>
  
        <div className="flex pt-[5px] px-3">
          <button
            type="button"
            onClick={handleFilters}
            className= {styles.GoButton} >
            Go
          </button>
        </div>
      </div>
    </>
  );
}

export default SearchFilters;






  //   function SearchReports() {
  //     if (router.pathname === '/ReportResult') {
  //       axios.post(`${backendAPI}/SearchReports`, filter_options_json,
  //         {
  //           headers: {
  //             "Authorization": `Bearer ${token}`,
  //           }
  //         })
  //         .then(res => {
  //           const ReportFilterProps = res.data;
  //           if (ReportFilterProps.message === "Invalid Authorization") {
  //             router.push('/Login');
  //           }
  //           else if (ReportFilterProps.message === "Update plan") {
  //             router.push('/Pricing');
  //           } else {
  //             router.push({
  //               pathname: '/ReportResult',
  //               query: {
  //                 appliedFilters: JSON.stringify(filter_options_json)
  //               }
  //             });
  //           }
  //         });
  //     } else {
    
  //       router.push({
  //         pathname: '/ReportResult',
  //         query: {
  //           appliedFilters: JSON.stringify(filter_options_json)
  //         }
  //       });
  //     }
  //     }
    
  //   SearchReports();