'use client';
import React, { useEffect, useRef, useState } from 'react';
import { fetchDataFromGetApi } from '@/pages/api/Api';
import * as d3 from 'd3';
import crossfilter from 'crossfilter2';
import * as dc from 'dc';

import 'dc/dist/style/dc.css';

const CrossFilters = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const rowChartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initCharts = async () => {
      try {
        const rawData = await fetchDataFromGetApi('getCrossFilterTSdata');
        
        // CRITICAL CHECK: Ensure refs are attached to the DOM
        if (!lineChartRef.current || !pieChartRef.current || !rowChartRef.current) {
            console.warn("Refs not ready yet");
            return;
        }

        if (!rawData || rawData.length === 0) return;

        const parseDate = d3.timeParse("%d-%m-%Y");
        const formattedData = rawData.map(d => ({
          ...d,
          date: parseDate(d.dateTime),
          value: parseFloat(d.value)
        }));

        const ndx = crossfilter(formattedData);
        const dateDim = ndx.dimension(d => d.date);
        const sectorDim = ndx.dimension(d => d.sector || "Unknown");
        const subSectorDim = ndx.dimension(d => d.subSector || "Unknown");

        const valueByDateGroup = dateDim.group().reduceSum(d => d.value);
        const valueBySectorGroup = sectorDim.group().reduceSum(d => d.value);
        const valueBySubSectorGroup = subSectorDim.group().reduceSum(d => d.value);

        // Initialize Charts - These will now find their 'parent'
        const lineChart = dc.lineChart(lineChartRef.current);
        const sectorPie = dc.pieChart(pieChartRef.current);
        const subSectorRow = dc.rowChart(rowChartRef.current);

        lineChart
          .width(600).height(300)
          .dimension(dateDim)
          .group(valueByDateGroup)
          .x(d3.scaleTime().domain(d3.extent(formattedData, d => d.date)))
          .elasticY(true)
          .renderArea(true)
          .brushOn(false)
          .renderHorizontalGridLines(true);

        sectorPie
          .width(250).height(250)
          .radius(100)
          .innerRadius(40)
          .dimension(sectorDim)
          .group(valueBySectorGroup);

        subSectorRow
          .width(300).height(250)
          .dimension(subSectorDim)
          .group(valueBySubSectorGroup)
          .elasticX(true);

        dc.renderAll();
        setLoading(false);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    initCharts();

    return () => {
      dc.deregisterAllCharts();
    };
  }, []); // Run once

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manufacturing Production Analytics</h1>
      
      {/* IMPORTANT: Do not conditionally unmount these divs based on 'loading'.
          If they disappear, dc.js loses its 'parent' container.
          Use opacity or a loading overlay instead.
      */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-20' : 'opacity-100'}`}>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Sector</h3>
          <div ref={pieChartRef}></div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Sub-Sector</h3>
          <div ref={rowChartRef}></div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Production Trend</h3>
          <div ref={lineChartRef}></div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50">
           <p className="text-xl font-bold">Loading charts...</p>
        </div>
      )}
    </div>
  );
};

export default CrossFilters;