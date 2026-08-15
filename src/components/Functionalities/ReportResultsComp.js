'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReportTile from "../UtilityComponents/ReportTile";
import FactsLoader from "../UtilityComponents/Tools/FactsLoader";

const ReportResultsComp = ({ researchType, result }) => {
  const router = useRouter();

  const [filteredReportsList, setFilteredReportsList] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  const isEmpty = (obj) =>
    !obj || Object.keys(obj).length === 0;

  const SearchReportsList = async () => {
    if (isEmpty(filters)) return;

    const tokenString = sessionStorage.getItem("token");
    const tokenData = tokenString ? JSON.parse(tokenString) : null;

    if (!tokenData?.value) {
      router.push("/Login");
      return;
    }

    const payload = {
      sector_filters: filters.sector_filters || {},
    };

    if (filters.author) {
      payload.author = filters.author;
    }

    if (
      filters.year !== null &&
      filters.year !== undefined &&
      filters.year !== ""
    ) {
      payload.year = filters.year;
    }

    if (
      filters.tags !== null &&
      filters.tags !== undefined &&
      filters.tags !== ""
    ) {
      payload.tags = filters.tags;
    }

    console.log("Research Type:", researchType);
    console.log("API Payload:", payload);

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendAPI}/SearchReports_v1`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tokenData.value}`,
            "X-ResearchType": researchType,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SearchReports_v1 Response:", response.data);

      if (response.data?.message === "Invalid Authorization") {
        router.push("/Login");
        return;
      }

      if (response.data?.message === "Update plan") {
        setFilteredReportsList([]);
        return;
      }

      if (Array.isArray(response.data)) {
        setFilteredReportsList(response.data);
      } else {
        setFilteredReportsList([]);
      }
    } catch (error) {
      console.error(
        "SearchReports_v1 ERROR:",
        error.response?.data || error.message
      );

      setFilteredReportsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters(result || {});
  }, [result]);

  useEffect(() => {
    if (!isEmpty(filters)) {
      SearchReportsList();
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <FactsLoader />
      </div>
    );
  }

  if (!filteredReportsList.length) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-xl border border-slate-200/60 p-6 sm:p-8">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <i className="bi bi-file-earmark-text text-xl text-slate-400"></i>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No reports found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Please adjust your filters and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 sm:gap-5">
      {filteredReportsList.map((item, index) => (
        <ReportTile
          key={item._id || item.id || index}
          data={item}
          index={index}
          researchType={researchType}
        />
      ))}
    </div>
  );
};

export default ReportResultsComp;