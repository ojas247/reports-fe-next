import React, { useState, useEffect } from 'react';
import SingleDropDown from "../../../components/UtilityComponents/SingleDropdown";
import CascadingDropDown from "../../../components/UtilityComponents/CascadingDropdown";
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from "../../api/Api";
import axios from 'axios';
import styles from "../../../styles/Pages/Admin/publishing.module.css";
import Image from 'next/image';
import SubmitGrid from '../../../components/UtilityComponents/SubmitGrid';
import TextWithGrid from '../../../components/UtilityComponents/SEODataSets/TextWithGrid';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

function DataPublishingForm() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [response, setResponse] = useState(null);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [dataName, setDataName] = useState("");
  const [Authordata, setAuthordata] = useState([]);
  const [Tagsdata, setTagsdata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [gridCSVFile, setGridCSVFile] = useState(null);
  const [pageHeaderData, setPageHeaderData] = useState({});
  const [aggPageData, setAggPageData] = useState({});
  const GeoData = { "options_list": ["India", "Global", "MENA"] }
  const [loading, setLoading] = useState(false);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);
  const [aggDataFromTxtgrdComponent, setAggDataFromTxtgrdComponent] = useState({});
  const author_placeholder = "Select Author"


  /// to add new TxtGrid Component START ///
  const addTxtGrdComponent = () => {
    setTxtGrdComponents((prev) => [...prev, { id: Date.now() }]); // Unique ID for each component
  };

  /// call back functino from TxtGrid Component ///
  const getTextWithGridData = (id, data) => {
    setAggDataFromTxtgrdComponent((prevData) => ({ ...prevData, [`txtGrid_${id}`]: data, }));
  };


  useEffect(() => {
    async function getData() {
      const OptionsSub1actualData = await fetchSetorSubOptions();
      setSecSubdata(OptionsSub1actualData);

      const OptionsAuthorData = await fetchAuthors();
      setAuthordata(OptionsAuthorData);

      const OptionsTagsData = await fetchTags();
      setTagsdata(OptionsTagsData);

      // const OptionsYearData = await fetchYears();
      const OptionsYearData = { "options_list": [2022, 2021, 2018, 2020, 2024, 2023] };
      setYeardata(OptionsYearData);
    }
    getData()
  }, [])

  useEffect(() => {
    setAggPageData(prev => ({
      ...prev,
      ...pageHeaderData,
      ...aggDataFromTxtgrdComponent
    }));
    console.log("Aggregated Page Data ->", {
      ...aggPageData,
      ...pageHeaderData,
      ...aggDataFromTxtgrdComponent
    });
  }, [pageHeaderData, aggDataFromTxtgrdComponent]);
  

  const getDropDownData = (field, data) => {
    setPageHeaderData({ ...pageHeaderData, [field]: data.map(item => item.value), });
    
  }

  const getSectorFilters = (data) => {
    console.log("Sector Filters: ", data);
    setPageHeaderData({ ...pageHeaderData, data });
  }

  const assignFormData = (e) => {
    e.persist();
    setPageHeaderData({ ...pageHeaderData, [e.target.name]: e.target.value });
    // console.log("Assign", e.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setLoading(true);


    axios.post(`${backendAPI}/Publishing/Data_v1`, aggPageData, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        console.log("resData", res.data);
        setResponse(res.data);
      })
      .finally(() => {
        setLoading(false); // Stop the loader
      });

  }



  if (SecSubdata.length === 0 || Authordata.length === 0 || Yeardata.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full">
      <div className="w-1/4 bg-gray-100 p-4 sticky top-0 h-screen">
        <div className="relative">
          <button
            onClick={addTxtGrdComponent}
            className="absolute top-0 right-0 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Add Component
          </button>
        </div>
      </div>

      <div className="w-3/4 bg-white p-4 overflow-y-auto h-screen">
        <h1 className={styles.formTitle}>Publishing Data</h1>

        {/* <form method="post" onSubmit={handleSubmit} className={styles.formContainer}> */}
        <div className={styles.formContainer}>
          {/* Sector Dropdown */}
          {/* <div className={styles.formGroup}>
            <CascadingDropDown options={SecSubdata} onSelect={getSectorFilters} />
          </div> */}
          <div className="px-4 py-4">
            <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
          </div>

          <div className={styles.reportPub}>

            {/* Report Name Field */}
            <div className={styles.fieldPub}>
              <label htmlFor="dataName">Data Name:</label>
              <input
                type="text"
                name="dataName"
                id="dataName"
                defaultValue="dataName"
                onChange={assignFormData}
              />
            </div>

            {/* SEO Desc Name Field */}
            <div className={styles.fieldPub}>
              <label htmlFor="dataName">Description for SEO:</label>
              <input
                type="text"
                name="seoDesc"
                id="seoDesc"
                defaultValue="seoDesc"
                onChange={assignFormData}
              />
            </div>


            {/* Tags Dropdown */}
            <div className={styles.fieldPub}>
              <label htmlFor="tags">Tags:</label>
              <SingleDropDown options={Tagsdata} onSelect={(data) => getDropDownData("tags", data)} />
            </div>

            {txtGrdComponents.map((comp) => (
              <TextWithGrid
                key={comp.id}
                updateData={(data) => getTextWithGridData(comp.id, data)}
                sectorSub1Data={SecSubdata}
              />
            ))}

            {/* Reset and Submit Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" onClick={handleSubmit} className={styles.submitBtn}>Submit form</button>
              <button type="reset" className={styles.resetBtn}>Reset form</button>
            </div>

          </div>

          {/* Loader */}
          {loading && (
            <div className={styles.loaderContainer}>
              <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={100} height={80} />
              <p>Uploading Reports...</p>
            </div>
          )}

          {response && (
            <div className={styles.responseContainer}>
              <p>{response}</p>
            </div>
          )}
          {/* </form>*/}
        </div>
      </div>
    </div>

  );
}

export default DataPublishingForm;