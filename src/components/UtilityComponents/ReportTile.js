import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/UtilityComps/reportTile.module.css';

function ReportTile({ data = {}, index = 0, researchType }) {
  const [truncated, setTruncated] = useState(true);
  const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI || '';

  const {
    Tags = [],
    reportURL = '#',
    reportAuthor = [],
    reportName = 'Untitled',
    year = 'N/A',
    sector = 'N/A',
    sub1 = 'N/A',
    researchType: itemResearchType,
    units,
    sourceURL,
    slugURL,
    publishedTS = 'N/A',
    updatedTS,
    granularity = 'N/A',
  } = data;

  const currentType = researchType || itemResearchType;

  let tileName = 'Report Name';
  let pageURL = reportURL || '#';

  if (currentType === 'Data') {
    tileName = 'Data Set';
    pageURL = slugURL ? `${frontendAPI}/DataSets/${sector}/${slugURL}` : reportURL || '#';
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        
        {/* Header Row */}
        <div className={styles.cardTopRow}>
          <div className={styles.cardTitle}>
            <p className="text-sm font-semibold text-slate-800">
              <span className="font-bold">{tileName}: </span>
              <Link href={pageURL} className="text-indigo-600 hover:underline">
                {reportName}
              </Link>
            </p>
          </div>
          <div className={styles.counterTile}>
            {index + 1}
          </div>
        </div>

        {/* Sector & Sub-Sector */}
        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-app"></i>
            </div>
            <div><b>Sector: </b>{sector}</div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-app-indicator"></i>
            </div>
            <div><b>Sub-Sector: </b>{sub1}</div>
          </div>
        </div>

        {/* Year & Author */}
        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-calendar4-week"></i>
            </div>
            <div><b>Published Year: </b>{year}</div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-pencil-square"></i>
            </div>
            <div>
              <b>Author(s): </b>
              {Array.isArray(reportAuthor) && reportAuthor.length > 0 
                ? reportAuthor.join(', ') 
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Published & Granularity */}
        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-calendar4-week"></i>
            </div>
            <div><b>Updated On: </b>{publishedTS}</div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-speedometer2"></i>
            </div>
            <div><b>Granularity: </b>{granularity}</div>
          </div>
        </div>

        {/* Action Links */}
        {(units || sourceURL) && (
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

            {reportURL && (
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