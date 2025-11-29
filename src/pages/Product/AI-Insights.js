'use client'

import Navbar from "@/components/Functionalities/NavBar";
import Footer from "@/components/Website/Footer";
import CoCharts from "../../components/UtilityComponents/Correlations/CoCharts"
import CascadingDropDown from "../../components/UtilityComponents/CascadingDropdown"
import SingleDropDown from "../../components/UtilityComponents/SingleDropdown"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchSetorSubOptions, fetchAuthors, fetchDataFromGetApi, fetchDataFromPostApi } from '../api/Api';
import styles from '../../styles/Pages/reports.module.css';
import SectorHierarchyDropDown from '../../components/Functionalities/Admin/SectorHierarchyDropDown';



export default function AIInsights() {
    const initialData = {};
    const isFirstRun = useRef(true);
    const [SecSubdata, setSecSubdata] = useState([]);
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedSub1, setSelectedSub1] = useState("");
    const [selectedDSName, setSelectedDSName] = useState([]);
    const [listOfDataItems, setListOfDataItems] = useState([]);
    const [listOfDatasets, setListOfDatasets] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedDataItems, setSelectedDataItems] = useState([]);
    const [datasetResponses, setDatasetResponses] = useState([]);

    const getSectorFilters = async (data) => {
        if (data && Object.keys(data).length > 0) {
            const resp = await fetchDataFromPostApi(data, `listOfDatasets_v1`);
            setListOfDatasets(resp);
        }
    };








    return (
        <div className={styles.resultBodyContainer}>
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col py-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Find Statistical Insights from the selected Domains
                </h2>
                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-row justify-center items-center gap-8">
                    <div className="px-4 py-2 shadow-md rounded-2xl">
                        <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
                    </div>

                    <div className="px-4 py-2 shadow-md rounded-2xl">
                        <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
                    </div>
                </div>
                <div className="w-full mt-4">
                    <button
                        className="w-full bg-[#27406d] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#1e3257] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-claude text-white"></i>
                        Generate Insights
                    </button>
                </div>


            </div>

            <Footer />
        </div>
    );
}



