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
        /* Text visibility */
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

        /* Handsontable menus/editors */
.handsontable .htContextMenu,
.handsontable .htDropdownMenu,
.handsontable .htAutocompleteEditor,
.handsontable .htCellEditor,
.htContextMenu {
  z-index: 999999 !important;
}
      `}</style>

      <div className="w-full bg-white rounded-lg border border-slate-200  p-1 shadow-2xs">
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
          preventOverflow="horizontal"
          dropdownMenu={true}
          persistentState={true}
          multiColumnSorting={true}
          manualColumnResize={true}
          manualColumnResizeMode="fit"
          mergeCells={true}
          licenseKey="non-commercial-and-evaluation"
          contextMenu={[
            'row_above', 
            'row_below', 
            'remove_row', 
            'col_left', 
            'col_right', 
            'remove_col',
            '---------',
            'undo',
            'redo'
          ]}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 font-mono">
          Right-click table cells to open edit menu
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>Save Table</span>
        </button>
      </div>
    </div>
  );
}