import React from "react";
import Link from "next/link";
import styles from "../../styles/UtilityComps/reportTile.module.css";

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

  return (
    <div className={`${styles.card} w-full max-w-3xl mx-auto`}>
      <div className={styles.cardContent}>

        <div className={styles.cardTopRow}>
          <div className={styles.cardTitle}>
            <p className="text-sm font-semibold text-slate-800">
              <span className="font-bold">{tileName}: </span>

              <Link
                href={pageURL || "#"}
                className="text-indigo-600 hover:underline"
              >
                {reportName}
              </Link>
            </p>
          </div>

          <div className={styles.counterTile}>
            {index + 1}
          </div>
        </div>

        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-app"></i>
            </div>

            <div>
              <b>Sector: </b>
              {sector}
            </div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-app-indicator"></i>
            </div>

            <div>
              <b>Sub-Sector: </b>
              {sub1}
            </div>
          </div>
        </div>

        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-calendar4-week"></i>
            </div>

            <div>
              <b>Published Year: </b>
              {year}
            </div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-pencil-square"></i>
            </div>

            <div>
              <b>Author(s): </b>
              {authors}
            </div>
          </div>
        </div>

        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-calendar4-week"></i>
            </div>

            <div>
              <b>Published On: </b>
              {publishedTS}
            </div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-arrow-repeat"></i>
            </div>

            <div>
              <b>Updated On: </b>
              {updatedTS}
            </div>
          </div>
        </div>

        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-speedometer2"></i>
            </div>

            <div>
              <b>Granularity: </b>
              {granularity}
            </div>
          </div>

          <div></div>
        </div>

        {(sourceURL || reportURL !== "#") && (
          <div className={styles.cardParametersContainer}>
            {sourceURL && (
              <div className={styles.cardParameters}>
                <div className={styles.rptTileIcon}>
                  <i className="bi bi-link-45deg"></i>
                </div>

                <div>
                  <b>Data Source: </b>
                  <a
                    href={sourceURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Link
                  </a>
                </div>
              </div>
            )}

            {reportURL !== "#" && (
              <div className={styles.cardParameters}>
                <div className={styles.rptTileIcon}>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>

                <div>
                  <b>Get Dataset: </b>
                  <a
                    href={reportURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ReportTile;