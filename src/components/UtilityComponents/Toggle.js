'use client'

import React, { useState, useEffect } from 'react';
import styles from '../../styles/toggle.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Toggle = (props) => {
    const backendAPI = process.env.REACT_APP_backendAPI;
    const router = useRouter();
    const drowdownOptions = props.options
    const header = props.header
    const [isOpen, setIsOpen] = useState(true);
    const [AuthToken, setAuthToken] = useState(null);
    const filter_options_json = {};

    useEffect(() => {
        const tokenString = sessionStorage.getItem("token");
        const tokenData = JSON.parse(tokenString);
        const token = tokenData.value;
        setAuthToken(token); 
    }, []);


    // Function to toggle the dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const searchReports = (kind, value) => {
        filter_options_json['sector_filters'] = { "sub1": value, "year": null, "author": null, "tags": null };
        console.log(kind, value);
        axios.get(`${backendAPI}/SearchReportWithKind?kind=${kind}&value1=${value}`,
            {
                headers: {
                    "Authorization": `Bearer ${AuthToken}`,
                }
            })
            .then(res => {
                console.log("API: ", `${backendAPI}/SearchReportWithKind?kind=${kind}&value1=${value}`)
                console.log("resData:", res.data);
                const ReportFilterProps = res.data;
                if (ReportFilterProps.message === "Update plan") {
                    console.log(ReportFilterProps.message)
                    router.push('/Pricing', { state: {} })
                } else {
                    router.push('/ReportResult', { state: { ReportFilterProps, filter_options_json } })
                }
            })
    }

    return (
        <div className={styles.leftPaneSearchResultParent} >
            {/* Button to toggle the dropdown */}
            <button onClick={toggleDropdown}>
                <div className={styles.leftPaneHeaderBg}>
                    <div className={styles.iconContainer}><i className="bi bi-arrow-bar-down"></i></div>
                            <div className={styles.sectorContainer}> {header} </div>
                </div>
            </button>



            {/* Dropdown content */}
            {
                isOpen && (
                    <div>
                        <ul className={styles.subheaderList}>
                            {drowdownOptions.map(option => (
                                <div className={styles.subHeader}>
                                    <li className={styles.liName}>
                                        <small onClick={() => searchReports(option.Kind, option.Key)}>{option.Key}</small>
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div >
    );
}

export default Toggle;
