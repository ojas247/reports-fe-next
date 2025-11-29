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
                setLoading(true); // 🟡 Start loading
                // const tokenString = sessionStorage.getItem("token")? JSON.parse(sessionStorage.getItem("token")).value : null;
                // const token = tokenString;
                const token = "x@dffgfumdflkd76tg8jivdgoolnvll==";

                // const isAuthenticated = await checkAuthentication();
                // if (!isAuthenticated) {
                //     router.push('/Login', { state: {} });
                //     return;
                // }
                const response = await axios.get(
                    `${backendAPI}/AlgoliaSearchEndpoint?keyStroke=${query}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setSuggestions(response.data); // Set the parsed JSON directly
                // setShowSuggestions(true);

                if (response.data.message === "UpdatePlan") {
                    console.log("UpdatePlan: ", response.data.message);
                    // Show popup for plan update
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
                setLoading(false); // 🟢 Stop loading
            }
        };
        fetchSuggestions();
    }, [query]);

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
        <div className="flex flex-col items-center justify-center w-full px-4 py-4 sm:py-0">
            <div ref={suggestionRef} className="relative w-full max-w-[500px]">

                {/* MOBILE SEARCH CONTAINER */}
                <div className="md:hidden fixed top-4 right-4 z-50">
                    <div className="relative flex items-center">
                        {/* EXPANDABLE INPUT - Animates from icon position */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            className={`
                                absolute right-12 top-1/2 -translate-y-1/2
                                bg-white border-2 border-gray-300 rounded-full pl-4 pr-12 py-2
                                focus:border-green-600 outline-none text-[16px] placeholder-gray-400 text-gray-800
                                transition-all duration-300 ease-in-out
                                ${open
                                    ? "w-[calc(80vw-80px)] opacity-100 shadow-lg"  // Expand to near-full width
                                    : "w-0 opacity-0 pointer-events-none"
                                }
            `}
                            onClick={(e) => e.stopPropagation()}  // Prevent click from bubbling to close
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // Trigger search logic here
                                    setOpen(false);
                                }
                            }}
                        />
                        {/* SEARCH ICON BUTTON - Stays fixed, triggers expand */}
                        <button
                            className="p-1 rounded-full bg-blue flex items-center justify-center relative z-5"
                            onClick={() => {
                                if (open) {
                                    // Trigger search if open
                                    // Add your search logic here
                                    setOpen(false);
                                } else {
                                    setOpen(true);
                                }
                            }}
                        >
                            <i className={`bi ${open ? "bi-x-lg" : "bi-search"} text-xl text-gray-600`}></i>
                        </button>

                    </div>
                </div>


                <div className='px-10 py-5'>
                    {!loading && suggestions.length > 0 && showSuggestions && (
                        <ShowSuggestions suggestions={suggestions} suggestionClick={suggestionClick} />
                    )}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="absolute w-full text-center py-2 text-gray-500 text-sm bg-white border border-gray-200 rounded-b-md z-[1000]">
                        <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                        Loading suggestions...
                    </div>
                )}
            </div>
        </div>

    );
}

export default SearchBar;