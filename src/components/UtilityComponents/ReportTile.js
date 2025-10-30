import React from 'react';
import { useState } from 'react';
import styles from '../../styles/UtilityComps/reportTile.module.css';
import Link from 'next/link';

function ReportTile({ index, Tags, reportURL, reportAuthor, reportName, year, sector, sub1, researchType, units, sourceURL, slugURL }) {
  const [truncated, setTruncated] = useState(true);
  const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI;

  const longText = Tags;
  const reportType = researchType;
  let TileName = null;
  let Units = null;
  let SourceURL = null;
  let pageURL = null;

  if(reportType === "Reports"){
     TileName = "Report Name";
     pageURL = reportURL

  }else if(reportType === "Data"){
     TileName = "Data Set";
     Units = units;
     SourceURL = sourceURL;
     pageURL = `${frontendAPI}/DataSets/${sector}/${slugURL}`;
  }

  return (

    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.cardTopRow}>
          <div className={styles.cardTitle}>
            <p><b>{TileName}: </b><Link className="ReportURL" href={pageURL}>{reportName}  </Link></p>
          </div>
          <div className={styles.counterTile}>
            {index + 1}
          </div>
        </div>
        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}><i className="bi bi-app"></i></div>
            <div><b>Sector: </b>{sector} </div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}><i className="bi bi-app-indicator"></i></div>
            <div><b>Sub-Sector: </b>{sub1}</div>
          </div>
        </div>

        <div className={styles.cardParametersContainer}>
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
              <i className="bi bi-calendar4-week"></i></div>
            <div><b>Published Year: </b>{year} </div>
          </div>

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}><i className="bi bi-pencil-square"></i></div>
            <div><b>Publisher/Author: </b>{reportAuthor?.join(", ") || "N/A"}</div>
          </div>
        </div>

        {(units || sourceURL) && (
        <div className={styles.cardParametersContainer}>
          {/* <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}>
            <i class="bi bi-speedometer2"></i></div>
            <div><b>Units: </b>{units} </div>
          </div> */}

          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}><i class="bi bi-link-45deg"></i></div>
            <div><b>Data Source: </b><Link href={sourceURL} className='text-blue-800'>Link</Link></div>
          </div>

          
          <div className={styles.cardParameters}>
            <div className={styles.rptTileIcon}><i class="bi bi-box-arrow-up-right"></i></div>
            <div><b>Get Dataset: </b><Link href={reportURL} className='text-blue-800'>Download</Link></div>
          </div>
        </div>)}

        {/* <div className='card-text'>
          Tags:
        </div> */}

      </div>
    </div>
  );

}
export default ReportTile;



