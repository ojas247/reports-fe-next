"use client";

import { useRef, useMemo, useCallback } from "react";
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react-wrapper';

registerAllModules();

export default function RenderEditableGrid({ oldTableData, onSave, onUpdate }) {
  const hotRef = useRef(null);

  const safeData = useMemo(() => {
    return oldTableData && oldTableData.length > 0
      ? oldTableData.map((row) => [...row])
      : Array.from({ length: 5 }, () => Array(5).fill(""));
  }, [oldTableData]);

  const handleSave = useCallback(() => {
    if (hotRef.current && hotRef.current.hotInstance) {
      const instance = hotRef.current.hotInstance;
      const newData = instance.getData();
      console.log("Table Data Saved:", newData);
      if (onSave) onSave(newData);
    }
  }, [onSave]);

  return (
  <div className="w-full space-y-3 font-sans">

    <style jsx global>{`
      .handsontable td,
      .handsontable th,
      .handsontable input {
        color: #0f172a !important;
        font-size: 12px !important;
        font-family: inherit !important;
      }

      .handsontable th {
        background-color: #f8fafc !important;
        color: #475569 !important;
        font-weight: 700 !important;
        border-color: #e2e8f0 !important;
      }

      .handsontable td {
        border-color: #cbd5e1 !important;
      }

      .handsontable .htBorder.current {
        background-color: #2563eb !important;
      }

      .ht_master .wtHolder {
        width: 100% !important;
        max-width: 100% !important;
      }

      .htContextMenu,
      .htDropdownMenu,
      .htAutocompleteEditor,
      .htCellEditor {
        z-index: 999999 !important;
      }
    `}</style>

    <div
      className="w-full bg-white rounded-lg border border-slate-200 p-1 shadow-2xs"
      style={{
        overflow: 'visible',
      }}
    >
      <HotTable
        ref={hotRef}
        data={safeData}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        width="100%"
        stretchH="all"
        autoWrapRow={true}
        autoWrapCol={true}
        manualRowMove={true}
        dropdownMenu={true}
        persistentState={true}
        multiColumnSorting={true}
        manualColumnResize={true}
        manualColumnResizeMode="fit"
        mergeCells={true}
        contextMenu={true}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>

    <div className="flex items-center justify-between pt-1">
      <span className="text-[11px] text-slate-400 font-mono">
        Right-click table cells to open edit menu
      </span>

      <button
        type="button"
        onClick={handleSave}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all cursor-pointer"
      >
        <span>Save Table</span>
      </button>
    </div>

  </div>
);
}