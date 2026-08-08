'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/searchbar.module.css';
import { useRouter } from 'next/router';
import ShowSuggestions from "./ShowSuggestions";
import { isSessionTokenValid, checkAuthentication } from '../../pages/api/UtilFunctions';

const SearchBar = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef();
    const isFirstRender = useRef(true);
    const router = useRouter();


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
        // console.log("Query: ", value);
    }

    useEffect(() => {
    if (!open) {
        return;
    }

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
                `${backendAPI}/AlgoliaSearchEndpoint?keyStroke=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.message === "UpdatePlan") {
                const confirmed = window.confirm(
                    "Your current plan needs to be updated to access this feature. Would you like to update your plan?"
                );

                if (confirmed) {
                    router.push('/Pricing');
                }

                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setSuggestions(response.data);

        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    fetchSuggestions();

}, [query, open]);

    const handleClickOutside = (event) => {
        if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
            setShowSuggestions(false); // Hide suggestions when clicking outside
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
    <div className="relative w-9 h-9 shrink-0">

        {/* Search wrapper */}
        <div
            ref={suggestionRef}
            className="relative w-full h-full"
        >

            {/* SEARCH BUTTON */}
            <button
                type="button"
                className="
                    relative z-[1002]
                    w-9 h-9
                    rounded-full
                    flex items-center justify-center
                    shrink-0
                    hover:bg-slate-100
                    transition-colors
                "
                onClick={() => {
                    setOpen(!open);

                    if (open) {
                        setQuery('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                }}
                aria-label={open ? "Close search" : "Search"}
            >
                <i
                    className={`bi ${
                        open ? "bi-x-lg" : "bi-search"
                    } text-lg text-gray-600`}
                />
            </button>


            {/* EXPANDED SEARCH INPUT */}
            {open && (
               <div
    className="
        absolute
        right-0
        top-0
        z-[1001]
        w-[calc(100vw-110px)]
        max-w-[380px]
    "
>
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="
                            w-full
                            h-12
                            rounded-full
                            border
                            border-green-600
                            bg-white
                            px-5
                            pr-12
                            text-[16px]
                            text-slate-700
                            placeholder-slate-400
                            shadow-lg
                            outline-none
                            focus:border-green-600
                        "
                    />
                </div>
            )}


            {/* SUGGESTIONS */}
            {open && !loading && suggestions.length > 0 && showSuggestions && (
                <div
                    className="
                        absolute
                        right-0
                        top-[52px]
                        z-[1000]
                        w-[calc(100vw-64px)]
                        max-w-[380px]
                        bg-white
                        border
                        border-slate-200
                        rounded-lg
                        shadow-xl
                        overflow-hidden
                    "
                >
                
                </div>
            )}


            {/* LOADING */}
            {open && loading && (
                <div
                    className="
                        absolute
                        right-0
                        top-[52px]
                        z-[1000]
                        w-[calc(100vw-64px)]
                        max-w-[380px]
                        bg-white
                        border
                        border-slate-200
                        rounded-lg
                        shadow-xl
                        text-center
                        py-3
                        text-gray-500
                        text-sm
                    "
                >
                    <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                    Loading suggestions...
                </div>
            )}

        </div>
    </div>
);
}

export default SearchBar;