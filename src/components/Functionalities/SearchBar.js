'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/searchbar.module.css';
import { useRouter } from 'next/router';
import ShowSuggestions from "./ShowSuggestions";
import { isSessionTokenValid, checkAuthentication, pushGTMEvent } from '../../pages/api/UtilFunctions';

const SearchBar = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [ucc, setUcc] = useState('anonymous_user');  // default
    const [showSearch, setShowSearch] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef();
    const isFirstRender = useRef(true);
    const router = useRouter();

    // Close search bar if clicked outside
    useEffect(() => {
        const storedUcc = sessionStorage.getItem('UCC') || 'anonymous_user';
        setUcc(storedUcc);
        const handler = (e) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);


    const create_filter_options = (getUrl) => {
        const urlObj = new URL(getUrl);
        const params = new URLSearchParams(urlObj.search);
        const queryParams = {};
        const sector_filters = {};
        const author_arr = [];
        const author_json_item = {};

        const kind = params.get('kind');
        const value1 = params.get('value1');

        if (kind === 'sub1') {
            sector_filters["sub1"] = value1;
            queryParams["sector_filters"] = sector_filters;
        } else if (kind === 'sector') {
            sector_filters["sector"] = value1;
            queryParams["sector_filters"] = sector_filters;
        } else if (kind === 'author') {
            author_json_item["value"] = value1;
            author_json_item["label"] = value1;
            author_arr.push(author_json_item);
            queryParams["author"] = author_arr;
        }

        return queryParams;
    }

    const SearchReports = async (getUrl) => {
        const filter_options_json = await create_filter_options(getUrl);
        console.log("filter_options_json: ", filter_options_json);

        const res = await axios.get(getUrl)

        console.log("resData:", res.data);
        const ReportFilterProps = res.data;

        if (ReportFilterProps.message === "Invalid Authorization") {
            router.push('/Login', { state: {} })
        } else {
            router.push('/ReportResult', { state: { ReportFilterProps, filter_options_json } })
        }

    }


    const suggestionClick = (value) => {
        console.log("From Child: ", value) //Add logic of what to do with the click
        setShowSuggestions(false);
        SearchReports(value);
    }

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        // Push GTM event
        pushGTMEvent({
            eventName: "Searched_SearchBar",
            eventParams: {
                page: window.location.pathname,
                query: value
            },
            userId: ucc,
            userProperties: {
                role: 'anonymous-user',
                plan: 'xxx',
                country: 'IN'
            }
        });
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (query.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const token = "x@dffgfumdflkd76tg8jivdgoolnvll==";

                const response = await axios.get(
                    `${backendAPI}/AlgoliaSearchEndpoint?keyStroke=${query}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setSuggestions(response.data);

                if (response.data.message === "UpdatePlan") {
                    console.log("UpdatePlan: ", response.data.message);
                    const confirmed = window.confirm("Your current plan needs to be updated to access this feature. Would you like to update your plan?");
                    if (confirmed) {
                        router.push('/Pricing', { state: {} });
                    }
                    setShowSuggestions(false);
                    return;
                }
                console.log("Suggestions: ", suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, [query]);

    const handleClickOutside = (event) => {
        if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log("Suggestions updated:", suggestions);
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }, [suggestions]);

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-4 sm:py-0">
            <div ref={suggestionRef} className="relative w-full max-w-[500px]">
                {/* Search Input - Thin black border on focus */}
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search Authors, Sectors, Sub-Sectors..."
                    className="w-full border border-slate-300 rounded-full pl-4 pr-28 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm transition-all duration-200"
                />

                {/* Search Button */}
                <button
                    onClick={() => query.trim() && SearchReports(`${backendAPI}/AlgoliaSearchEndpoint?keyStroke=${encodeURIComponent(query)}`)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1e3a5f] hover:bg-[#162c48] active:scale-95 text-white rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm transition-all duration-150 flex items-center justify-center"
                >
                    <i className="bi bi-search text-white"></i>
                    <span className="hidden sm:inline ml-2">Search</span>
                </button>

                {/* Suggestions Container */}
                {!loading && suggestions.length > 0 && showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden">
                        <ShowSuggestions suggestions={suggestions} suggestionClick={suggestionClick} />
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="absolute top-full left-0 right-0 mt-2 text-center py-2.5 text-slate-500 text-xs font-medium bg-white border border-slate-200 rounded-xl shadow-lg z-[1000] flex items-center justify-center">
                        <i className="bi bi-arrow-repeat animate-spin mr-2 text-sm"></i>
                        Loading suggestions...
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;