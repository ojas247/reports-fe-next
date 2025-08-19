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
  const [granularityText, setGranularityText] = useState('');
  const headers = props.headers;
  const rows = props.rows;
  const bucketUrl = props.bucketUrl;
  const description = props.description || "";
  const heading = props.heading;
  const units = props.units;
  const granularity = props.granularity;

  let desc1 = description;
  let desc2 = "";
  // Look for the special marker "\p"
  const parts = description.split("\\p");  // use double \\ to escape backslash in string

  if (parts.length > 1) {
    desc1 = parts[0].trim();
    desc2 = parts.slice(1).join("\\p").trim(); // in case multiple \p exist
  }
  useEffect(() => {
    if (granularity === "Yearly") {
      setGranularityText("Financial YoY");
    } else if (granularity === "Quarterly") {
      setGranularityText("Financial QoQ");
    } else if (granularity === "Monthly") {
      setGranularityText("Monthly");
    }
  }, [granularity]);

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

      {desc1
        .replace(/\\n/g, '\n')
        .split(/\r?\n/)
        .map((line, idx) => {
          const linkRegex = /@link-start\s*(.*?)\s*@link-end\s*@url-start\s*(.*?)\s*@url-end/;
          const match = line.match(linkRegex);

          if (match) {
            const [fullMatch, linkText, url] = match;
            const beforeLink = line.substring(0, match.index);
            const afterLink = line.substring(match.index + fullMatch.length);

            return (
              <div key={idx} className="mb-1">
                • {beforeLink}
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {linkText}
                </a>
                {afterLink}
              </div>
            );
          }

          return (
            <div key={idx} className="mb-1">
              • {line}
            </div>
          );
        })}


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
      <div className="text-[10px] text-gray-800">{units && `Units: ${units}`} {granularityText && `Granularity: ${granularityText}`}</div>

      {desc2 && desc2.trim() !== "" && (
        desc2
          .replace(/\\n/g, '\n')
          .split(/\r?\n/)
          .map((line, idx) => {
            const linkRegex = /@link-start\s*(.*?)\s*@link-end\s*@url-start\s*(.*?)\s*@url-end/;
            const match = line.match(linkRegex);

            if (match) {
              const [fullMatch, linkText, url] = match;
              const beforeLink = line.substring(0, match.index);
              const afterLink = line.substring(match.index + fullMatch.length);

              return (
                <div key={idx} className="mb-1">
                  • {beforeLink}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {linkText}
                  </a>
                  {afterLink}
                </div>
              );
            }

            // fallback for normal line
            return (
              <div key={idx} className="mb-1">
                • {line}
              </div>
            );
          })
      )}

    </div>

  );
}

CsvGridPage.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  bucketUrl: PropTypes.string.isRequired
};
