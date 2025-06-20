'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/searchbar.module.css';
import { useRouter } from 'next/router';
import ShowSuggestions from "./ShowSuggestions";
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';

const SearchBar = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef();
    const isFirstRender = useRef(true);
    const [token, setToken] = useState(null);
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
        console.log("Query: ", value);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
      }, []);

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
                const isAuthenticated = await isSessionTokenValid();
                console.log("isAuthenticated: ", isAuthenticated);
                if (!isAuthenticated) {
                    router.push('/Login', { state: {} });
                    return;
                }
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
                setShowSuggestions(true);
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
                console.log("Suggestions: ", response.data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
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

    return (
        <div className={styles.searchContainer}>
        <div className={styles.searchWrapper} ref={suggestionRef}>
            <input className={styles.searchBar}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search Authors, Sectors, Sub-Sectors..."
            />
            <button className={styles.searchButton}>Search</button>

            {suggestions.length > 0 && showSuggestions &&
                <ShowSuggestions suggestions={suggestions} suggestionClick={suggestionClick} />
            }
        </div>
    </div>
      );
    }

export default SearchBar;