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
  const [gridCSVFile, setGridCSVFile] = useState(null);
  const [pageHeaderData, setPageHeaderData] = useState({});
  const [aggPageData, setAggPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);
  const [aggDataFromTxtgrdComponent, setAggDataFromTxtgrdComponent] = useState({});
  // const [apiMessage, setApiMessage] = useState(null);


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

    }
    getData()
  }, [])

  useEffect(() => {
    setAggPageData(prev => ({
      ...prev,
      ...pageHeaderData,
      ...aggDataFromTxtgrdComponent
    }));
    console.log("Aggregated Data Component ->", {
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


  if (SecSubdata.length === 0 || Authordata.length === 0) {
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

        {txtGrdComponents.map((comp) => (
          <TextWithGrid
            key={comp.id}
            updateData={(data) => getTextWithGridData(comp.id, data)}
            sectorSub1Data={SecSubdata}
          />
        ))}

        {/* Reset and Submit Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" onClick={handleSubmit} className="text-sm px-2 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">  ⭱ Publish</button>
          <button type="reset" className="text-sm px-2 py-1 rounded-full bg-blue-300 text-white hover:bg-blue-500 cursor-pointer">Reset form</button>
        </div>


        {/* Loader */}
        {loading && (
          <div className={styles.loaderContainer}>
            <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={100} height={80} />
            <p>Uploading Reports...</p>
          </div>
        )}

        {/* {response && (
          <div className={styles.responseContainer}>
            <p>{response.Status}</p>
            <p>{response.URLSlug}</p>
          </div>
        )} */}
        {response && (
          <div className={`${styles.responseContainer} relative p-4 rounded-md bg-blue-100 text-blue-800`}>
            {/* Close Button */}
            <button
              onClick={() => setResponse(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 font-bold"
            >
              ×
            </button>

            {/* Message Content */}
            <p className="font-semibold">{response.Status}</p>
            <p className="text-sm">{response.URLSlug}</p>
          </div>
        )}
        {/* </form>*/}

      </div>
    </div>

  );
}

export default DataPublishingForm;