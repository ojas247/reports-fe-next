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
import TextWithTitle from '../../../components/UtilityComponents/SEODataSets/TextWithTitle';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';
import { sleep_function } from '../../../pages/api/UtilFunctions';

function DataPagePublishingForm() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [response, setResponse] = useState(null);
  const [sectorChain, setSectorChain] = useState({});
  const [SecSubdata, setSecSubdata] = useState([]);
  const [dataName, setDataName] = useState("");
  const [Authordata, setAuthordata] = useState([]);
  const [reportList, setReportList] = useState(['select']);
  const [Tagsdata, setTagsdata] = useState([]);
  const [pageHeaderData, setPageHeaderData] = useState({});
  const [aggPageData, setAggPageData] = useState({});
  const GeoData = { "options_list": ["India", "Global", "MENA"] }
  const [loading, setLoading] = useState(false);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);
  const [ComponentsArray, setComponentsArray] = useState([]);
  const [txtComponents, setTxtComponents] = useState([]);
  const [apiCallTrigger, setApiCallTrigger] = useState(false);


  const addComponentToArray = (compName, componentData) => {
    const newComp = { id: Date.now(), compName, componentData };
    setComponentsArray((prev = []) => {
      if (compName === "pageHeader") {
        // Put PageHeader first, keep others after
        return [newComp, ...prev.filter(comp => comp.compName !== "pageHeader")];
      } else {
        // Just append normally
        return [...prev, newComp];
      }
    });
  };

  /// to fetch ReportList based on the sectorChain ///
  const fetchReportList = async () => {
    console.log("Fetch Data by ReporlList: ", sectorChain)
    const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
    setReportList(data);
  }
  /// to fetch All Data of an Entity (Report) that is selected by the user
  const getSelectedReportDetails = async (data) => {
    const payload = { ...sectorChain, data: data.value };
    const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
    if (Report_Data != null) {
      addComponentToArray("txtGrid", Report_Data);
    }
  }

  useEffect(() => {
    console.log("ComponentsArrayCheck: ", ComponentsArray)
  }, [ComponentsArray])

  
  const removeComponentFromArray = (id) => {
    setComponentsArray((prev) => prev.filter((comp) => comp.id !== id));
  };
  /// call back functino from TxtWithTitle Component ///
  const getTextWithTitleData = (id, data) => {
    setComponentsArray((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, componentData: data } : comp
      )
    );
  };



  useEffect(() => {
    if (txtGrdComponents && txtGrdComponents.length > 0) {
      // Build an object from the array
      const newAggData = txtGrdComponents.reduce((acc, item) => {
        acc[`txtGrid_${item.id}`] = item.data;
        return acc;
      }, {});
      setAggPageData({ ...aggPageData, ...newAggData });
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
    setAggPageData({ ...aggPageData, "pageHeader": pageHeaderData });
   
  }, [pageHeaderData])



  const getDropDownData = (field, data) => {
    setPageHeaderData({ ...pageHeaderData, [field]: data.map(item => item.value) });
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

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setLoading(true);
    addComponentToArray("pageHeader", pageHeaderData);
    setApiCallTrigger(true)
  }

  useEffect(() => {
    if (apiCallTrigger) {
      axios.post(`${backendAPI}/Publishing/DataPage_v1`, ComponentsArray, {
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
        setApiCallTrigger(false)
      });
    }
  }, [apiCallTrigger])


  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/4 bg-gray-100 p-4 sticky top-0 h-screen">
        <div className="container bg-blue-100 py-4 mt-4 rounded-2xl flex flex-col items-center justify-center">
          <p className="text-lg font-bold">Text With Grid</p>
          <div className="px-4 py-4">
            <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
          </div>

          <div className='px-6 py-4'>
            <button
              onClick={fetchReportList}
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg transform hover:scale-102 transition-all duration-200 cursor-pointer">
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


        <div className="container bg-blue-100 py-4 mt-4 rounded-2xl flex flex-col items-center justify-center">
          <p className="text-lg font-bold">Text With Title</p>
          <button
            onClick={() => addComponentToArray("txtWithTitle", {})}
            className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg transform hover:scale-102 transition-all duration-200 cursor-pointer"
          >
            + Text With Title
          </button>
        </div>
      </div>


      {/* Right Side of the page */}
      <div className="w-3/4 bg-white p-4 overflow-y-auto h-screen">
        <h1 className={styles.formTitle}>Publishing Page</h1>
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

            {/* Page Data Description Field */}
            <div className={styles.fieldPub}>
              <label htmlFor="pageDataDesc">Page Data Description:</label>
              <input
                type="text"
                name="pageDataDesc"
                id="pageDataDesc"
                onChange={assignFormData}
              />
            </div>

            {/* SEO Desc Name Field */}
            <div className={styles.fieldPub}>
              <label htmlFor="pageSeoDesc">Description for SEO:</label>
              <input
                type="text"
                name="pageSeoDesc"
                id="pageSeoDesc"
                onChange={assignFormData}
              />
            </div>


            {/* Tags Dropdown */}
            <div className={styles.fieldPub}>
              <label htmlFor="tags">Tags:</label>
              <SingleDropDown
                options={Tagsdata}
                isMulti={true}
                onSelect={(data) => getDropDownData("tags", data)} />
            </div>
          </div>

          <div>
            {ComponentsArray !== null && ComponentsArray.length > 0 &&
              ComponentsArray.map((comp, index) => {
                if (comp.compName === "txtGrid") {
                  return (
                    <TextWithGridImmutable
                      key={comp.id}
                      id={comp.id}
                      initialData={comp.componentData}
                      onRemove={removeComponentFromArray}
                    />
                  );
                }
                if (comp.compName === "txtWithTitle") {
                  return (
                    <TextWithTitle
                      key={comp.id}
                      id={comp.id}
                      index={index + 1}
                      updateData={(id, data) => getTextWithTitleData(id, data)}
                      onRemove={removeComponentFromArray}
                    />
                  );
                }
                return null;
              })
            }
          </div>



          <div>

            {/* Reset and Submit Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" onClick={handleSubmit} className="text-sm px-2 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"> ⭱ Submit form</button>
              <button type="reset" className="text-sm px-2 py-1 rounded-full bg-blue-300 text-white hover:bg-blue-500 cursor-pointer">Reset form</button>
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
              <p>{response.Status}</p>
            </div>
          )}
          {/* </form>*/}
        </div>
      </div>
    </div>

  );
}

export default DataPagePublishingForm;