import React, { useState, useEffect } from 'react';
import SingleDropDown from "../../../components/UtilityComponents/SingleDropdown";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import CascadingDropDown from "../../../components/UtilityComponents/CascadingDropdown";
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from "../../api/Api";
import { fetchDataFromPostApi } from '../../../pages/api/Api';
import axios from 'axios';
import styles from "../../../styles/Pages/Admin/publishing.module.css";
import Image from 'next/image';
import SubmitGrid from '../../../components/UtilityComponents/SubmitGrid';
import TextWithGridImmutable from '../../../components/UtilityComponents/SEODataSets/TextWithGridImmutable';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

function DataPagePublishingForm() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [response, setResponse] = useState(null);
  const [sectorChain, setSectorChain] = useState({});
  const [SecSubdata, setSecSubdata] = useState([]);
  const [dataName, setDataName] = useState("");
  const [Authordata, setAuthordata] = useState([]);
  const [reportList, setReportList] = useState(['select']);
  const [Tagsdata, setTagsdata] = useState([]);
  const [Yeardata, setYeardata] = useState([]);
  const [gridCSVFile, setGridCSVFile] = useState(null);
  const [pageHeaderData, setPageHeaderData] = useState({});
  const [aggPageData, setAggPageData] = useState({});
  const GeoData = { "options_list": ["India", "Global", "MENA"] }
  const [loading, setLoading] = useState(false);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);

  /// to fetch ReportList based on the sectorChain ///
  const fetchReportList = async () => {
    console.log("Fetch Data by ReporlList: ", sectorChain)
    const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
    setReportList(data);
  }

  const getSelectedReportDetails = async (data) => {
    const payload = { ...sectorChain, data: data.value };
    console.log("Payload69: ", payload)
    const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
    if (Report_Data != null) {
      addTxtGrdComponent(Report_Data);
    }
  }

  /// to add new TxtGrid Component ///
  const addTxtGrdComponent = (reportData) => {
    setTxtGrdComponents((prev) => [
      ...prev,
      { id: Date.now(), data: reportData }
    ]);
  };

  //// to remove TxtGrid Component ////
  const removeTxtGrdComponent = (id) => {
    console.log("remove: ", id)
    setTxtGrdComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  useEffect(() => {
    if (txtGrdComponents && txtGrdComponents.length > 0) {
      // Build an object from the array
      const newAggData = txtGrdComponents.reduce((acc, item) => {
        acc[`txtGrid_${item.id}`] = item.data;
        return acc;
      }, {});
      setAggPageData(newAggData);
    }
  }, [txtGrdComponents]);

  useEffect(() => {
    console.log("AggPageData: ", aggPageData)
  }, [aggPageData])



  useEffect(() => {
    async function getData() {
      const OptionsSub1actualData = await fetchSetorSubOptions();
      setSecSubdata(OptionsSub1actualData);

      const OptionsAuthorData = await fetchAuthors();
      setAuthordata(OptionsAuthorData);

      const OptionsTagsData = await fetchTags();
      setTagsdata(OptionsTagsData);

    }
    getData()
  }, [])

  useEffect(() => {
    setAggPageData({ ...aggPageData, "pageHeaderData": pageHeaderData });
  }, [pageHeaderData])



  const getDropDownData = (field, data) => {
    setPageHeaderData({ ...pageHeaderData, [field]: data.map(item => item.value), });

  }

  const getSectorFilters = (data) => {
    setSectorChain({ ...sectorChain, "sectorChain": data });
    setPageHeaderData({ ...pageHeaderData, "sectorChain": data });
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

    axios.post(`${backendAPI}/Publishing/DataPage_v1`, aggPageData, {
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


  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/4 bg-gray-100 p-4 sticky top-0 h-screen">

        <div className="px-4 py-4">
          <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
        </div>

        <div className='px-6 py-4'>
          <button
            onClick={fetchReportList}
            className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Fetch ReportList
          </button>
        </div>
        <div>

          <SingleDropDown_v1
            options={reportList}
            onSelect={getSelectedReportDetails}
          />
        </div>

      </div>

      <div className="w-3/4 bg-white p-4 overflow-y-auto h-screen">
        <h1 className={styles.formTitle}>Publishing Page</h1>

        {/* <form method="post" onSubmit={handleSubmit} className={styles.formContainer}> */}
        <div className={styles.formContainer}>
          {/* Sector Dropdown */}
          <p className='text-lg font-bold'> Page Specific Info</p>
          <div className="px-4 py-4">
            <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
          </div>

          <div className={styles.reportPub}>

            {/* Report Name Field */}
            <div className={styles.fieldPub}>
              <label htmlFor="dataName">Page Name:</label>
              <input
                type="text"
                name="pageName"
                id="pageName"
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
                onChange={assignFormData}
              />
            </div>


            {/* Tags Dropdown */}
            <div className={styles.fieldPub}>
              <label htmlFor="tags">Tags:</label>
              <SingleDropDown options={Tagsdata} onSelect={(data) => getDropDownData("tags", data)} />
            </div>
          </div>

          <div>
            {txtGrdComponents.map((comp) => (
              <TextWithGridImmutable
                id={comp.id}
                initialData={comp.data}   // pass report details
                onRemove={removeTxtGrdComponent}  // pass remove handler
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

export default DataPagePublishingForm;