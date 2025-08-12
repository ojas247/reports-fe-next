// pages/csv-grid.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CoCharts from "./../components/UtilityComponents/Correlations/CoCharts"


export default function CsvGridPage() {

 const apiData = [ { "item": "Electrified Route", "granularity": "Yearly", "x": [ "2019-02-28T18:30:00Z", "2020-02-29T18:30:00Z", "2021-02-28T18:30:00Z", "2022-02-28T18:30:00Z", "2023-02-28T18:30:00Z", "2024-02-29T18:30:00Z" ], "y": [ 34.3, 39.9, 44.8, 51.08, 58.07, 62.25 ], "units": "Kilometers" } ]
 
 return <CoCharts apiData={apiData} />
}