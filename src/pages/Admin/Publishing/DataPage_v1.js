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
  const GeoData = { "options_list": ["India", "Global", "MENA"] };
  const [loading, setLoading] = useState(false);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);
  const [ComponentsArray, setComponentsArray] = useState([]);
  const [txtComponents, setTxtComponents] = useState([]);
  const [apiCallTrigger, setApiCallTrigger] = useState(false);

  const addComponentToArray = (compName, componentData) => {
    const newComp = { id: Date.now(), compName, componentData };
    setComponentsArray((prev = []) => {
      if (compName === "pageHeader") {
        return [newComp, ...prev.filter(comp => comp.compName !== "pageHeader")];
      } else {
        return [...prev, newComp];
      }
    });
  };

  /// Fetch ReportList based on sectorChain
  const fetchReportList = async () => {
    console.log("Fetch Data by ReportList: ", sectorChain);
    try {
      const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
      setReportList(data || []);
    } catch (err) {
      console.error("Error fetching report list:", err);
    }
  };

  /// Fetch all details of selected Report Entity
  const getSelectedReportDetails = async (data) => {
    if (!data?.value) return;
    const payload = { ...sectorChain, data: data.value };
    try {
      const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
      if (Report_Data != null) {
        addComponentToArray("txtGrid", Report_Data);
      }
    } catch (err) {
      console.error("Error fetching report entity details:", err);
    }
  };

  useEffect(() => {
    console.log("ComponentsArrayCheck: ", ComponentsArray);
  }, [ComponentsArray]);

  const removeComponentFromArray = (id) => {
    setComponentsArray((prev) => prev.filter((comp) => comp.id !== id));
  };

  /// Callback function from TxtWithTitle Component
  const getTextWithTitleData = (id, data) => {
    setComponentsArray((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, componentData: data } : comp
      )
    );
  };

  useEffect(() => {
    if (txtGrdComponents && txtGrdComponents.length > 0) {
      const newAggData = txtGrdComponents.reduce((acc, item) => {
        acc[`txtGrid_${item.id}`] = item.data;
        return acc;
      }, {});
      setAggPageData((prev) => ({ ...prev, ...newAggData }));
    }
  }, [txtGrdComponents]);

  useEffect(() => {
    async function getData() {
      try {
        const OptionsSub1actualData = await fetchSetorSubOptions();
        setSecSubdata(OptionsSub1actualData || []);

        const OptionsAuthorData = await fetchAuthors();
        setAuthordata(OptionsAuthorData || []);

        const OptionsTagsData = await fetchTags();
        setTagsdata(OptionsTagsData || []);
      } catch (err) {
        console.error("Error initializing options:", err);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    setAggPageData((prev) => ({ ...prev, pageHeader: pageHeaderData }));
  }, [pageHeaderData]);

  const getDropDownData = (field, data) => {
    if (Array.isArray(data)) {
      setPageHeaderData({ ...pageHeaderData, [field]: data.map((item) => item.value) });
    }
  };

  const getSectorFilters = (data) => {
    setSectorChain({ ...sectorChain, sectorChain: data });
    setPageHeaderData({ ...pageHeaderData, sectorChain: data });
  };

  const assignFormData = (e) => {
    e.persist();
    setPageHeaderData({ ...pageHeaderData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    addComponentToArray("pageHeader", pageHeaderData);
    setApiCallTrigger(true);
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
        .catch(err => {
          console.error("Publishing error:", err);
        })
        .finally(() => {
          setLoading(false);
          setApiCallTrigger(false);
        });
    }
  }, [apiCallTrigger, backendAPI, ComponentsArray]);

  const handleResetForm = () => {
    setComponentsArray([]);
    setPageHeaderData({});
    setResponse(null);
  };

  if (SecSubdata.length === 0 || Authordata.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">INITIALIZING PAGE PUBLISHING ENGINE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Top Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
            PG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Data Page Publishing Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Construct, link reports and assemble structured page entities</p>
          </div>
        </div>

        {/* Header Telemetry Pill */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md">
            <span className="text-slate-400">STACKED MODULES:</span>
            <span className="font-semibold text-slate-900">{ComponentsArray.length}</span>
          </div>
        </div>
      </header>

      {/* Main Studio Body Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto">
        
        {/* Left Control Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200/80 p-5 shrink-0 flex flex-col gap-5 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          
          {/* Card 1: Text With Grid Importer */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Text With Grid</span>
              <span className="text-[10px] font-mono bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
                Report Link
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500">Filter hierarchy to retrieve report lists and attach immutable data grids.</p>

            <div className="space-y-2 bg-white p-2.5 rounded-lg border border-slate-200/60">
              <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
            </div>

            <button
              onClick={fetchReportList}
              className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <i className="bi bi-download text-xs"></i>
              <span>Fetch Report List</span>
            </button>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select Report</label>
              <SingleDropDown_v1
                options={reportList}
                onSelect={getSelectedReportDetails}
              />
            </div>
          </div>

          {/* Card 2: Text With Title Block Generator */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Text With Title</span>
              <span className="text-[10px] font-mono bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded">
                Section Block
              </span>
            </div>

            <p className="text-[11px] text-slate-500">Inject custom title, structured paragraphs, and textual commentary.</p>

            <button
              onClick={() => addComponentToArray("txtWithTitle", {})}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <i className="bi bi-plus-circle text-xs"></i>
              <span>+ Add Text Section</span>
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>ENGINE: V1_STABLE</span>
            <span className="text-emerald-600">READY</span>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 p-6 space-y-5 overflow-y-auto min-h-[calc(100vh-57px)]">
          
          {/* Main Action Bar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Page Entity Configuration</h2>
              <p className="text-xs text-slate-500">Provide page-level metadata, SEO attributes, and order stacked sections</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium transition shadow-2xs"
              >
                Reset Page
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="bi bi-cloud-arrow-up text-xs"></i>
                )}
                <span>{loading ? "Publishing..." : "Submit Form"}</span>
              </button>
            </div>
          </div>

          {/* Response Notification Banner */}
          {response && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 relative shadow-2xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="bi bi-check-circle-fill text-xs"></i>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900">{response.Status || "Page Published Successfully"}</h4>
                  {response.URLSlug && (
                    <p className="text-xs font-mono text-emerald-700 mt-0.5">
                      URL Slug: <span className="underline">{response.URLSlug}</span>
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setResponse(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Loader Overlay State */}
          {loading && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xs space-y-3">
              <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={80} height={60} />
              <p className="text-xs font-mono text-slate-500 tracking-wider">UPLOADING DATA PAGE & GENERATING PAYLOAD...</p>
            </div>
          )}

          {/* Form Fields: Page Specific Info */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                1. Page Specific Info
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">HEADER METADATA</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Sector Dropdown */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Sector Hierarchy</label>
                <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
                </div>
              </div>

              {/* Page Name */}
              <div className="space-y-1">
                <label htmlFor="pageName" className="text-[11px] font-medium text-slate-700">
                  Page Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pageName"
                  id="pageName"
                  placeholder="e.g. India Telecom Sector Telemetry Page"
                  onChange={assignFormData}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Page Data Description */}
              <div className="space-y-1">
                <label htmlFor="pageDataDesc" className="text-[11px] font-medium text-slate-700">
                  Page Data Description
                </label>
                <textarea
                  name="pageDataDesc"
                  id="pageDataDesc"
                  rows={4}
                  placeholder="Enter page summary or analytical commentary..."
                  onChange={assignFormData}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Description for SEO */}
              <div className="space-y-1">
                <label htmlFor="pageSeoDesc" className="text-[11px] font-medium text-slate-700">
                  Description for SEO
                </label>
                <input
                  type="text"
                  name="pageSeoDesc"
                  id="pageSeoDesc"
                  placeholder="Meta description for search engine indexers..."
                  onChange={assignFormData}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Tags Dropdown */}
              <div className="space-y-1">
                <label htmlFor="tags" className="text-[11px] font-medium text-slate-700">
                  Categorization Tags
                </label>
                <SingleDropDown
                  options={Tagsdata}
                  isMulti={true}
                  onSelect={(data) => getDropDownData("tags", data)}
                />
              </div>
            </div>
          </div>

          {/* Dynamically Stacked Section Array */}
          {ComponentsArray !== null && ComponentsArray.length > 0 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200/80 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
                  2. Stacked Content Modules ({ComponentsArray.length})
                </h3>
              </div>

              {ComponentsArray.map((comp, index) => {
                if (comp.compName === "txtGrid") {
                  return (
                    <div
                      key={comp.id}
                      className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition hover:border-slate-300"
                    >
                      <div className="bg-[#f8f9fa] border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-800">Immutable Text & Data Grid</span>
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 rounded">
                            Report Data
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <TextWithGridImmutable
                          id={comp.id}
                          initialData={comp.componentData}
                          onRemove={removeComponentFromArray}
                        />
                      </div>
                    </div>
                  );
                }

                if (comp.compName === "txtWithTitle") {
                  return (
                    <div
                      key={comp.id}
                      className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition hover:border-slate-300"
                    >
                      <div className="bg-[#f8f9fa] border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-800">Text & Title Section</span>
                          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-1.5 rounded">
                            Custom Section
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <TextWithTitle
                          id={comp.id}
                          index={index + 1}
                          updateData={(id, data) => getTextWithTitleData(id, data)}
                          onRemove={removeComponentFromArray}
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Empty Canvas Placeholder */}
          {ComponentsArray.length === 0 && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-white/50 space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-sm">
                <i className="bi bi-stack"></i>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">No Stacked Content Modules</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Fetch report lists or add custom text sections from the left control sidebar to attach modules to this page entity.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DataPagePublishingForm;