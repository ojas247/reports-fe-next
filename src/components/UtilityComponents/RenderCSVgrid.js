// pages/csv-grid.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatGridHeader } from '../../pages/api/UtilFunctions';

// Dynamically import DataGrid so it only runs in the browser:
const DataGrid = dynamic(
  () => import('react-data-grid').then((mod) => mod.default),
  { ssr: false }
);

export default function CsvGridPage(props) {
  const [granularityText, setGranularityText] = useState('');
  const headers_raw = props.headers;
  const rows = props.rows;
  const bucketUrl = props.bucketUrl;
  const description = props.description || "";
  const heading = props.heading;
  const units = props.units;
  const granularity = props.granularity;
  const source = props.source || "";
  const dataSetURL = props.dataSetURL || "";

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
    } else if (granularity === "Calendar Year") {
      setGranularityText("Calendar Year");
    }
  }, [granularity]);

  console.log("Header: ", headers_raw, " Granularity: ", granularity, " granularityText: ", granularityText)
  const headers_v1 = formatGridHeader(headers_raw, granularityText);
  console.log("Output from formatGridHeader: ", headers_v1);

 
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


      <div className="flex flex-row items-center justify-between w-full">
        {/* Left section → graph button (if any) */}
        <div className="flex flex-row gap-2">
          {dataSetURL && (
            <div className="flex p-2 m-0 cursor-pointer">
              <a
                href={dataSetURL}
                className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-0 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-[10px] text-blue-600">Visualize</span>
                <i className="bi bi-graph-up"></i>
              </a>
            </div>
          )}
        </div>

        {/* Right section → always download icon */}
        <div className="flex p-1 m-0 cursor-pointer">
          <a
            href={bucketUrl}
            className="flex items-center gap-1 text-blue-600 px-3 py-1 cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-cloud-download"></i>
          </a>
        </div>
      </div>


      {/* 1) SSR‑rendered HTML table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {headers_v1.map((col) => (
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
      <div className="flex flex-row gap-2 justify-between">
        <div className="text-[10px] text-gray-800">{units && `Units: ${units}`} {granularityText && `Granularity: ${granularityText}`}</div>
        {source && (
          <div className="text-[10px] text-gray-800 text-right">
            Source: {source}
          </div>
        )}
      </div>
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
