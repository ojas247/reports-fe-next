'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ShowSuggestions from './ShowSuggestions';

const SearchBar = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestionRef = useRef(null);
    const searchInputRef = useRef(null);

    const router = useRouter();

    /*
     * ---------------------------------------------------------
     * CREATE FILTER OPTIONS
     * ---------------------------------------------------------
     */
    const create_filter_options = (getUrl) => {
        try {
            const urlObj = new URL(getUrl);
            const params = new URLSearchParams(urlObj.search);

            const queryParams = {};
            const sector_filters = {};
            const author_arr = [];

            const kind = params.get('kind');
            const value1 = params.get('value1');

            if (kind === 'sub1') {
                sector_filters.sub1 = value1;
                queryParams.sector_filters = sector_filters;
            }

            else if (kind === 'sector') {
                sector_filters.sector = value1;
                queryParams.sector_filters = sector_filters;
            }

            else if (kind === 'author') {
                author_arr.push({
                    value: value1,
                    label: value1
                });

                queryParams.author = author_arr;
            }

            return queryParams;

        } catch (error) {
            console.error(
                'Error creating filter options:',
                error
            );

            return {};
        }
    };


    /*
     * ---------------------------------------------------------
     * SEARCH REPORTS
     * ---------------------------------------------------------
     */
    const SearchReports = async (getUrl) => {

        try {

            const filter_options_json =
                create_filter_options(getUrl);

            console.log(
                'filter_options_json:',
                filter_options_json
            );

            const res = await axios.get(getUrl);

            console.log(
                'Report search response:',
                res.data
            );

            const ReportFilterProps = res.data;

            if (
                ReportFilterProps?.message ===
                'Invalid Authorization'
            ) {
                router.push('/Login');
                return;
            }

            router.push({
                pathname: '/ReportResult',
                query: {
                    // Keep your existing navigation behavior
                }
            });

            /*
             * IMPORTANT:
             *
             * If your project relies on router state from
             * another implementation, keep your original
             * navigation here.
             *
             * The important part for the current issue is
             * rendering ShowSuggestions below.
             */

        } catch (error) {

            console.error(
                'Search reports error:',
                error
            );

        }

    };


    /*
     * ---------------------------------------------------------
     * SUGGESTION CLICK
     * ---------------------------------------------------------
     */
    const suggestionClick = (value) => {

        console.log(
            'Selected suggestion:',
            value
        );

        setShowSuggestions(false);
        setOpen(false);

        /*
         * If ShowSuggestions returns the URL directly
         */
        if (typeof value === 'string') {
            SearchReports(value);
            return;
        }

        /*
         * If the suggestion is an object,
         * try common URL properties.
         */
        const url =
            value?.url ||
            value?.URL ||
            value?.href ||
            value?.link ||
            value?.value;

        if (url) {
            SearchReports(url);
        } else {
            console.error(
                'Could not find URL in selected suggestion:',
                value
            );
        }
    };


    /*
     * ---------------------------------------------------------
     * FETCH SUGGESTIONS
     * ---------------------------------------------------------
     */
    useEffect(() => {

        if (!open) {
            return;
        }

        const trimmedQuery = query.trim();

        if (trimmedQuery === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchSuggestions = async () => {

            try {

                setLoading(true);

                const token =
                    'x@dffgfumdflkd76tg8jivdgoolnvll==';

                const response = await axios.get(
                    `${backendAPI}/AlgoliaSearchEndpoint`,
                    {
                        params: {
                            keyStroke: trimmedQuery
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json'
                        }
                    }
                );

                if (cancelled) {
                    return;
                }

                /*
                 * Handle plan restriction
                 */
                if (
                    response.data?.message ===
                    'UpdatePlan'
                ) {

                    const confirmed =
                        window.confirm(
                            'Your current plan needs to be updated to access this feature. Would you like to update your plan?'
                        );

                    if (confirmed) {
                        router.push('/Pricing');
                    }

                    setSuggestions([]);
                    setShowSuggestions(false);

                    return;
                }

                /*
                 * Make sure we always store an array.
                 */
                const result =
                    Array.isArray(response.data)
                        ? response.data
                        : Array.isArray(
                              response.data?.options_list
                          )
                            ? response.data.options_list
                            : [];

                console.log(
                    'Search suggestions:',
                    result
                );

                setSuggestions(result);

                setShowSuggestions(
                    result.length > 0
                );

            } catch (error) {

                if (!cancelled) {

                    console.error(
                        'Error fetching suggestions:',
                        error
                    );

                    setSuggestions([]);
                    setShowSuggestions(false);
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        fetchSuggestions();

        return () => {
            cancelled = true;
        };

    }, [query, open, backendAPI, router]);


    /*
     * ---------------------------------------------------------
     * CLICK OUTSIDE
     * ---------------------------------------------------------
     */
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                suggestionRef.current &&
                !suggestionRef.current.contains(
                    event.target
                )
            ) {
                setShowSuggestions(false);
            }

        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };

    }, []);


    /*
     * ---------------------------------------------------------
     * OPEN SEARCH
     * ---------------------------------------------------------
     */
    const openSearch = () => {

        setOpen(true);

        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);

    };


    /*
     * ---------------------------------------------------------
     * CLOSE SEARCH
     * ---------------------------------------------------------
     */
    const closeSearch = () => {

        setOpen(false);
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);

    };


    /*
     * ---------------------------------------------------------
     * INPUT CHANGE
     * ---------------------------------------------------------
     */
    const handleInputChange = (e) => {

        const value = e.target.value;

        setQuery(value);

        if (value.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
        }

    };


    return (
        <div
            ref={suggestionRef}
            className="
                relative
                w-9
                h-9
                shrink-0
                z-[9999]
            "
        >

            {/* =================================================
                SEARCH BUTTON
            ================================================= */}
            {!open && (
                <button
                    type="button"
                    onClick={openSearch}
                    aria-label="Search"
                    className="
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        hover:bg-slate-100
                        active:bg-slate-200
                        transition-colors
                        cursor-pointer
                    "
                >
                    <i
                        className="
                            bi
                            bi-search
                            text-lg
                            text-slate-600
                        "
                    />
                </button>
            )}


            {/* =================================================
                EXPANDED SEARCH
            ================================================= */}
            {open && (
                <div
                    className="
                        fixed
                        top-[calc(56px+env(safe-area-inset-top))]
                        left-1/2
                        -translate-x-1/2
                        w-[calc(100vw-24px)]
                        max-w-[520px]
                        z-[9999]
                    "
                >

                    {/* INPUT WRAPPER */}
                    <div
                        className="
                            relative
                            w-full
                            h-12
                        "
                    >

                        <input
                            ref={searchInputRef}
                            autoFocus
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search Authors, Sectors, Sub-Sectors..."
                            className="
                                block
                                w-full
                                h-12
                                rounded-full
                                border
                                border-emerald-500
                                bg-white
                                px-5
                                pr-14
                                text-[15px]
                                sm:text-[16px]
                                text-slate-700
                                placeholder:text-slate-400
                                shadow-lg
                                outline-none
                                focus:border-emerald-600
                                focus:ring-2
                                focus:ring-emerald-100
                            "
                        />

                        {/* X BUTTON */}
                        <button
                            type="button"
                            onClick={closeSearch}
                            aria-label="Close search"
                            className="
                                absolute
                                right-2
                                top-1/2
                                -translate-y-1/2
                                w-9
                                h-9
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-slate-500
                                hover:text-slate-800
                                hover:bg-slate-100
                                active:bg-slate-200
                                transition-all
                                cursor-pointer
                            "
                        >
                            <i
                                className="
                                    bi
                                    bi-x-lg
                                    text-lg
                                "
                            />
                        </button>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}
                    {loading && (
                        <div
                            className="
                                mt-2
                                w-full
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                shadow-xl
                                overflow-hidden
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-4
                                    text-sm
                                    text-slate-500
                                "
                            >

                                <i
                                    className="
                                        bi
                                        bi-arrow-repeat
                                        animate-spin
                                    "
                                />

                                Searching...

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        SUGGESTIONS
                    ================================================= */}
                    {!loading &&
                        showSuggestions &&
                        suggestions.length > 0 && (

                            <div
                                className="
                                    mt-2
                                    w-full
                                    max-h-[65vh]
                                    overflow-y-auto
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-xl
                                    shadow-2xl
                                    overscroll-contain
                                "
                            >

                                {/*
                                 * THIS WAS MISSING IN YOUR CODE.
                                 *
                                 * You imported ShowSuggestions but
                                 * never rendered it.
                                 */}
                                <ShowSuggestions
                                    suggestions={suggestions}
                                    onSuggestionClick={
                                        suggestionClick
                                    }
                                />

                            </div>
                        )}


                    {/* =================================================
                        NO RESULTS
                    ================================================= */}
                    {!loading &&
                        query.trim() !== '' &&
                        suggestions.length === 0 && (

                            <div
                                className="
                                    mt-2
                                    w-full
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-xl
                                    shadow-xl
                                    px-4
                                    py-4
                                    text-center
                                "
                            >

                                <i
                                    className="
                                        bi
                                        bi-search
                                        text-slate-300
                                        text-xl
                                    "
                                />

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    No results found
                                </p>

                            </div>
                        )}

                </div>
            )}

        </div>
    );
};

export default SearchBar;