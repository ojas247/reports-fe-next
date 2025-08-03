// pages/csv-grid.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Dynamically import DataGrid so it only runs in the browser:
const DataGrid = dynamic(
  () => import('react-data-grid').then((mod) => mod.default),
  { ssr: false }
);

export default function CsvGridPage({ headers, rows, bucketUrl }) {
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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">CSV Data from GCS</h1>
      <div className="flex p-2 m-0 justify-end">
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

export async function getServerSideProps() {

  // Make API call to fetch data
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const apiResponse = await fetch(`${backendAPI}/api/data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!apiResponse.ok) {
    console.error('API call failed:', apiResponse.status);
    return { notFound: true }; 
  }

  const apiData = await apiResponse.json();
  // 1) URL of your CSV in GCS
  const bucketUrl =
    'https://storage.googleapis.com/marketreports/Data/Datanameerfretest';

  // 2) Fetch and parse
  const res = await fetch(bucketUrl);
  if (!res.ok) {
    console.error('Failed to fetch CSV:', res.status);
    return { notFound: true };
  }
  const text = await res.text();
  // const lines = text.trim().split('\n').map(l => l.split(','));
  const lines = text
  .trim()
  .split('\n')
  .map(line =>
    line
      .split(',')
      .map(cell => cell.replace(/"/g, '')) // ← Remove all double quotes
  );

  // 3) Separate header row and data rows
  const [headerRow, ...dataRows] = lines;

  return {
    props: {
      bucketUrl,
      headers: headerRow,
      rows: dataRows
    }
  };
}
