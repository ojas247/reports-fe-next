'use client'

import Navbar from "@/components/Functionalities/NavBar";
import Footer from "@/components/Website/Footer";
import CoCharts from "./../../components/UtilityComponents/Correlations/CoCharts"
import CascadingDropDown from "./../../components/UtilityComponents/CascadingDropdown"
import SingleDropDown from "./../../components/UtilityComponents/SingleDropdown"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchSetorSubOptions, fetchAuthors, fetchDataFromGetApi, fetchDataFromPostApi } from '../../pages/api/Api';
import styles from '../../styles/searchFilters.module.css';

export default function Correlations() {
    const isFirstRun = useRef(true);
    const [SecSubdata, setSecSubdata] = useState([]);
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedSub1, setSelectedSub1] = useState("");
    const [listOfDatasets, setListOfDatasets] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedDataItems, setSelectedDataItems] = useState([]);
    const [datasetResponses, setDatasetResponses] = useState([]);


    useEffect(() => {
        async function getData() {
            const OptionsSub1actualData = await fetchSetorSubOptions(); // ✅ wait for the data
            setSecSubdata(OptionsSub1actualData); // ✅ set actual data 
        }
        getData(); // call the async function
    }, []);

    useEffect(() => {
        async function getListOfDatasets() {
            const payload = { "sector": selectedSector, "sub1": selectedSub1 };
            const resp = await fetchDataFromPostApi(payload, `listOfDatasets`);
            setListOfDatasets(resp);
        }
        getListOfDatasets();
    }, [selectedSub1]);


    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false; // Skip first run
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetchDataFromPostApi(selectedDataItems, `getTSdata`);
                setDatasetResponses(response);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [selectedDataItems]);



    const getSectorFilters = (data) => {
        setSelectedSector(data.sector);
        setSelectedSub1(data.sub1);
    };


    const getDataSetFilter = async (newOptions) => {
        const prevValues = selectedOptions.map(opt => opt.value);
        const newValues = newOptions?.map(opt => opt.value) || [];

        // Find added option(s)
        const added = newValues.filter(val => !prevValues.includes(val));
        // Find removed option(s)
        const removed = prevValues.filter(val => !newValues.includes(val));

        // Handle added datasets
        for (const datasetName of added) {
            const payload = { item: datasetName, sub1: selectedSub1, sector: selectedSector };
            setSelectedDataItems((prev) => [...prev, payload]);
        }

        // Handle removed datasets (filter out removed items)
        if (removed.length > 0) {
            setSelectedDataItems((prev) =>
                prev.filter(item => !removed.includes(item.item))
            );
        }

        // Update state
        setSelectedOptions(newOptions || []);
    };


    if (SecSubdata.length === 0) {
        return <div>Loading...!</div>;
    }


    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
            
                <div className="mb-4 flex flex-row">
                    <div>
                        <CascadingDropDown options={SecSubdata} onSelect={getSectorFilters} />
                    </div>
                    <div>
                        <SingleDropDown options={listOfDatasets} onSelect={getDataSetFilter} />
                    </div>

                </div>

                <div className="mb-4">
                    {selectedOptions && (
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map(opt => (
                                <span key={opt.value} className="bg-blue-900 text-gray-100 px-4 rounded-full text-sm">
                                    {opt.value}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {datasetResponses.length > 0 ? (
                    <CoCharts apiData={datasetResponses} />
                ) : (<div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-600 text-lg text-center">
                        No Datasets found. Please adjust your filters.
                    </p>
                    <div className="max-w-md w-full">
                        <Image
                            src="https://storage.googleapis.com/marketreports/Brand/Website/detectiveSearching.jpg"
                            alt="No reports found"
                            className="w-full h-auto rounded-lg shadow-lg mb-4"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
                )}

            </div>
            <Footer />
        </>

    )
}



