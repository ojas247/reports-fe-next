"use client";

import { useEffect, useState, useRef } from "react";
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react-wrapper';
import fetchDataFromGetApi from '../../pages/api/UtilFunctions';
import Papa from 'papaparse';


registerAllModules();

export default function RenderEditableGrid({ oldTableData, onSave, onUpdate }) {
  // console.log("INcoming table: ", oldTableData);
  const hotRef = useRef(null);



  const safeData = oldTableData
    ? oldTableData.map((row) => [...row])
    : Array(5).fill(Array(5).fill("")); // 5x5 empty table

  // console.log("SafeTable: ", safeData);

  const handleSave = () => {
    const instance = hotRef.current.hotInstance;
    const newData = instance.getData(); // snapshot
    console.log("TableSave", newData);
    onSave(newData);
  };

  return (
    <>
      <HotTable
        themeName="ht-theme-main-dark-auto"
        ref={hotRef}
        // other options
        data={safeData}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        manualRowMove={true}
        dropdownMenu={true}
        persistentState={true}
        multiColumnSorting={true}
        manualColumnResize={true}
        manualColumnResizeMode="fit"
        mergeCells={true}
        // filters={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        contextMenu={['row_above', 'row_below', 'remove_row', 'col_left', 'col_right', 'remove_col']}
      //Events
      // afterChange={(changes, source) => {
      //   if (source === "loadData") return; // 👈 skip initial render
      //   handleUpdate(changes)
      // }}
      />

      <button
        onClick={() =>
          handleSave(hotRef.current.hotInstance.getData())
        }
        className="text-sm px-2 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
      >
        💾 Save Table
      </button>
    </>);
}
