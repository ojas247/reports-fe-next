
import React, { useState, useEffect } from "react";

const formatIndianNumber = (value) => {
  if (value == null || value === "") return value;
  const str = String(value).trim();

  // Only format plain numbers (skip dates/labels like "2026-05-31")
  if (!/^-?\d+(\.\d+)?$/.test(str)) return value;

  const num = Number(str);
  if (Number.isNaN(num)) return value;

  return new Intl.NumberFormat("en-IN").format(num);
};

const TextWithGridImmutable = ({ id, initialData, onRemove, onClearStaging }) => {
  const sourceUrl = initialData?.sourceURL || initialData?.SourceURL;
const [stagingTableData, setStagingTableData] = useState(
  initialData?.stagingTableData || []
);

useEffect(() => {
  setStagingTableData(initialData?.stagingTableData || []);
}, [initialData]);
  const handleClearStaging = async () => {
  try {
    if (!onClearStaging) return;

    const success = await onClearStaging(id);

    if (success) {
      setStagingTableData([]);
    }
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="relative bg-white border border-slate-200/80 shadow-2xs rounded-xl p-5 my-4 transition-all hover:border-slate-300 font-sans text-slate-900">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Immutable Grid Block
          </h2>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove && onRemove(id)}
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-md text-xs font-mono transition flex items-center gap-1 cursor-pointer"
        >
          <i className="bi bi-x-lg text-[10px]"></i>
          <span>Remove Block</span>
        </button>
      </div>

      {/* Metadata Key-Value Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs mb-5">
        <div className="flex items-start gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0 pt-0.5">Data Name:</span>
          <span className="font-medium text-slate-900">{initialData?.dataName || "N/A"}</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0 pt-0.5">Source URL:</span>
          {sourceUrl ? (
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-700 hover:text-slate-900 underline font-mono text-[11px] truncate max-w-xs"
            >
              {sourceUrl}
            </a>
          ) : (
            <span className="text-slate-400 font-mono">N/A</span>
          )}
        </div>

        <div className="flex items-start gap-2 md:col-span-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0 pt-0.5">Description:</span>
          <p className="text-slate-600 leading-relaxed text-xs">{initialData?.dataDesc || "N/A"}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Published On:</span>
          <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">{initialData?.year || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Authors:</span>
          <div className="flex flex-wrap gap-1">
            {initialData?.author?.length > 0 ? (
              initialData.author.map((auth, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                  {auth}
                </span>
              ))
            ) : (
              <span className="text-slate-400 font-mono">N/A</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {initialData?.tags?.length > 0 ? (
              initialData.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-200/50">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-slate-400 font-mono">N/A</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Units:</span>
          <span className="font-mono text-slate-800">{initialData?.units || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Granularity:</span>
          <span className="font-mono text-slate-800">{initialData?.granularity || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Is Time Series:</span>
          <span className="font-mono text-slate-700">{initialData?.isTSData?.join(", ") || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 uppercase text-[10px] w-28 shrink-0">Geography:</span>
          <span className="font-mono text-slate-700">{initialData?.geo?.join(", ") || "N/A"}</span>
        </div>
      </div>

      {/* Structured Tables Section */}
      <div className="space-y-5 pt-3 border-t border-slate-100">
        
        {/* Existing Table */}
        <div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 block mb-2">
            Existing Table Data
          </span>
          {initialData?.tableData && initialData.tableData.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {initialData.tableData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={
                        rowIndex === 0
                          ? "bg-slate-100 font-bold text-slate-800 border-b border-slate-200"
                          : "border-b border-slate-100 hover:bg-slate-50/80 transition"
                      }
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 py-2 border-r last:border-r-0 border-slate-200/80 font-mono text-[11px]"
                        >
                          {rowIndex === 0 || cellIndex === 0
                            ? cell
                            : formatIndianNumber(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">No Existing Table Data Available</p>
          )}
        </div>

        {/* Staging Table + Clear Action Button */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
              Staging Table Data
            </span>
         {stagingTableData.length > 0 && (
              <button
                type="button"
                onClick={handleClearStaging}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Staging Data</span>
              </button>
            )}
          </div>

{stagingTableData.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                {stagingTableData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={
                        rowIndex === 0
                          ? "bg-slate-100 font-bold text-slate-800 border-b border-slate-200"
                          : "border-b border-slate-100 hover:bg-slate-50/80 transition"
                      }
                    >
                      {(Array.isArray(row) ? row : [row]).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 py-2 border-r last:border-r-0 border-slate-200/80 font-mono text-[11px]"
                        >
                          {rowIndex === 0 || cellIndex === 0
                            ? cell
                            : formatIndianNumber(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">No Staging Table Data Available</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TextWithGridImmutable;