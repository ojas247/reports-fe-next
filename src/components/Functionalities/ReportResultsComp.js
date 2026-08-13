'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import ReportTile from "../UtilityComponents/ReportTile";
import FactsLoader from "../UtilityComponents/Tools/FactsLoader";

const ReportResultsComp = (props) => {
  const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
  const router = useRouter();
  const [filteredReportsList, setFilteredReportsList] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  const SearchReportsList = async () => {
  if (isEmpty(filters)) return;

  const tokenString = sessionStorage.getItem("token");
  const tokenData = tokenString ? JSON.parse(tokenString) : null;
  let token = null;

  if (tokenData !== null) {
    token = tokenData.value;
  } else {
    router.push('/Login');
    return;
  }

  // Build API payload explicitly.
  // Do NOT send null/unused filters.
  const payload = {
    sector_filters: filters.sector_filters || {},
  };

  if (filters.author) {
    payload.author = filters.author;
  }

  if (filters.year != null) {
    payload.year = filters.year;
  }

  if (filters.tags != null) {
    payload.tags = filters.tags;
  }

  console.log("API Payload:", payload);

  setLoading(true);

  try {
    const response = await axios.post(
      `${backendAPI}/SearchReports_v1`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-ResearchType": props.researchType,
        },
      }
    );

    const data = response.data;

    if (data?.message === "Invalid Authorization") {
      router.push('/Login');
      return;
    }

    if (data?.message === "Update plan") {
      router.push('/pricing');
      return;
    }

    setFilteredReportsList(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Error fetching reports:", error);
    setFilteredReportsList([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setFilters(props.result || {});
  }, [props.result]);

  useEffect(() => {
    if (isEmpty(filters)) return;
    SearchReportsList();
  }, [filters]);

  // FIXED: Loading state – properly centered vertically & horizontally across full parent container
  if (loading) {
    return (
      <div className="col-span-full w-full min-h-[400px] flex flex-col items-center justify-center p-8">
        <FactsLoader />
      </div>
    );
  }

  // Empty state
  if (!filteredReportsList || filteredReportsList.length === 0) {
    return (
      <div className="col-span-full w-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200/60">
        <h3 className="text-base font-semibold text-slate-800 mb-1">No reports found</h3>
        <p className="text-xs text-slate-500">Please adjust your filters and try again.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.isArray(filteredReportsList) &&
        filteredReportsList.map((item, index) => (
          <ReportTile key={item._id || index} data={item} />
        ))}
    </div>
  );
};

export default ReportResultsComp;