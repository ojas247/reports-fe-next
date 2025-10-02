import React, { useState, useEffect, useRef, useMemo  } from "react";
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react-wrapper';
import RenderChartsFromCSVgrid from '../../../SEODataSets/GenericCharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import CsvGridPage from '../../../RenderCSVgrid';

// const TextWithGrid = ({ dataName, units, tableData = [] }) => {
const TextWithGrid = (props) => {
  const FRONTEND_URL = process.env.NEXT_PUBLIC_frontendAPI;

  const fetchDataSetURL = (props) => {
    const slug = props.slugURL;
    const sectorChain = props.sectorHierarchy;
    const sector = sectorChain.split("Sector/")[1].split("/")[0];
    const dataSetURL = `${FRONTEND_URL}/DataSets/${sector}/${slug}`;
    return dataSetURL;
  }
  
const propsForCsvGrid = {
  headers: props.tableData[0],
  rows: props.tableData.slice(1),
  heading: props.dataName,
  description: props.dataDesc || "",
  units: props.units,
  granularity: props.Granularity,
  bucketUrl: props.ReportUrl,
  source: props.SourceURL,
  dataSetURL: fetchDataSetURL(props)
}

return (
  <>
  <CsvGridPage {...propsForCsvGrid} />
  </>
)

};

export default TextWithGrid;
