'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from 'react-data-grid';
import 'react-data-grid/lib/styles.css'; // Don't forget the CSS
import axios from 'axios';

export default function SubmitGrid(props) {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const reportName = props.dataName;

  /**
   * Handles pasted data, using the first row as headers.
   */
  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardText = event.clipboardData.getData('Text');
    if (!clipboardText) return;

    const lines = clipboardText.trim().split('\n');
    // Exit if there's no content to parse
    if (lines.length === 0) return;

    // --- KEY CHANGE STARTS HERE ---

    // 1. The first line is our header. The rest are data rows.
    const headerLine = lines[0];
    const dataLines = lines.slice(1);

    // 2. Create column definitions from the header line.
    const headerValues = headerLine.split('\t');
    const newColumns = headerValues.map((headerName, index) => ({
      key: `col${index + 1}`, // A stable, programmatic key
      name: headerName.trim() || `Column ${index + 1}`, // Use the header name, with a fallback
      editable: true,
    }));

    // 3. Parse the remaining lines into row data.
    const parsedRows = dataLines.map((line) => {
      const values = line.split('\t');
      const newRow = {};
      // Important: Use the `newColumns` array to build the row object dynamically
      // This ensures each row has the correct keys (`col1`, `col2`, etc.)
      newColumns.forEach((col, index) => {
        newRow[col.key] = values[index] || '';
      });
      return newRow;
    });

    // --- KEY CHANGE ENDS HERE ---

    // 4. Update the state for both columns and rows in a single render.
    setColumns(newColumns);
    setRows(parsedRows);

  };

  useEffect(() => {
    const csv = convertToCSV(rows);
    // const blob = new Blob([csv], { type: 'text/csv' }); // THis was the old way
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' }); // This is the new way

    const formData = new FormData();
    formData.append('file', blob, reportName);
    props.gridData(formData);
  }, [rows, columns]);

  const convertToCSV = (data) => {
    // We use the column *name* for the CSV header now, which is more user-friendly.
    const header = columns.map(col => `"${col.name.replace(/"/g, '""')}"`).join(',');
    const body = data.map(row =>
      columns.map(col => `"${(row[col.key] || '').toString().replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');
    return `${header}\n${body}`;
  };

  return (
    <div className="p-4" onPaste={handlePaste}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Paste or Build Your Data</h2>
          <p className="text-sm text-gray-500">
            Paste from a spreadsheet. <strong>The first row will be used as column headers.</strong>
          </p>
        </div>

      </div>

      <div className="border border-gray-300 rounded overflow-x-auto">
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={setRows}
          className="rdg-light"
        />
        {columns.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Paste data from Excel or Google Sheets to get started.
          </div>
        )}
      </div>
      {/* <button
        onClick={handleSubmit}
        disabled={rows.length === 0 || columns.length === 0}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Submit Data
      </button> */}
    </div>
  );
}