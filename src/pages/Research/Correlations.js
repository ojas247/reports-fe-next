'use client'

import Navbar from "@/components/Functionalities/NavBar";
import Footer from "@/components/Website/Footer";
import { useRouter } from "next/navigation";
import CoCharts from "./../../components/UtilityComponents/Correlations/CoCharts"
import CascadingDropDown from "./../../components/UtilityComponents/CascadingDropdown"
import { isSessionTokenValid } from "../../pages/api/UtilFunctions"
import SingleDropDown from "./../../components/UtilityComponents/SingleDropdown"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchSetorSubOptions, fetchAuthors, fetchDataFromGetApi, fetchDataFromPostApi } from '../../pages/api/Api';
import styles from '../../styles/Pages/reports.module.css';
import SectorHierarchyDropDown from '../../components/Functionalities/Admin/SectorHierarchyDropDown';
import DashboardLayout from "@/components/Layout/DashboardLayout";



export default function Correlations() {
    const initialData = {};
    const router = useRouter();
    const isFirstRun = useRef(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production
    const [SecSubdata, setSecSubdata] = useState([]);
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedSub1, setSelectedSub1] = useState("");
    const [selectedDSName, setSelectedDSName] = useState([]);
    const [listOfDataItems, setListOfDataItems] = useState([]);
    const [listOfDatasets, setListOfDatasets] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedDataItems, setSelectedDataItems] = useState([]);
    const [datasetResponses, setDatasetResponses] = useState([]);


    useEffect(() => {
        const auth = isSessionTokenValid();
        setIsAuthenticated(auth);

        if (!auth) {
            alert("Please login to access product-based services.");
            router.push("/Login");
            return;
        }

        async function getData() {
            const OptionsSub1actualData = await fetchSetorSubOptions(); // ✅ wait for the data
            setSecSubdata(OptionsSub1actualData); // ✅ set actual data 
        }
        getData(); // call the async function

    }, []);

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

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false; // Skip first run
            return;
        }
        const fetchData = async () => {
            try {
                const response = await fetchDataFromPostApi(selectedDSName, `listOfDataItems`);
                setListOfDataItems(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (selectedDSName.length > 0) {
            fetchData(selectedDSName);
        }
    }, [selectedDSName]);

    const getSectorFilters = async (data) => {
        if (data && Object.keys(data).length > 0) {
            const resp = await fetchDataFromPostApi(data, `listOfDatasets_v1`);
            setListOfDatasets(resp);
        }
    };

    const getItemFilter = (data) => {
        setSelectedDSName([data]);
    };


    const getDataSetFilter = async (newOptions) => {
        console.log("getDataOptions: ", newOptions);
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
        <DashboardLayout>
            <div className={styles.resultBodyContainer}>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Corellate Datasets
                </h2>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col py-1">

                    {/* Filters Section */}
                    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="px-4 py-2 shadow-md rounded-2xl">
                                <SectorHierarchyDropDown preSelectedData={initialData.sectorChain} options={SecSubdata} onSelect={getSectorFilters} />
                            </div>

                            <div className="px-4 py-6 shadow-md rounded-2xl">
                                <label className="block text-sm font-medium text-gray-600 mb-1 sm:px-10">
                                    Dataset Category
                                </label>
                                <div className="px-0 py-0 sm:px-5 sm:py-0.5">
                                    <SingleDropDown options={listOfDatasets} onSelect={getItemFilter} />
                                </div>
                            </div>

                            <div className="px-4 py-6 shadow-md rounded-2xl">
                                <label className="block text-sm font-medium text-gray-600 mb-1 sm:px-6">
                                    Data Items
                                </label>
                                <SingleDropDown
                                    isMulti={true}
                                    options={listOfDataItems}
                                    onSelect={getDataSetFilter}
                                />
                            </div>
                        </div>

                        {selectedOptions?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectedOptions.map((opt) => (
                                    <span
                                        key={opt.value}
                                        className="bg-blue-800 text-gray-100 px-4 py-1 rounded-full text-sm shadow-sm"
                                    >
                                        {opt.value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chart or No Data Section */}
                    {datasetResponses.length > 0 ? (
                        <CoCharts apiData={datasetResponses} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <p className="text-gray-600 text-lg font-medium mb-4">
                                No datasets found. Please adjust your filters.
                            </p>
                            <Image
                                src="https://storage.googleapis.com/marketreports/Brand/Website/detectiveSearching.jpg"
                                alt="No reports found"
                                className="w-64 h-auto rounded-xl shadow-lg opacity-90"
                                width={300}
                                height={300}
                            />
                        </div>
                    )}
                </div>


            </div>
        </DashboardLayout>
    );
}



