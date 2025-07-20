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
      <h1 className="text-2xl font-bold">{heading}</h1>
      <p className="text-m text-gray-800">{description}</p>
      <div className="flex p-2 m-0 justify-end cursor-pointer">
        <i class="bi bi-cloud-download">
          <a href={bucketUrl} className="text-blue-600"></a>
        </i>
      </div>

      {/* 1) SSR‑rendered HTML table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {headers.map(col => (
                <th key={col} className="border px-2 py-1 bg-gray-100 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="even:bg-gray-50">
                {row.map((cell, ci) => (
                  <td key={ci} className="border px-2 py-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

CsvGridPage.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  bucketUrl: PropTypes.string.isRequired
};
