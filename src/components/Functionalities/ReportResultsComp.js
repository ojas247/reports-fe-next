'use client';

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReportTile from "../UtilityComponents/ReportTile";
import FactsLoader from "../UtilityComponents/Tools/FactsLoader";

const ReportResultsComp = ({ researchType, result }) => {
  const router = useRouter();

  const [filteredReportsList, setFilteredReportsList] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const prevFiltersRef = useRef({});
  const prevResultRef = useRef(result);

  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  const isEmpty = (obj) => {
    if (!obj) return true;
    if (Object.keys(obj).length === 0) return true;
    
    // Check if all filter fields are empty
    const hasNoSectorFilters = !obj.sector_filters || Object.keys(obj.sector_filters).length === 0;
    const hasNoAuthor = !obj.author || obj.author === '' || (typeof obj.author === 'object' && !obj.author.value);
    const hasNoYear = !obj.year || obj.year === '';
    const hasNoTags = !obj.tags || obj.tags === '' || (Array.isArray(obj.tags) && obj.tags.length === 0);
    
    return hasNoSectorFilters && hasNoAuthor && hasNoYear && hasNoTags;
  };

  const SearchReportsList = async (searchFilters) => {
    // Use provided filters or current state
    const currentFilters = searchFilters || filters;
    
    // Check if filters are empty
    if (isEmpty(currentFilters)) {
      console.log("Filters are empty - clearing results");
      setFilteredReportsList([]);
      setHasSearched(false);
      setLoading(false);
      setIsCleared(true);
      return;
    }

    setIsCleared(false);

    const tokenString = sessionStorage.getItem("token");
    const tokenData = tokenString ? JSON.parse(tokenString) : null;

    if (!tokenData?.value) {
      router.push("/Login");
      return;
    }

    const payload = {
      sector_filters: currentFilters.sector_filters || {},
    };

    // Only add filters if they have values
    if (currentFilters.author && currentFilters.author !== '') {
      payload.author = typeof currentFilters.author === 'object' 
        ? currentFilters.author.value || currentFilters.author
        : currentFilters.author;
    }

    if (currentFilters.year && currentFilters.year !== '') {
      payload.year = typeof currentFilters.year === 'object'
        ? currentFilters.year.value || currentFilters.year
        : currentFilters.year;
    }

    if (currentFilters.tags && currentFilters.tags !== '' && 
        !(Array.isArray(currentFilters.tags) && currentFilters.tags.length === 0)) {
      payload.tags = typeof currentFilters.tags === 'object'
        ? currentFilters.tags.value || currentFilters.tags
        : currentFilters.tags;
    }

    console.log("Research Type:", researchType);
    console.log("API Payload:", payload);

    setLoading(true);
    setHasSearched(true);

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

  // Update filters when result prop changes
  useEffect(() => {
    console.log("Result prop changed:", result);
    console.log("Previous result:", prevResultRef.current);
    
    const newFilters = result || {};
    
    // Check if the new filters are empty (cleared)
    if (isEmpty(newFilters)) {
      console.log("Empty filters detected - clearing results immediately");
      setFilteredReportsList([]);
      setHasSearched(false);
      setLoading(false);
      setIsCleared(true);
      setFilters({});
      prevFiltersRef.current = {};
      return;
    }
    
    // Check if we went from empty to having filters
    if (isEmpty(prevResultRef.current) && !isEmpty(newFilters)) {
      console.log("Filters were restored - searching");
      setIsCleared(false);
    }
    
    prevResultRef.current = newFilters;
    setFilters(newFilters);
  }, [result]);

  // Trigger search when filters change
  useEffect(() => {
    // Skip if filters haven't changed or are empty
    const currentFilters = filters;
    
    if (isEmpty(currentFilters)) {
      console.log("Filters are empty in useEffect - clearing results");
      setFilteredReportsList([]);
      setHasSearched(false);
      setLoading(false);
      setIsCleared(true);
      return;
    }

    setIsCleared(false);

    // Only search if filters have changed
    const filtersStr = JSON.stringify(currentFilters);
    const prevFiltersStr = JSON.stringify(prevFiltersRef.current);
    
    if (filtersStr !== prevFiltersStr) {
      prevFiltersRef.current = currentFilters;
      SearchReportsList(currentFilters);
    }
  }, [filters]);

  // Force clear when result is empty
  useEffect(() => {
    if (result && Object.keys(result).length === 0) {
      console.log("Force clearing results from empty result");
      setFilteredReportsList([]);
      setHasSearched(false);
      setLoading(false);
      setIsCleared(true);
      setFilters({});
      prevFiltersRef.current = {};
    }
  }, [result]);

  // Separate effect to handle initial load and clearing
  useEffect(() => {
    // If result is empty or undefined, clear everything
    if (!result || Object.keys(result).length === 0) {
      console.log("Initial or cleared state - no results");
      setFilteredReportsList([]);
      setHasSearched(false);
      setIsCleared(true);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <FactsLoader />
      </div>
    );
  }

  // Show empty state when no results and not loading
  if (!filteredReportsList.length && !loading) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-xl border border-slate-200/60 p-6 sm:p-8">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <i className="bi bi-file-earmark-text text-xl text-slate-400"></i>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          {hasSearched ? 'No reports found' : 'Apply filters to search'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          {hasSearched 
            ? 'Please adjust your filters and try again.' 
            : 'Select filters above to find relevant reports.'}
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