// pages/csv-grid.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Dynamically import DataGrid so it only runs in the browser:
const DataGrid = dynamic(
  () => import('react-data-grid').then((mod) => mod.default),
  { ssr: false }
);

export default function CsvGridPage(props) {
  const headers = props.headers;
  const rows = props.rows;
  const bucketUrl = props.bucketUrl;
  const description = props.description;
  const heading = props.heading;
  const units = props.units;

  // Client-side state for grid (starts from the SSR‑provided rows)
  const [gridRows, setGridRows] = useState(() =>
    rows.map(r =>
      headers.reduce((obj, col, i) => {
        obj[col] = r[i];
        return obj;
      }, {})
    )
  );

  // Build column definitions for react-data-grid
  const columns = headers.map(col => ({
    key: col,
    name: col,
    editable: false
  }));

  return (
    <div className="p-4 space-y-0">
      <h1 className="text-2xl font-bold text-blue-900">{heading}</h1>
      {description
        .replace(/\\n/g, '\n') // Replace literal \n with actual newline
        .split(/\r?\n/)
        .map((line, idx) => (
          <div key={idx} className="mb-1">
            • {line.trim()}
          </div>
        ))}

      <div className="flex p-1 m-0 justify-end cursor-pointer">
        <a href={bucketUrl} className="text-blue-600" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-cloud-download"></i>
        </a>
      </div>

      {/* 1) SSR‑rendered HTML table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {headers.map((col) => (
                <th
                  key={col}
                  className="border px-2 py-1 bg-gray-100 text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="even:bg-gray-50">
                {row.map((cell, ci) => (
                  <td key={ci} className="border px-2 py-1 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-gray-800">{units && `Units: ${units}`}</div>
    </div>

  );
}

CsvGridPage.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  bucketUrl: PropTypes.string.isRequired
};
