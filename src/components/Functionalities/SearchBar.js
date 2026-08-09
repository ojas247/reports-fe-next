'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { pushGTMEvent } from '../../pages/api/UtilFunctions';

const SearchBar = () => {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [ucc, setUcc] = useState('anonymous_user');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestionRef = useRef(null);
    const requestRef = useRef(null);
    const debounceRef = useRef(null);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUcc =
                sessionStorage.getItem('UCC') || 'anonymous_user';

            setUcc(storedUcc);
        }

        const handleClickOutside = (event) => {
            if (
                suggestionRef.current &&
                !suggestionRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

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
            } else if (kind === 'sector') {
                sector_filters.sector = value1;
                queryParams.sector_filters = sector_filters;
            } else if (kind === 'author') {
                author_arr.push({
                    value: value1,
                    label: value1
                });

                queryParams.author = author_arr;
            }

            return queryParams;
        } catch (error) {
            console.error('Filter URL error:', error);
            return {};
        }
    };

    const SearchReports = async (getUrl) => {
        try {
            setShowSuggestions(false);
            setLoading(true);

            const filter_options_json =
                create_filter_options(getUrl);

            const res = await axios.get(getUrl);

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
                    search: encodeURIComponent(query)
                }
            });

            sessionStorage.setItem(
                'ReportFilterProps',
                JSON.stringify(ReportFilterProps)
            );

            sessionStorage.setItem(
                'filter_options_json',
                JSON.stringify(filter_options_json)
            );
        } catch (error) {
            console.error(
                'Search reports error:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const getSuggestionLabel = (item) => {
        if (!item) return '';

        if (typeof item === 'string') {
            return item;
        }

        if (item.key) {
            return String(item.key);
        }

        if (item.label) {
            return String(item.label);
        }

        if (item.name) {
            return String(item.name);
        }

        if (item.title) {
            return String(item.title);
        }

        if (item.value) {
            if (typeof item.value === 'string') {
                return item.value;
            }

            if (item.value.label) {
                return String(item.value.label);
            }

            if (item.value.name) {
                return String(item.value.name);
            }

            if (item.value.title) {
                return String(item.value.title);
            }
        }

        return JSON.stringify(item);
    };

    const getSuggestionUrl = (item) => {
        if (!item) return null;

        if (typeof item === 'string') {
            if (
                item.startsWith('http://') ||
                item.startsWith('https://')
            ) {
                return item;
            }

            return null;
        }

        const possibleUrls = [
            item.url,
            item.URL,
            item.link,
            item.href,
            item.value?.url,
            item.value?.URL,
            item.value?.link,
            item.value?.href
        ];

        return (
            possibleUrls.find(
                (value) =>
                    typeof value === 'string' &&
                    value.length > 0
            ) || null
        );
    };

    const handleSuggestionClick = (item) => {
        const url = getSuggestionUrl(item);

        if (url) {
            SearchReports(url);
            return;
        }

        const label = getSuggestionLabel(item);

        if (!label) return;

        const searchUrl =
            `${backendAPI}/AlgoliaSearchEndpoint` +
            `?keyStroke=${encodeURIComponent(label)}`;

        SearchReports(searchUrl);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;

        setQuery(value);

        pushGTMEvent({
            eventName: 'Searched_SearchBar',
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

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
            return;
        }

        setShowSuggestions(true);

        debounceRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 250);
    };

    const fetchSuggestions = async (searchValue) => {
        if (!searchValue.trim()) return;

        if (requestRef.current) {
            requestRef.current.abort();
        }

        const controller = new AbortController();
        requestRef.current = controller;

        try {
            setLoading(true);

            const token =
                'x@dffgfumdflkd76tg8jivdgoolnvll==';

            const response = await axios.get(
                `${backendAPI}/AlgoliaSearchEndpoint?keyStroke=${encodeURIComponent(
                    searchValue
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                }
            );

            if (response.data?.message === 'UpdatePlan') {
                setSuggestions([]);
                setShowSuggestions(false);

                const confirmed = window.confirm(
                    'Your current plan needs to be updated to access this feature. Would you like to update your plan?'
                );

                if (confirmed) {
                    router.push('/Pricing');
                }

                return;
            }

            const result = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.options_list)
                    ? response.data.options_list
                    : Array.isArray(response.data?.suggestions)
                        ? response.data.suggestions
                        : [];

            console.log('Search suggestions:', result);

            setSuggestions(result);
            setShowSuggestions(result.length > 0);
        } catch (error) {
            if (
                error?.name === 'CanceledError' ||
                error?.code === 'ERR_CANCELED'
            ) {
                return;
            }

            console.error(
                'Error fetching suggestions:',
                error
            );

            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    const handleSearch = () => {
        const value = query.trim();

        if (!value) return;

        const searchUrl =
            `${backendAPI}/AlgoliaSearchEndpoint` +
            `?keyStroke=${encodeURIComponent(value)}`;

        SearchReports(searchUrl);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }

        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (requestRef.current) {
                requestRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full px-3 sm:px-4">
            <div
                ref={suggestionRef}
                className="relative w-full max-w-[600px]"
            >
                <div className="relative w-full">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        placeholder="Search Authors, Sectors, Sub-Sectors..."
                        autoComplete="off"
                        className="
                            w-full
                            h-12
                            sm:h-[36px]
                            border
                            border-slate-300
                            rounded-full
                            pl-4
                            sm:pl-5
                            pr-[125px]
                            text-sm
                            sm:text-base
                            text-slate-800
                            placeholder:text-slate-400
                            bg-white
                            shadow-sm
                            outline-none
                            transition-all
                            duration-200
                            focus:border-slate-900
                            focus:ring-1
                            focus:ring-slate-900
                        "
                    />

                    {query.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                            className="
                                absolute
                             right-[95px]
                             sm:right-[88px]  
                                top-1/2
                                -translate-y-1/2
                                w-8
                                h-8
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-slate-400
                                hover:text-slate-700
                                hover:bg-slate-100
                                transition
                                z-20
                            "
                        >
                            <i className="bi bi-x-lg text-[15px]" />
                        </button>
                    )}

                  <button
    type="button"
    onClick={handleSearch}
    disabled={!query.trim() || loading}
    className="
        absolute
        right-1
        top-1/2
        -translate-y-1/2
        h-[30px]
        min-w-[72px]
        px-3
        bg-[#1e3a5f]
        hover:bg-[#1e3a5f]
        active:bg-[#1e3a5f]
        disabled:bg-[#1e3a5f]
        disabled:opacity-50
        disabled:cursor-not-allowed
        text-white
        rounded-full
        text-[11px]
        font-semibold
        cursor-pointer
        shadow-sm
        transition
        flex
        items-center
        justify-center
        gap-1.5
        z-20
    "
>
    {loading ? (
        <i className="bi bi-arrow-repeat animate-spin text-[12px]" />
    ) : (
        <>
            <i className="bi bi-search text-[12px]" />
            <span>Search</span>
        </>
    )}
</button>
                </div>

                {showSuggestions && (
                    <div
                        className="
                            absolute
                            left-0
                            right-0
                            top-full
                            mt-2
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                            z-[9999]
                        "
                    >
                        {loading && suggestions.length === 0 ? (
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-4
                                    text-xs
                                    text-slate-500
                                "
                            >
                                <i className="bi bi-arrow-repeat animate-spin" />
                                <span>
                                    Loading suggestions...
                                </span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="max-h-[360px] overflow-y-auto">
                                {suggestions.map(
                                    (item, index) => {
                                        const label =
                                            getSuggestionLabel(
                                                item
                                            );

                                        return (
                                            <button
                                                key={`${label}-${index}`}
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                }}
                                                onClick={() =>
                                                    handleSuggestionClick(
                                                        item
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    text-left
                                                    px-4
                                                    py-3
                                                    border-b
                                                    border-slate-100
                                                    last:border-b-0
                                                    hover:bg-slate-50
                                                    active:bg-slate-100
                                                    transition
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        w-8
                                                        h-8
                                                        shrink-0
                                                        rounded-full
                                                        bg-slate-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <i className="bi bi-search text-slate-500 text-xs" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="
                                                            text-sm
                                                            font-medium
                                                            text-slate-800
                                                            truncate
                                                        "
                                                    >
                                                        {label}
                                                    </div>

                                                    {item?.value &&
                                                        typeof item.value ===
                                                            'object' && (
                                                            <div
                                                                className="
                                                                    text-[10px]
                                                                    text-slate-400
                                                                    mt-0.5
                                                                    truncate
                                                                "
                                                            >
                                                                {item.value.label ||
                                                                    item.value.name ||
                                                                    item.value.type ||
                                                                    ''}
                                                            </div>
                                                        )}
                                                </div>

                                                <i className="bi bi-chevron-right text-slate-300 text-xs shrink-0" />
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    px-4
                                    py-4
                                    text-center
                                    text-xs
                                    text-slate-500
                                "
                            >
                                No suggestions found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;