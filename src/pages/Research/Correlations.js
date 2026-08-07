'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CoCharts from './../../components/UtilityComponents/Correlations/CoCharts';
import SingleDropDown from './../../components/UtilityComponents/SingleDropdown';
import SectorHierarchyDropDown from '../../components/Functionalities/Admin/SectorHierarchyDropDown';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';
import { fetchSetorSubOptions, fetchDataFromPostApi } from '../../pages/api/Api';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Correlations() {
  const initialData = {};
  const router = useRouter();
  const isFirstRun = useRef(true);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [SecSubdata, setSecSubdata] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSub1, setSelectedSub1] = useState('');
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
      alert('Please login to access product-based services.');
      router.push('/Login');
      return;
    }

    async function getData() {
      try {
        const OptionsSub1actualData = await fetchSetorSubOptions();
        setSecSubdata(OptionsSub1actualData || []);
      } catch (error) {
        console.error('Failed to fetch sector options:', error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [router]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetchDataFromPostApi(selectedDataItems, `getTSdata`);
        setDatasetResponses(response || []);
      } catch (error) {
        console.error('Error fetching correlation time series data:', error);
      }
    };
    if (selectedDataItems.length > 0) {
      fetchData();
    } else {
      setDatasetResponses([]);
    }
  }, [selectedDataItems]);

  useEffect(() => {
    if (isFirstRun.current) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetchDataFromPostApi(selectedDSName, `listOfDataItems`);
        setListOfDataItems(response || []);
      } catch (error) {
        console.error('Error fetching data items:', error);
      }
    };

    if (selectedDSName.length > 0) {
      fetchData();
    }
  }, [selectedDSName]);

  const getSectorFilters = async (data) => {
    if (data && Object.keys(data).length > 0) {
      if (data.sector) setSelectedSector(data.sector);
      if (data.sub1) setSelectedSub1(data.sub1);
      const resp = await fetchDataFromPostApi(data, `listOfDatasets_v1`);
      setListOfDatasets(resp || []);
    }
  };

  const getItemFilter = (data) => {
    setSelectedDSName([data]);
  };

  const getDataSetFilter = async (newOptions) => {
    const prevValues = selectedOptions.map((opt) => opt.value);
    const newValues = newOptions?.map((opt) => opt.value) || [];

    const added = newValues.filter((val) => !prevValues.includes(val));
    const removed = prevValues.filter((val) => !newValues.includes(val));

    for (const datasetName of added) {
      const payload = { item: datasetName, sub1: selectedSub1, sector: selectedSector };
      setSelectedDataItems((prev) => [...prev, payload]);
    }

    if (removed.length > 0) {
      setSelectedDataItems((prev) =>
        prev.filter((item) => !removed.includes(item.item))
      );
    }

    setSelectedOptions(newOptions || []);
  };

  // Render auth loading spinner
  if (loading || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-600"></span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-600">Loading Correlation Engine...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Title Section */}
        <div className="border-b border-slate-200/80 pb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Correlate Datasets</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare time series metrics across sectors and dataset categories.
          </p>
        </div>

        {/* Filter Configuration Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Filter 1: Sector Hierarchy */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4">
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Sector / Sub-Sector
              </label>
              <SectorHierarchyDropDown
                preSelectedData={initialData.sectorChain}
                options={SecSubdata}
                onSelect={getSectorFilters}
              />
            </div>

            {/* Filter 2: Category Selector */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4">
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Dataset Category
              </label>
              <SingleDropDown options={listOfDatasets} onSelect={getItemFilter} />
            </div>

            {/* Filter 3: Multi-Select Items */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4">
              <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                Data Items
              </label>
              <SingleDropDown
                isMulti={true}
                options={listOfDataItems}
                onSelect={getDataSetFilter}
              />
            </div>

          </div>

          {/* Active Data Items Tags */}
          {selectedOptions?.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">
                Selected:
              </span>
              {selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-2xs"
                >
                  <i className="bi bi-graph-up text-[10px] text-emerald-400"></i>
                  {opt.value}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Dynamic Display Area: Chart or Empty State */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-2xs min-h-[420px] flex flex-col justify-center">
          {datasetResponses.length > 0 ? (
            <CoCharts apiData={datasetResponses} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <i className="bi bi-diagram-2 text-xl"></i>
              </div>
              <p className="text-xs font-semibold text-slate-800">No Dataset Correlation Active</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Select a sector category and choose data items from the controls above to populate comparative charts.
              </p>
              <div className="mt-6 opacity-75">
                <Image
                  src="https://storage.googleapis.com/marketreports/Brand/Website/detectiveSearching.jpg"
                  alt="No reports found"
                  className="w-48 h-auto rounded-xl border border-slate-200"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}