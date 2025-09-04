'use client'

import { useState, useEffect } from 'react';
import RenderEditableGrid from '../../../components/UtilityComponents/RenderEditableGrid'
import SingleDropDown from '../../../components/UtilityComponents/SingleDropdown'
import CascadingDropDown from '../../../components/UtilityComponents/CascadingDropdown'
import { fetchAuthors, fetchTags } from "../../../pages/api/Api";
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';


const TextWithGrid = (props) => {
    const [SecSubdata, setSecSubdata] = useState(props.sectorSub1Data);
    const [componentData, setComponentData] = useState({});
    const [Authordata, setAuthordata] = useState([]);
    const [Tagsdata, setTagsdata] = useState([]);


    const GranularityData = { "options_list": ["Snapshot", "Monthly", "Yearly", "Quarterly", "Calendar Year"] }
    const UnitsData = { "options_list": ["In Numbers", "%", "Kilometers", "INR Cr", "Paise", "INR", "Lacs", "thousands", "Million", "USD Mn", "thousand tons", "Mn tons"] }
    const isTSData = { "options_list": ["Yes", "No"] }
    const author_placeholder = "Select Author"


    const getSectorFilters = (data) => {
        console.log("Sector Filters: ", data);
        setComponentData({ ...componentData, sectorChain: data });
    }

    const assignFormData = (e) => {
        setComponentData({ ...componentData, [e.target.name]: e.target.value });
    }

    const getDropDownData = (field, data) => {
        setComponentData({ ...componentData, [field]: data.map(item => item.value), });
    }

    const saveTable = (tableData) => {
        setComponentData({ ...componentData, tableData: tableData });
    };

    useEffect(() => {
        async function getData() {
            const OptionsAuthorData = await fetchAuthors();
            setAuthordata(OptionsAuthorData);

            const OptionsTagsData = await fetchTags();
            setTagsdata(OptionsTagsData);
        }
        getData()
    }, [])

    useEffect(() => {
        console.log("Component data:", componentData);
        props.updateData(componentData);
    }, [componentData]);




    return (
        <>
            <div className="border border-gray-300 rounded-md p-4">
                <p className="text-2xl font-bold"> Text With Grid</p>
                {/* Sector Dropdown */}
            
                <div className="px-4 py-4">
                    <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
                </div>
                {/* Report Name Field */}
                <div className="px-4 py-4">
                    <label htmlFor="dataName">Data Name:</label>
                    <input
                        type="text"
                        name="dataName"
                        id="dataName"
                        defaultValue="dataName"
                        onChange={assignFormData}
                    />
                </div>

                {/* Source URL Field */}
                <div >
                    <label htmlFor="sourceURL">Source URL:</label>
                    <input
                        type="text"
                        name="sourceURL"
                        id="sourceURL"
                        defaultValue="SourceURL"
                        className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
                        onChange={assignFormData}
                    />
                </div>

                {/* About Dataset */}
                <div >
                    <label htmlFor="dataDesc">Overview of Data:</label>
                    <textarea
                        name="dataDesc"
                        id="dataDesc"
                        defaultValue=""
                        onChange={assignFormData}
                        rows={1}  // start small
                        className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
                        onInput={(e) => {
                            e.target.style.height = "auto"; // reset height
                            e.target.style.height = e.target.scrollHeight + "px"; // set based on content
                        }}
                    />
                </div>

                {/* Year-Month Field */}
                <div className=" px-4 py-4">
                    <label htmlFor="monthYear">Data Published On: </label>
                    <input
                        type="month"
                        name="monthYear"
                        id="monthYear"
                        onChange={assignFormData}
                        className="border border-gray-300 rounded px-4 py-2"
                    />
                </div>

                {/* Author Dropdown */}
                <div>
                    <label htmlFor="authors">Authors:</label>
                    <SingleDropDown
                        options={Authordata} placeholder={author_placeholder}
                        onSelect={(data) => getDropDownData("authors", data)}
                    />
                </div>


                {/* Tags Dropdown */}
                <div className="px-4 py-4">
                    <label htmlFor="tags">Tags:</label>
                    <SingleDropDown options={Tagsdata} onSelect={(data) => getDropDownData("tags", data)} />
                </div>

                <RenderEditableGrid onSave={saveTable} />

                {/* Units / Quantity */}
                <div >
                    <label htmlFor="units">Units:</label>
                    <SingleDropDown options={UnitsData} onSelect={(data) => getDropDownData("units", data)} />
                </div>

                {/* Granularity */}
                <div >
                    <label htmlFor="granularity">Granularity:</label>
                    <SingleDropDown options={GranularityData} onSelect={(data) => getDropDownData("units", data)} />
                </div>

                {/* Is Time Series */}
                <div>
                    <label htmlFor="isTSData">Is Time Series:</label>
                    <SingleDropDown options={isTSData} onSelect={(data) => getDropDownData("isTSData", data)} />
                </div>

            </div>
        </>
    );
};

export default TextWithGrid;
