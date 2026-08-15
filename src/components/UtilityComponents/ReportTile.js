import React from "react";
import Link from "next/link";

function ReportTile({ data = {}, index = 0, researchType }) {
  const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI || "";

  const currentType = researchType || data.researchType;

  const reportName =
    data.reportName ??
    data.ReportName ??
    data.DataSet ??
    data.dataset ??
    data.dataSet ??
    data.name ??
    "Untitled";

  const year =
    data.year ??
    data.Year ??
    data.publishedYear ??
    data.PublishedYear ??
    "N/A";

  const sector =
    data.sector ??
    data.Sector ??
    "N/A";

  const sub1 =
    data.sub1 ??
    data.Sub1 ??
    data.subSector ??
    data.SubSector ??
    "N/A";

  const reportAuthor =
    data.reportAuthor ??
    data.author ??
    data.Author ??
    data.Authors ??
    data.authors ??
    [];

  const publishedTS =
    data.publishedTS ??
    data.PublishedTS ??
    "N/A";

  const updatedTS =
    data.updatedTS ??
    data.UpdatedTS ??
    data.updatedOn ??
    data.UpdatedOn ??
    "N/A";

  const granularity =
    data.granularity ??
    data.Granularity ??
    "N/A";

  const sourceURL =
    data.sourceURL ??
    data.sourceUrl ??
    data.DataSource ??
    data.dataSource ??
    data.source ??
    null;

  const reportURL =
    data.reportURL ??
    data.reportUrl ??
    data.GetDataset ??
    data.getDataset ??
    data.downloadURL ??
    data.downloadUrl ??
    "#";

  const slugURL =
    data.slugURL ??
    data.slugUrl ??
    data.slug ??
    null;

  let tileName = "Report Name";
  let pageURL = reportURL;

  if (currentType === "Data") {
    tileName = "Data Set";

    pageURL = slugURL
      ? `${frontendAPI}/DataSets/${encodeURIComponent(sector)}/${encodeURIComponent(slugURL)}`
      : reportURL;
  }

  const authors = Array.isArray(reportAuthor)
    ? reportAuthor.join(", ")
    : reportAuthor || "N/A";

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-shadow duration-200">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            <span className="font-bold">{tileName}: </span>
            <Link
              href={pageURL || "#"}
              className="text-indigo-600 hover:underline break-words"
            >
              {reportName}
            </Link>
          </p>
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
          {index + 1}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3">
        {/* Sector */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-app text-slate-400"></i>
          <span><b>Sector:</b> {sector}</span>
        </div>

        {/* Sub-Sector */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-app-indicator text-slate-400"></i>
          <span><b>Sub-Sector:</b> {sub1}</span>
        </div>

        {/* Published Year */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-calendar4-week text-slate-400"></i>
          <span><b>Published Year:</b> {year}</span>
        </div>

        {/* Author(s) */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-pencil-square text-slate-400"></i>
          <span><b>Author(s):</b> {authors}</span>
        </div>

        {/* Published On */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-calendar4-week text-slate-400"></i>
          <span><b>Published On:</b> {formatDate(publishedTS)}</span>
        </div>

        {/* Updated On */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-arrow-repeat text-slate-400"></i>
          <span><b>Updated On:</b> {formatDate(updatedTS)}</span>
        </div>

        {/* Granularity */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <i className="bi bi-speedometer2 text-slate-400"></i>
          <span><b>Granularity:</b> {granularity}</span>
        </div>

        {/* Source URL */}
        {sourceURL && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <i className="bi bi-link-45deg text-slate-400"></i>
            <span>
              <b>Data Source:</b>{" "}
              <a
                href={sourceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Link
              </a>
            </span>
          </div>
        )}

        {/* Report URL / Download */}
        {reportURL !== "#" && (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <i className="bi bi-box-arrow-up-right text-slate-400"></i>
            <span>
              <b>Get Dataset:</b>{" "}
              <a
                href={reportURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Download
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportTile;