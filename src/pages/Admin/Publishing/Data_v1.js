import React, { useState, useEffect } from 'react';
import SingleDropDown_v1 from "../../../components/UtilityComponents/SingleDropdown_v1";
import CascadingDropDown from "../../../components/UtilityComponents/CascadingDropdown";
import { fetchSetorSubOptions, fetchAuthors, fetchYears, fetchTags } from "../../api/Api";
import axios from 'axios';
import styles from "../../../styles/Pages/Admin/publishing.module.css";
import Image from 'next/image';
import SubmitGrid from '../../../components/UtilityComponents/SubmitGrid';
import TextWithGrid from '../../../components/UtilityComponents/SEODataSets/TextWithGrid';
import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

const template_options = {
  options_list: [
    "Item Name - {{item(x)}}",
    "Date - {{latest0_date}}",
    "Value of Item on a Date - {{item(2)_latest(0)}}",
    "Units of data - {{units}}",
    "Category of tables - {{category}}",
    "Granularity of data in Tables - {{granularity}}",
    "Math: Division -  {{ArOps||item(1)_latest(0)/item(1)_latest(1)}}",
    "Math: Substraction - {{ArOps||item(1)_latest(0)-item(1)_latest(1)}}"
  ]
};

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
  const [apiError, setApiError] = useState(null);
  const [txtGrdComponents, setTxtGrdComponents] = useState([]);
  const [aggDataFromTxtgrdComponent, setAggDataFromTxtgrdComponent] = useState({});
  const [selectedCity, setSelectedCity] = useState("");

  /// Add new TxtGrid Component
  const addTxtGrdComponent = () => {
    setTxtGrdComponents((prev) => [...prev, { id: Date.now() }]);
  };

  /// Remove TxtGrid Component
  const removeTxtGrdComponent = (id) => {
    setTxtGrdComponents((prev) => prev.filter((comp) => comp.id !== id));
    setAggDataFromTxtgrdComponent((prev) => {
      const updated = { ...prev };
      delete updated[`txtGrid_${id}`];
      return updated;
    });
  };

  /// Callback from TxtGrid Component
  const getTextWithGridData = (id, data) => {
    setAggDataFromTxtgrdComponent((prevData) => ({
      ...prevData,
      [`txtGrid_${id}`]: data,
    }));
  };

  useEffect(() => {
    async function getData() {
      try {
        const [optionsSub1actualData, optionsAuthorData, optionsTagsData] = await Promise.all([
          fetchSetorSubOptions(),
          fetchAuthors(),
          fetchTags(),
        ]);
        setSecSubdata(optionsSub1actualData);
        setAuthordata(optionsAuthorData);
        setTagsdata(optionsTagsData);
      } catch (error) {
        console.error('Unable to load publishing options:', error);
        setApiError(`Unable to connect to the backend at ${backendAPI}. Start the backend service or update NEXT_PUBLIC_backendAPI.`);
      }
    }
    getData();
  }, [backendAPI]);

  useEffect(() => {
    setAggPageData({
      ...pageHeaderData,
      ...aggDataFromTxtgrdComponent
    });
  }, [pageHeaderData, aggDataFromTxtgrdComponent]);

  const getDropDownData = (field, data) => {
    setPageHeaderData({ ...pageHeaderData, [field]: data.map(item => item.value) });
  };

  const getSectorFilters = (data) => {
    setPageHeaderData({ ...pageHeaderData, data });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    axios.post(`${backendAPI}/Publishing/Data_v1`, aggPageData, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        console.error("Submission error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleReset = () => {
    setTxtGrdComponents([]);
    setAggDataFromTxtgrdComponent({});
    setPageHeaderData({});
    setResponse(null);
  };

  if (apiError) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="bg-white border border-rose-200 rounded-xl p-5 max-w-lg shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs uppercase tracking-wider">
            <i className="bi bi-[#x-circle-fill]"></i> Backend Connection Failed
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">{apiError}</p>
        </div>
      </div>
    );
  }

  if (SecSubdata.length === 0 || Authordata.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">INITIALIZING PUBLISHING STUDIO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
            DP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Data Publishing Engine
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Configure datasets, grid templates & structural metadata</p>
          </div>
        </div>

        {/* Global Quick Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md">
            <span className="text-slate-400">ACTIVE GRIDS:</span>
            <span className="font-semibold text-slate-900">{txtGrdComponents.length}</span>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto">
        
        {/* Left Sticky Sidebar Controls */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200/80 p-5 shrink-0 flex flex-col gap-5 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          
          {/* Action Trigger */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">
              Component Canvas
            </span>
            <button
              onClick={addTxtGrdComponent}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 shadow-2xs"
            >
              <i className="bi bi-plus-circle text-xs"></i>
              <span>Add Grid Block</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Template Variables Quick Reference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">
                Template Tokens
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Syntax Guide</span>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200/70 p-2.5 space-y-2">
              <SingleDropDown_v1 options={template_options} />
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed font-mono space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
              <p className="font-medium text-slate-700">Token Syntax Note:</p>
              <p>Use double braces <code className="text-slate-900 bg-slate-200/60 px-1 rounded">{`{{ ... }}`}</code> to bind dynamic dataset values into grid headers.</p>
            </div>
          </div>

          {/* Publishing Checklist */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>STATUS</span>
              <span className="text-emerald-600 font-medium">READY TO BUILD</span>
            </div>
          </div>
        </aside>

        {/* Right Content Workspace */}
        <main className="flex-1 p-6 space-y-5 overflow-y-auto min-h-[calc(100vh-57px)]">
          
          {/* Form Top Control Bar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Publishing Workspace</h2>
              <p className="text-xs text-slate-500">Add text-with-grid components and populate structured data payload</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium transition shadow-2xs"
              >
                Reset Canvas
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
                <span>{loading ? "Publishing..." : "Publish Data"}</span>
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
                  <h4 className="text-xs font-semibold text-emerald-900">{response.Status || "Publishing Successful"}</h4>
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

          {/* Loading Overlay State */}
          {loading && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xs space-y-3">
              <Image src="/Assets/Gifs/loading.gif" alt="Loading..." width={80} height={60} />
              <p className="text-xs font-mono text-slate-500 tracking-wider">UPLOADING DATASETS & GENERATING SCHEMAS...</p>
            </div>
          )}

          {/* Dynamic Component Cards Stack */}
          {txtGrdComponents.length > 0 ? (
            <div className="space-y-4">
              {txtGrdComponents.map((comp, index) => (
                <div
                  key={comp.id}
                  className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition hover:border-slate-300"
                >
                  {/* Card Header Bar */}
                  <div className="bg-[#f8f9fa] border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-slate-700">Text & Grid Block</span>
                    </div>

                    <button
                      onClick={() => removeTxtGrdComponent(comp.id)}
                      className="text-slate-400 hover:text-rose-600 text-xs transition flex items-center gap-1 font-mono"
                      title="Remove block"
                    >
                      <i className="bi bi-trash"></i>
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Component Inner Body */}
                  <div className="p-4">
                    <TextWithGrid
                      updateData={(data) => getTextWithGridData(comp.id, data)}
                      sectorSub1Data={SecSubdata}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State Canvas */
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-white/50 space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-sm">
                <i className="bi bi-layout-three-columns"></i>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">No Grid Blocks Added</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click "Add Grid Block" from the left panel to begin building text and dataset structures.
                </p>
              </div>
              <button
                onClick={addTxtGrdComponent}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                <i className="bi bi-plus-circle text-xs"></i>
                <span>Add Grid Block</span>
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default DataPublishingForm;