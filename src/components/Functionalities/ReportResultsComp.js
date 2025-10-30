'use client';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import ReportTile from "../UtilityComponents/ReportTile";
import Image from 'next/image';


const ReportResultsComp = (props) => {
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0; // Utility function to check if an object is empty
    const router = useRouter();
    const hasMounted = useRef(false);
    const [filteredReportsList, setFilteredReportsList] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const SearchReportsList = async () => {
        if (isEmpty(filters)) return;

        // console.log("Making API call with filters:", filters);
        const tokenString = sessionStorage.getItem("token");
        const tokenData = JSON.parse(tokenString);
        let token = null;
        if (tokenData !== null) {
            token = tokenData.value;
        } else {
            router.push('/Login');
        }
        setLoading(true);
        try {
            const response = await axios.post(`${backendAPI}/SearchReports`, filters, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-ResearchType": props.researchType
                }
            });
            const filteredReportsList = response.data;
            setFilteredReportsList(filteredReportsList);

            if (filteredReportsList.message === "Invalid Authorization") {
                router.push('/Login');
            }
            else if (filteredReportsList.message === "Update plan") {
                router.push('/pricing');
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        console.log("RepoResultComp Props: ", props.result)
        setFilters(props.result);
    }, [props.result])

    useEffect(() => {
        if (isEmpty(filters)) {
            console.log("filters is empty or null, skipping API call");
            return;
        }
        // if (!hasMounted.current) {
        //     hasMounted.current = true;
        //     console.log("skip first run");
        //     return;
        // }
        SearchReportsList();
    }, [filters]);


    if (loading) {
        return <div>Loading reports...</div>;
    }

    if (!filteredReportsList || filteredReportsList.length === 0) {
        return <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-600 text-lg text-center">
                No reports found. Please adjust your filters.
            </p>
            <div className="max-w-md w-full">
                <Image
                    src="https://storage.googleapis.com/marketreports/Brand/Website/detectiveSearching.jpg"
                    alt="No reports found"
                    className="w-full h-auto rounded-lg shadow-lg mb-4"
                    width={100}
                    height={100}
                />
            </div>

        </div>;
    }

    return (
        <>
            <ul>
                {Array.isArray(filteredReportsList) && filteredReportsList.map((item, index) => (
                    <ReportTile
                        researchType={props.researchType}
                        key={index}
                        reportName={item.ReportName}
                        index={index}
                        reportURL={item.ReportUrl}
                        reportAuthor={item.author}
                        Tags={item.tags}
                        year={item.Year}
                        sector={item.Sector}
                        sub1={item.Sub1}
                        units={item.Units}
                        sourceURL={item.Source}
                        slugURL = {item.slugURL}
                    />
                ))}
            </ul>
        </>
    );
};

export default ReportResultsComp;