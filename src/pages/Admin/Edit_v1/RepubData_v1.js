'use client';

import React, { useState, useEffect } from 'react';
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import { fetchSetorSubOptions, fetchDataFromPostApi } from "../../api/Api";
import axios from 'axios';
import Image from 'next/image';
import TextWithGrid from '../../../components/UtilityComponents/SEODataSets/TextWithGrid';
import TextWithGridImmutable from '../../../components/UtilityComponents/SEODataSets/TextWithGridImmutable';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

function RepubData_v1() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  const [response, setResponse] = useState(null);
  const [sectorChain, setSectorChain] = useState({});
  const [reportList, setReportList] = useState(['select']);
  const [oldReportData, setOldReportData] = useState({});
  const [SecSubdata, setSecSubdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aggDataFromTxtgrdComponent, setAggDataFromTxtgrdComponent] = useState({});
  const [aggPageData, setAggPageData] = useState({});
  
  // Validation tracking state
  const [isFormValid, setIsFormValid] = useState(true);
  const [validationError, setValidationError] = useState('');

  const comp = { id: 1 };

  // Available template options
  const template_options = {
    options_list: [
      "mumbai",
      "delhi",
      "bangalore",
      "hyderabad",
      "chennai",
      "kolkata",
      "pune"
    ]
  };

  // Fetch initial sector dropdown options
  useEffect(() => {
    async function getData() {
      try {
        const OptionsSub1actualData = await fetchSetorSubOptions();
        setSecSubdata(OptionsSub1actualData);
      } catch (err) {
        console.error("Error fetching sector options:", err);
      }
    }
    getData();
  }, []);

  // Fetch ReportList based on sectorChain selection
  const fetchReportList = async () => {
    try {
      setLoading(true);
      const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
      setReportList(data);
    } catch (err) {
      console.error("Error fetching report list:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed data for selected report
  const getSelectedReportDetails = async (data) => {
    if (!data?.value) return;
    try {
      setLoading(true);
      const payload = { ...sectorChain, data: data.value };
      const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
      setOldReportData(Report_Data || {});
      setValidationError(''); // Reset validation messages
    } catch (err) {
      console.error("Error fetching report entity details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler to clear staging table data in backend & local state
  const handleClearStaging = async () => {
    try {
      await fetchDataFromPostApi(
        {
          dataName: oldReportData?.dataName,
          kind: "StagingData_v1",
        },
        "deleteStagingData/"
      );

      // Remove staging data from state immediately so UI updates
      setOldReportData((prev) => ({
        ...prev,
        stagingTableData: [],
      }));

      return true;
    } catch (err) {
      console.error("Error deleting staging data:", err);
      return false;
    }
  };

  // Callback to sync child TextWithGrid data and track validation state
  const getTextWithGridData = (id, data, isValid = true) => {
    setAggDataFromTxtgrdComponent((prevData) => ({
      ...prevData,
      [`txtGrid_${id}`]: data,
    }));
    
    // Update parent validation status from child evaluation
    setIsFormValid(isValid);
    if (isValid) setValidationError('');
  };

  // Keep state sync updated for submission payload
  useEffect(() => {
    setAggPageData({
      ...aggDataFromTxtgrdComponent
    });
  }, [aggDataFromTxtgrdComponent]);

  const getSectorFilters = (data) => {
    setSectorChain({ sectorChain: data });
  };

  // Form submission handler with hard validation enforcement
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Explicit Validation Check prior to submitting
    const childPayload = aggDataFromTxtgrdComponent[`txtGrid_${comp.id}`] || {};
    
    const missingFields = [];
    if (!childPayload.dataName?.trim()) missingFields.push("Data Name");
    if (!childPayload.units) missingFields.push("Units");
    if (!childPayload.granularity) missingFields.push("Granularity");
    if (!childPayload.isTSData || childPayload.isTSData.length === 0) missingFields.push("Is Time Series");
    if (!childPayload.geo || childPayload.geo.length === 0) missingFields.push("Geography");

    if (missingFields.length > 0) {
      setIsFormValid(false);
      setValidationError(`Validation Error: Please fill in all mandatory fields: ${missingFields.join(', ')}.`);
      return; // Stop submission
    }

    setLoading(true);
    setResponse(null);
    setValidationError('');

    axios.post(`${backendAPI}/RePublishing/Data_v1`, aggPageData, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        console.error("Error republishing data:", err);
        setResponse({ Status: "Error", URL: "Failed to republish data." });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setOldReportData({});
    setAggDataFromTxtgrdComponent({});
    setResponse(null);
    setValidationError('');
    setIsFormValid(true);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar Controls */}
      <aside className="w-80 shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-full z-10 shadow-xs">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800">
              Publishing Controls
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Select hierarchy parameters to retrieve datasets.</p>
        </div>

        {/* Control Groups */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          
          {/* Hierarchy Filter */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold font-mono uppercase tracking-wider text-slate-600">
              1. Taxonomy Hierarchy
            </label>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
            </div>
          </div>

          {/* Fetch Reports CTA */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold font-mono uppercase tracking-wider text-slate-600">
              2. Query Datasets
            </label>
            <button
              onClick={fetchReportList}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs py-2 px-3 rounded-lg transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="bi bi-search text-[11px]"></i>
              <span>Fetch Report List</span>
            </button>
          </div>

          {/* Report Dropdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold font-mono uppercase tracking-wider text-slate-600">
              3. Select Dataset Report
            </label>
            <SingleDropDown_v1
              options={reportList}
              onSelect={getSelectedReportDetails}
            />
          </div>

          {/* Template Options Dropdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold font-mono uppercase tracking-wider text-slate-600">
              Template Libraries
            </label>
            <SingleDropDown_v1
              options={template_options}
            />
          </div>

        </div>

      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Main Workspace Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Re-Publishing Data Studio</h1>
              <p className="text-xs text-slate-500 mt-1">Review, modify, and re-publish dataset metadata and tables.</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-mono text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Reset Studio
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-4 py-1.5 text-xs font-mono font-semibold text-white rounded-lg transition shadow-xs flex items-center gap-1.5 ${
                  isFormValid 
                    ? "bg-slate-900 hover:bg-slate-800 cursor-pointer" 
                    : "bg-slate-300 cursor-not-allowed opacity-70"
                }`}
              >
                <span>⭱ RePublish Data</span>
              </button>
            </div>
          </div>

          {/* Validation Warning Alert */}
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-800 flex items-center justify-between">
              <span>{validationError}</span>
            </div>
          )}

          {/* Dataset Views Container */}
          {Object.keys(oldReportData).length > 0 ? (
            <div className="space-y-6">
              
              {/* Editable Component View */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
                <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800">
                    Editable Input Mode
                  </span>
                  <span className="text-[10px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                    Draft Changes
                  </span>
                </div>
                <TextWithGrid
                  key={oldReportData?.dataName || comp.id}
                  updateData={(data, isValid) => getTextWithGridData(comp.id, data, isValid)}
                  sectorSub1Data={SecSubdata}
                  initialData={oldReportData}
                />
              </div>

              {/* Immutable Snapshot View */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
                <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800">
                    Original Snapshot Reference
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Read-Only
                  </span>
                </div>
                <TextWithGridImmutable
                  id={comp.id}
                  initialData={oldReportData}
                  onRemove={() => setOldReportData({})}
                  onClearStaging={handleClearStaging}
                />
              </div>

            </div>
          ) : (
            <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center bg-white/60">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <i className="bi bi-file-earmark-text text-lg"></i>
              </div>
              <p className="text-xs font-medium text-slate-700">No Dataset Selected</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Use the left sidebar hierarchy filters to fetch and load a dataset report into the workspace.
              </p>
            </div>
          )}

          {/* Loader Overlay State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 border border-slate-200 rounded-xl shadow-xs space-y-3">
              <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={64} height={50} className="opacity-80" />
              <p className="text-xs font-mono text-slate-600 font-medium">Processing Dataset Operations...</p>
            </div>
          )}

          {/* Response Notification Banner */}
          {response && (
            <div className={`p-4 rounded-xl border text-xs font-mono ${
              response.Status === "Error" 
                ? "bg-rose-50 border-rose-200 text-rose-800" 
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <div className="font-bold uppercase tracking-wider mb-1">Status: {response.Status || "Submitted"}</div>
              {response.URL && <div className="truncate text-[11px] opacity-90">{response.URL}</div>}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

export default RepubData_v1;