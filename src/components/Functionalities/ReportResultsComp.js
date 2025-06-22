'use client';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import ReportTile from "../UtilityComponents/ReportTile";


const ReportResultsComp = (props) => {
    const router = useRouter();
    const hasMounted = useRef(false);
    const [filteredReportsList, setFilteredReportsList] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const SearchReportsList = async () => {
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
        console.log("RepoResultComp Filters: ", filters)
        if (!hasMounted.current) {
            hasMounted.current = true;
            console.log("skip first run");
            return;
        }
        console.log("Making API call with filters:", filters);
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
                <img
                    src="https://storage.googleapis.com/marketreports/Brand/Website/detectiveSearching.jpg"
                    alt="No reports found"
                    className="w-full h-auto rounded-lg shadow-lg mb-4"
                />
            </div>

        </div>;
    }

    return (
        <>
            <ul>
                {filteredReportsList.map((item, index) => (
                    <ReportTile
                        key={index}
                        reportName={item.ReportName}
                        index={index}
                        reportURL={item.ReportUrl}
                        reportAuthor={item.author}
                        Tags={item.tags}
                        year={item.Year}
                        sector={item.Sector}
                        sub1={item.Sub1}
                    />
                ))}
            </ul>
        </>
    );
};

export default ReportResultsComp;