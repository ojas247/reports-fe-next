import React, { useState, useEffect } from 'react';
import SingleDropDown from "../../../components/UtilityComponents/SingleDropdown";
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import CascadingDropDown from "../../../components/UtilityComponents/CascadingDropdown";
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from "../../api/Api";
import axios from 'axios';
import styles from "../../../styles/Pages/Admin/publishing.module.css";
import Image from 'next/image';
import SubmitGrid from '../../../components/UtilityComponents/SubmitGrid';
import TextWithGrid from '../../../components/UtilityComponents/SEODataSets/TextWithGrid';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';
import { fetchDataFromPostApi } from '../../api/Api';

function RepubData_v1() {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [response, setResponse] = useState(null);
    const [sectorChain, setSectorChain] = useState({});
    const [reportList, setReportList] = useState(['select']);
    const [oldReportData, setOldReportData] = useState({});
    const [SecSubdata, setSecSubdata] = useState([]);
    const [pageHeaderData, setPageHeaderData] = useState({});
    const [aggPageData, setAggPageData] = useState({});
    const [loading, setLoading] = useState(false);
    const [txtGrdComponents, setTxtGrdComponents] = useState([]);
    const [aggDataFromTxtgrdComponent, setAggDataFromTxtgrdComponent] = useState({});
    const comp = { id: 1, data: {} }


    /// to fetch ReportList based on the sectorChain ///
    const fetchReportList = async () => {
        const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
        setReportList(data);
    }

    const getSelectedReportDetails = async (data) => {
        const payload = { ...sectorChain, data: data.value };
        const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
        const mergedReportEntityData = {
            ...Report_Data,
          };
        setOldReportData(mergedReportEntityData);
        console.log("Old Report Data: ", mergedReportEntityData);
    }

    /// to add new TxtGrid Component ///
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


    const getSectorFilters = (data) => {
        setSectorChain({ ...sectorChain, "sectorChain": data });
    }


    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        setLoading(true);

        axios.post(`${backendAPI}/RePublishing/Data_v1`, aggPageData, {
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


    // if (SecSubdata.length === 0 || Authordata.length === 0) {
    //     return <div>Loading...</div>;
    // }

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
                <h1 className={styles.formTitle}>Re-Publishing Data</h1>

                {/* {txtGrdComponents.map((comp) => (
                    <TextWithGrid
                        key={comp.id}
                        updateData={(data) => getTextWithGridData(comp.id, data)}
                        sectorSub1Data={SecSubdata}
                    />
                ))} */}

                {Object.keys(oldReportData).length > 0 && (
                    <TextWithGrid
                        key={comp.id}
                        updateData={(data) => getTextWithGridData(comp.id, data)}
                        sectorSub1Data={SecSubdata}
                        initialData={oldReportData}
                    />
                )}


                {/* Reset and Submit Buttons */}
                <div className={styles.buttonGroup}>
                    <button type="submit" onClick={handleSubmit}  className="text-sm px-2 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">  ⭱ RePublish</button>
                    <button type="reset" className="text-sm px-2 py-1 rounded-full bg-blue-300 text-white hover:bg-blue-500 cursor-pointer">Reset form</button>
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
                      <p>{response.URL}</p>
                    </div>
                )}
                {/* </form>*/}

            </div>
        </div>

    );
}

export default RepubData_v1;