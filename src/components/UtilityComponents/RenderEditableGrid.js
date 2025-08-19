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

export default function IndiaStateMap({ ArrayofArray }) {
  const myTable = ArrayofArray;
  const hotRef = useRef(null);

  const saveData = async (tableData) => {
    try {
      const res = await fetch("/api/saveTable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableData),
      });
      if (res.ok) console.log("✅ Saved successfully");
      else console.error("❌ Failed to save");
    } catch (err) {
      console.error("API error:", err);
    }
  };


  return (
    <>
      <HotTable
        themeName="ht-theme-main-dark-auto"
        ref={hotRef}
        // other options
        data={myTable}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        manualRowMove={true}
        dropdownMenu={true}
        persistentState={true}
        multiColumnSorting={true}
        // filters={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        //Events
        // afterChange={(changes, source) => {
        //   console.log("Cell changed:", changes, "Source:", source);
        // }}
      />

      <button
        onClick={() =>
          saveData(hotRef.current.hotInstance.getData())
        }
      >
        💾 Save Changes
      </button>
    </>);
}
