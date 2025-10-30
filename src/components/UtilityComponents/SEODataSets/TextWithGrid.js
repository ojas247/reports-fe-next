'use client'

import { useState, useEffect } from 'react';
import RenderEditableGrid from '../../../components/UtilityComponents/RenderEditableGrid'
import SingleDropDown from '../../../components/UtilityComponents/SingleDropdown'
import CascadingDropDown from '../../../components/UtilityComponents/CascadingDropdown'
import { fetchAuthors, fetchTags } from "../../../pages/api/Api";
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';


const TextWithGrid = (props) => {
    const {
      sectorSub1Data = [],   // default empty if not passed
      initialData = {},      // parent can pass prefilled values here
      updateData
    } = props;
  
    const [SecSubdata, setSecSubdata] = useState(sectorSub1Data);

    const [componentData, setComponentData] = useState({});

    useEffect(() => {
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        setComponentData(prev => ({
            ...prev,              // keep existing (including sectorChain etc.)
            ...props.initialData, // overwrite only provided fields
          }));
    }
    }, [props.initialData]);
  
    const [Authordata, setAuthordata] = useState([]);
    const [Tagsdata, setTagsdata] = useState([]);
  
    const GranularityData = { options_list: ["Snapshot", "Monthly", "Yearly", "Quarterly", "Calendar Year"] };
    const UnitsData = { options_list: ["In Numbers", "%", "Kilometers", "INR Cr", "Paise", "INR", "Lakhs", 
      "thousands", "Million", "USD Mn", "thousand tons", "Mn tons", "MN USD", "INR Lakh Cr"] };
    const isTSData = { options_list: ["Yes", "No"] };
    const GeoData = { options_list: ["India", "Global", "MENA"] };
    const author_placeholder = "Select Author";
  
    const updateField = (name, value) => {
    console.log("This is called two time ", name, value)
      setComponentData((prev) => ({ ...prev, [name]: value }));
    };
  
    // const getSectorFilters = (data) => updateField("sectorChain", data);

    const getSectorFilters = (data) => {
        if (data && Object.keys(data).length > 0) {
          updateField("sectorChain", data);
        }};
    const assignFormData = (e) => updateField(e.target.name, e.target.value);
  
    const getDropDownData = (field, data) => {
      updateField(field, data.map((item) => item.value));
       
    };
  
    const getSingleDropDownData = (field, data) => {
      updateField(field, data?.value || "");
    };
  
    const saveTable = (tableData) => updateField("tableData", tableData);
  
    useEffect(() => {
      async function getData() {
        const OptionsAuthorData = await fetchAuthors();
        setAuthordata(OptionsAuthorData);
  
        const OptionsTagsData = await fetchTags();
        setTagsdata(OptionsTagsData);
      }
      getData();
    }, []);


    useEffect(() => {
        console.log("componentData b4: ", componentData)
        props.updateData(componentData);
      }, [componentData]);
  
  
    return (
      <div className="border border-gray-300 rounded-md p-4">
        <p className="text-2xl font-bold"> Text With Grid</p>
  
        {/* Sector Dropdown */}
        <div className="px-4 py-4">
          <SectorHierarchyDropDown preSelectedData={initialData.sectorChain} options={SecSubdata} onSelect={getSectorFilters} />
        </div>
  
        {/* Report Name Field */}
        <div >
          <label htmlFor="dataName">Data Name:</label>
          <input
            type="text"
            name="dataName"
            id="dataName"
            value={componentData.dataName}
            className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
            onChange={assignFormData}
          />
        </div>
  
        {/* Source URL Field */}
        <div>
          <label htmlFor="sourceURL">Source URL:</label>
          <input
            type="text"
            name="sourceURL"
            id="sourceURL"
            value={componentData.sourceURL}
            className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
            onChange={assignFormData}
          />
        </div>
  
        {/* About Dataset */}
        <div>
          <label htmlFor="dataDesc">Overview of Data:</label>
          <textarea
            name="dataDesc"
            id="dataDesc"
            value={componentData.dataDesc}
            onChange={assignFormData}
            rows={1}
            className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

         {/* Description for SEO */}
         <div>
          <label htmlFor="seoDesc">SEO Desc:</label>
          <textarea
            name="seoDesc"
            id="seoDesc"
            value={componentData.seoDesc}
            onChange={assignFormData}
            rows={1}
            className="w-full resize-none overflow-hidden border border-gray-300 rounded-md p-2"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>
  
        {/* Year-Month Field */}
        <div className="px-4 py-4">
          <label htmlFor="year">Data Published On: </label>
          <input
            type="month"
            name="year"
            id="year"
            onChange={assignFormData}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
  
        {/* Author Dropdown */}
        <div>
          <label htmlFor="authors">Authors:</label>
          <SingleDropDown
            isMulti={true}
            options={Authordata}
            placeholder={author_placeholder}
            selectedValue={componentData.authors ? componentData.authors : null}
            onSelect={(data) => getDropDownData("authors", data)}
          />
        </div>
  
        {/* Tags Dropdown */}
        <div className="px-4 py-4">
          <label htmlFor="tags">Tags:</label>
          <SingleDropDown
            options={Tagsdata}
            isMulti={true}
            onSelect={(data) => getDropDownData("tags", data)}
          />
        </div>
  
        <RenderEditableGrid oldTableData={componentData.tableData} onSave={saveTable} />
  
        {/* Units */}
        <div>
          <label htmlFor="units">Units:</label>
          <SingleDropDown
            options={UnitsData}
            isMulti={false}
            onSelect={(data) => getSingleDropDownData("units", data)}
          />
        </div>
  
        {/* Granularity */}
        <div>
          <label htmlFor="granularity">Granularity:</label>
          <SingleDropDown
            options={GranularityData}
            isMulti={false}
            onSelect={(data) => getSingleDropDownData("granularity", data)}
          />
        </div>
  
        {/* Is Time Series */}
        <div>
          <label htmlFor="isTSData">Is Time Series:</label>
          <SingleDropDown
            options={isTSData}
            isMulti={true}
            onSelect={(data) => getDropDownData("isTSData", data)}
          />
        </div>
  
        {/* Geo */}
        <div>
          <label htmlFor="geo">Geography:</label>
          <SingleDropDown
            options={GeoData}
            isMulti={true}
            onSelect={(data) => getDropDownData("geo", data)}
          />
        </div>
      </div>
    );
  };

export default TextWithGrid;
