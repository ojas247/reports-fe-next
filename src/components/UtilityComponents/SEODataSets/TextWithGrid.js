'use client'

import { useState, useEffect } from 'react';
import RenderEditableGrid from '../../../components/UtilityComponents/RenderEditableGrid'
import SingleDropDown from '../../../components/UtilityComponents/SingleDropdown'
import CascadingDropDown from '../../../components/UtilityComponents/CascadingDropdown'
import { fetchAuthors, fetchTags } from "../../../pages/api/Api";
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

const TextWithGrid = (props) => {
  const {
    sectorSub1Data = [],
    initialData = {},
    updateData = () => {},
    isTimeSeriesMandatory = false
  } = props;

  const [SecSubdata, setSecSubdata] = useState(sectorSub1Data);
  const [componentData, setComponentData] = useState({});
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [templateInsertIndex, setTemplateInsertIndex] = useState(null);

  const templateOptions = [
    { value: "{{item(x)}}", label: "{{item(N)}} — Name of Item (ascending)" },
    { value: "{{latest0_date}}", label: "{{latest0_date}} — Last-(n) date in table" },
    { value: "{{item(2)_latest(0)}}", label: "{{item2_latest0}} — Value of item-2 as of last-(n) date" },
    { value: "{{units}}", label: "{{units}} — Table measurement units" },
    { value: "{{category}}", label: "{{category}} — Table category" },
    { value: "{{granularity}}", label: "{{granularity}} — Data granularity" },
    { value: "{{ArOps||item(1)_latest(0)/item(1)_latest(1)}}", label: "{{ArOps||...}} — Ratio of latest dates" },
    { value: "{{ArOps||item(1)_latest(0)-item(1)_latest(1)}}", label: "{{ArOps||...}} — Difference between latest dates" },
  ];

  useEffect(() => {
    if (props.initialData && Object.keys(props.initialData).length > 0) {
      setComponentData(prev => ({
        ...prev,
        ...props.initialData,
      }));
    }
  }, [props.initialData]);

  const [Authordata, setAuthordata] = useState([]);
  const [Tagsdata, setTagsdata] = useState([]);

  const GranularityData = { options_list: ["Snapshot", "Monthly", "Yearly", "Quarterly", "Calendar Year"] };
  const UnitsData = { 
    options_list: [
      "In Numbers", "Cr", "%", "Kilometers", "'000 Km", "INR", "INR '000", "INR Cr", "INR Lakh Cr", "USD", 
      "USD Mn", "USD Bn", "Paise", "Lakhs", "Thousands", "Million", "tons", "thousand tons", "Mn tons", 
      "Mn Metric Tonnes", "US$/bbl"
    ] 
  };
  const isTSData = { options_list: ["Yes", "No"] };
  const GeoData = { options_list: ["India", "Global", "MENA"] };
  const author_placeholder = "Select Author";

  const updateField = (name, value) => {
    setComponentData((prev) => ({ ...prev, [name]: value }));
  };

  const getSectorFilters = (data) => {
    if (data && Object.keys(data).length > 0) {
      updateField("sectorChain", data);
    }
  };

  const assignFormData = (e) => updateField(e.target.name, e.target.value);

  const handleDataDescChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || value.length;

    setComponentData((prev) => ({
      ...prev,
      dataDesc: value,
    }));

    const justTyped = value.slice(cursorPos - 2, cursorPos);
    if (justTyped === "{{") {
      setShowTemplateDropdown(true);
      setTemplateInsertIndex(cursorPos - 2);
    }
  };

  const handleDataDescKeyDown = (e) => {
    if (e.key === "Escape" && showTemplateDropdown) {
      e.stopPropagation();
      setShowTemplateDropdown(false);
      setTemplateInsertIndex(null);
    }
  };

  const handleTemplateSelect = (option) => {
    if (templateInsertIndex === null) {
      setShowTemplateDropdown(false);
      return;
    }

    setComponentData((prev) => {
      const current = prev.dataDesc || "";
      const before = current.slice(0, templateInsertIndex);
      const after = current.slice(templateInsertIndex + 2);
      const newValue = before + option + after;

      return {
        ...prev,
        dataDesc: newValue,
      };
    });

    setShowTemplateDropdown(false);
    setTemplateInsertIndex(null);
  };

  const getDropDownData = (field, data) => {
    updateField(field, data.map((item) => item.value));
  };

  const getSingleDropDownData = (field, data) => {
    updateField(field, data?.value || "");
  };

  const saveTable = (tableData) => updateField("tableData", tableData);

  useEffect(() => {
    async function getData() {
      try {
        const OptionsAuthorData = await fetchAuthors();
        setAuthordata(OptionsAuthorData);

        const OptionsTagsData = await fetchTags();
        setTagsdata(OptionsTagsData);
      } catch (err) {
        console.error("Error fetching author or tags data:", err);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    props.updateData(componentData);
  }, [componentData]);

  const isTSDataSelected = componentData.isTSData && componentData.isTSData.length > 0;

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-28 overflow-visible">
      
      {/* Block Header */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
            Dataset Details & Metadata
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Define metadata tags, taxonomy hierarchy, and grid values.</p>
        </div>
      </div>

      {/* Sector Hierarchy Filter */}
      <div className="bg-slate-50/60 p-3.5 rounded-lg border border-slate-200/80 relative z-20">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-2">
          Sector & Taxonomy Hierarchy
        </label>
        <SectorHierarchyDropDown 
          preSelectedData={initialData.sectorChain} 
          options={SecSubdata} 
          onSelect={getSectorFilters} 
        />
      </div>

      {/* Primary Data Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data Name */}
        <div className="space-y-1.5">
          <label htmlFor="dataName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Data Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="dataName"
            id="dataName"
            placeholder="e.g. India Energy Consumption Q3"
            value={componentData.dataName || ""}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none font-medium"
            onChange={assignFormData}
          />
        </div>

        {/* Source URL */}
        <div className="space-y-1.5">
          <label htmlFor="sourceURL" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Source URL
          </label>
          <input
            type="text"
            name="sourceURL"
            id="sourceURL"
            placeholder="https://..."
            value={componentData.sourceURL || ""}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none font-mono"
            onChange={assignFormData}
          />
        </div>
      </div>

      {/* Overview of Data with Token Trigger */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="dataDesc" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Overview of Data
          </label>
          <span className="text-[10px] text-slate-400 font-mono">Type <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{`{{`}</code> for tokens</span>
        </div>
        
        <div className="relative">
          <textarea
            name="dataDesc"
            id="dataDesc"
            rows={3}
            placeholder="Describe the dataset..."
            value={componentData.dataDesc || ""}
            onChange={handleDataDescChange}
            onKeyDown={handleDataDescKeyDown}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none leading-relaxed font-normal"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Inline Token Selection Overlay */}
          {showTemplateDropdown && (
            <div className="absolute z-50 mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Insert Token Option
              </div>
              {templateOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-xs font-mono text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-between cursor-pointer"
                  onClick={() => handleTemplateSelect(opt.value)}
                >
                  <span className="font-semibold text-slate-900">{opt.value}</span>
                  <span className="text-[10px] text-slate-400">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Description */}
      <div className="space-y-1.5">
        <label htmlFor="seoDesc" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
          SEO Meta Description
        </label>
        <textarea
          name="seoDesc"
          id="seoDesc"
          rows={2}
          placeholder="Brief SEO summary for engine crawlers..."
          value={componentData.seoDesc || ""}
          onChange={assignFormData}
          className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2.5 text-xs text-slate-900 transition outline-none leading-relaxed font-normal"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      </div>

      {/* Dropdown Filters & Publication Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 relative z-30">
        {/* Publication Month/Year */}
        <div className="space-y-1.5">
          <label htmlFor="year" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Data Published On
          </label>
          <input
            type="month"
            name="year"
            id="year"
            value={componentData.year || ""}
            onChange={assignFormData}
            className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 rounded-lg p-2 text-xs text-slate-900 transition outline-none font-mono"
          />
        </div>

        {/* Authors Multi-Select */}
        <div className="space-y-1.5 relative z-40">
          <label htmlFor="authors" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Authors
          </label>
          <div className="text-slate-900 font-medium">
            <SingleDropDown
              isMulti={true}
              options={Authordata}
              placeholder={author_placeholder}
              selectedValue={componentData.authors || null}
              onSelect={(data) => getDropDownData("authors", data)}
            />
          </div>
        </div>

        {/* Tags Multi-Select */}
        <div className="space-y-1.5 relative z-40">
          <label htmlFor="tags" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Tags
          </label>
          <div className="text-slate-900 font-medium">
            <SingleDropDown
              options={Tagsdata}
              isMulti={true}
              selectedValue={componentData.tags || null}
              onSelect={(data) => getDropDownData("tags", data)}
            />
          </div>
        </div>
      </div>

      {/* Structured Data Table Container */}
      <div className="pt-4">
        <div className="border-t border-slate-100 pt-4 mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
            Structured Data Table
          </h4>
        </div>

        {/* Enforces high-contrast dark text inside table inputs & cells */}
        <div className="bg-slate-50/70 p-4 border border-slate-200 rounded-xl overflow-x-auto text-slate-900 space-y-4 shadow-2xs [&_input]:text-slate-900 [&_input]:font-medium [&_td]:text-slate-900 [&_th]:text-slate-900">
          <div className="min-w-full text-slate-900 font-medium">
            <RenderEditableGrid oldTableData={componentData.tableData} onSave={saveTable} />
          </div>
        </div>
      </div>

      {/* Dataset Configurations (Elevated z-index and bottom padding so dropdowns expand fully) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 relative z-50">
        
        {/* Units */}
        <div className="space-y-1.5 relative z-50">
          <label htmlFor="units" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Units
          </label>
          <div className="text-slate-900 font-medium">
            <SingleDropDown
              options={UnitsData}
              isMulti={false}
              selectedValue={componentData.units || null}
              onSelect={(data) => getSingleDropDownData("units", data)}
            />
          </div>
        </div>

        {/* Granularity */}
        <div className="space-y-1.5 relative z-50">
          <label htmlFor="granularity" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Granularity
          </label>
          <div className="text-slate-900 font-medium">
            <SingleDropDown
              options={GranularityData}
              isMulti={false}
              selectedValue={componentData.granularity || null}
              onSelect={(data) => getSingleDropDownData("granularity", data)}
            />
          </div>
        </div>

        {/* Is Time Series (MANDATORY FIELD) */}
        <div className="space-y-1.5 relative z-50">
          <label htmlFor="isTSData" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1">
            <span>Is Time Series</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className={`text-slate-900 font-medium rounded-lg ${!isTSDataSelected ? ' ring-rose-400' : ''}`}>
            <SingleDropDown
              options={isTSData}
              isMulti={true}
              selectedValue={componentData.isTSData || null}
              onSelect={(data) => getDropDownData("isTSData", data)}
            />
          </div>
          
        </div>

        {/* Geography */}
        <div className="space-y-1.5 relative z-50">
          <label htmlFor="geo" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            Geography
          </label>
          <div className="text-slate-900 font-medium">
            <SingleDropDown
              options={GeoData}
              isMulti={true}
              selectedValue={componentData.geo || null}
              onSelect={(data) => getDropDownData("geo", data)}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default TextWithGrid;