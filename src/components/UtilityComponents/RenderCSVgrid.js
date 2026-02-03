// pages/csv-grid.js

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';  // Allows raw HTML in Markdown
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

  // console.log("Header: ", headers_raw, " Granularity: ", granularity, " granularityText: ", granularityText)
  const headers_v1 = formatGridHeader(headers_raw, granularityText);
  // console.log("Output from formatGridHeader: ", headers_v1);

  const processedDesc1 = desc1
    .replace(/\\n/g, '<br />') // New line
    .replace(/\\p/g, '\n\n')            // ← NEW PARAGRAPH
    .replace(/'''([^']+)'''/g, '**$1**')  // '''bold''' → **bold**
    .replace(/=([^=]+)=/g, '## $1')  // = xxx = → ## xxx (H2)
    .replace(/==([^=]+)==/g, '### $1')  // == xxx == → ### xxx (H3; change to '## $1' if you want both as H2)
    .replace(/@link-start\s*(.*?)\s*@link-end\s*@url-start\s*(.*?)\s*@url-end/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')  // Custom links to HTML
    .replace(/^[ \t]*\|\*\s*(.*)/gm, '* $1') // Look specifically for |* at the start of a line // We use [ \t]* to allow for optional spaces before the |
  return (
    <div className="p-4 space-y-0">
      <h1 className="text-2xl font-bold text-blue-900">{heading}</h1>

      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}  // Enables raw HTML (for links/bold)
        remarkPlugins={[remarkGfm]} // <--- ADD THIS for Table support
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4">{children}</h1>,  // Custom H1
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-1 mt-3">{children}</h2>,  // Custom H2
          a: ({ children, ...props }) => <a {...props} className="text-blue-600 underline">{children}</a>,  // Style links
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,  // Bold styling
          p: ({ children }) => <div className="mb-1"> {children}</div>,  // Bullet for paragraphs. Removed a • after <....>• {children}
          br: ({ node }) => <br className="my-1" />,  // Optional: Custom <br /> spacing

          // Add these three specifically for the bullets to show up
          ul: ({ children }) => <ul className="list-disc ml-6 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-6 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,

          // --- TABLE STYLING ---
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-gray-300 rounded-md">
              {/* The wrapper div above handles the outer square boundary */}
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#27406d]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-r last:border-r-0 border-blue-800 tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-700 border-b border-r last:border-r-0 border-gray-200">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-gray-50/50 last:border-b-0">
              {children}
            </tr>
          ),
        }}
      >
        {processedDesc1}
      </ReactMarkdown>



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

