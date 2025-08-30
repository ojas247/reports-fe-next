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

export default function RenderEditableGrid({ ArrayofArray, onSave, onUpdate }) {
  const myTable = ArrayofArray;
  const hotRef = useRef(null);

  const handleSave = async (e) => {
    onSave(e);
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
        //   if (source === "loadData") return; // 👈 skip initial render
        //   handleUpdate(changes)
        // }}
      />

      <button
        onClick={() =>
          handleSave(hotRef.current.hotInstance.getData())
        }
        className="text-sm"
      >
        💾 Save Table
      </button>
    </>);
}
