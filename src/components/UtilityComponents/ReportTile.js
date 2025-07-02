import React from 'react';
import { useState } from 'react';
import styles from '../../styles/UtilityComps/reportTile.module.css';
import Link from 'next/link';

function ReportTile({ index, Tags, reportURL, reportAuthor, reportName, year, sector, sub1 }) {
  const [truncated, setTruncated] = useState(true);
  const longText = Tags;

  return (

    <div className={styles.card}>

      <div className={styles.cardContent}>
        <div className={styles.cardTopRow}>
          <div className={styles.cardTitle}>
            <p><b>Report Name: </b><Link className="ReportURL" href={reportURL}>{reportName}  </Link></p>
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
            <div><b>Publisher/Author: </b>{reportAuthor}</div>
          </div>

        </div>

        {/* <div className='card-text'>
          Tags:
        </div> */}

      </div>
    </div>
  );

}
export default ReportTile;



