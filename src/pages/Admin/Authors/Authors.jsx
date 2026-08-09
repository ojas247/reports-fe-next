'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchDataFromGetApi } from '../../api/Api';

const ITEMS_PER_PAGE = 15;

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchDataFromGetApi('CRUD/get/Authors');

      console.log('Authors API Response:', response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.options_list)) {
        records = response.options_list;
      } else if (Array.isArray(response?.authors)) {
        records = response.authors;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      }

      const normalizedAuthors = records
        .map((author) => {
          if (typeof author === 'string') {
            return author.trim();
          }

          if (author && typeof author === 'object') {
            return (
              author.name ||
              author.author ||
              author.authorName ||
              author.title ||
              ''
            ).toString().trim();
          }

          return '';
        })
        .filter(Boolean);

      const uniqueAuthors = [...new Set(normalizedAuthors)];

      setAuthors(uniqueAuthors);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch authors:', err);

      setError(err?.message || 'Failed to load authors.');
      setAuthors([]);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filteredAuthors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return authors;
    }

    return authors.filter((author) =>
      author.toLowerCase().includes(term)
    );
  }, [authors, searchTerm]);

  const sortedAuthors = useMemo(() => {
    return [...filteredAuthors].sort((a, b) => {
      const result = a.localeCompare(b, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return sortDirection === 'asc' ? result : -result;
    });
  }, [filteredAuthors, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedAuthors.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedAuthors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return sortedAuthors.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [sortedAuthors, currentPage]);

  const startResult =
    sortedAuthors.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endResult = Math.min(
    currentPage * ITEMS_PER_PAGE,
    sortedAuthors.length
  );

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  if (loading && authors.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold">
            Authors Registry
          </div>

          <div className="px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-slate-500 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              FETCHING AUTHORS...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold">
            AU
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Authors
              </h1>

              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Manage and inspect registered publishing authors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">

          <div className="relative w-full md:w-72">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search authors..."
              className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <i className="bi bi-x-circle-fill text-[11px]" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={fetchAuthors}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <i className={`bi ${loading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'} text-[11px]`} />
            {loading ? 'Fetching...' : 'Refresh'}
          </button>

        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <div className="flex items-center gap-2">
            <span>Authors Registry</span>

            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
              {authors.length} TOTAL
            </span>
          </div>

          <button
            type="button"
            onClick={handleSort}
            disabled={sortedAuthors.length === 0}
            className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white transition disabled:opacity-50"
          >
            <span>
              {sortDirection === 'asc' ? 'A → Z' : 'Z → A'}
            </span>

            <i
              className={`bi ${
                sortDirection === 'asc'
                  ? 'bi-sort-alpha-down'
                  : 'bi-sort-alpha-up'
              }`}
            />
          </button>

        </div>

        {error ? (
          <div className="px-4 py-12 text-center">

            <div className="w-10 h-10 mx-auto rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
              <i className="bi bi-exclamation-triangle text-amber-600" />
            </div>

            <p className="text-xs font-semibold text-slate-700 mt-3">
              Unable to load authors
            </p>

            <p className="text-[10px] text-slate-400 font-mono mt-1 max-w-lg mx-auto">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAuthors}
              className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-medium hover:bg-slate-800"
            >
              Retry
            </button>

          </div>
        ) : paginatedAuthors.length > 0 ? (

          <div>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-slate-200/80">

                    <th className="w-16 px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      #
                    </th>

                    <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Author
                    </th>

                  

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedAuthors.map((author, index) => {

                    const rowNumber =
                      (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                    return (
                      <tr
                        key={`${author}-${rowNumber}`}
                        className="group hover:bg-slate-50 transition-colors"
                      >

                        <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                          {String(rowNumber).padStart(2, '0')}
                        </td>

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-3">


                            <span
                              className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate"
                              title={author}
                            >
                              {author}
                            </span>

                          </div>

                        </td>

                       

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            <div className="px-4 py-3 bg-[#f8f9fa] border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">

              <div className="text-[10px] font-mono text-slate-400">
                SHOWING{' '}
                <span className="text-slate-600 font-semibold">
                  {startResult}
                </span>
                {' – '}
                <span className="text-slate-600 font-semibold">
                  {endResult}
                </span>
                {' OF '}
                <span className="text-slate-600 font-semibold">
                  {sortedAuthors.length}
                </span>
              </div>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <i className="bi bi-chevron-left text-[10px]" />
                </button>

                {getPageNumbers().map((page, index) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-7 h-7 flex items-center justify-center text-[10px] text-slate-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`w-7 h-7 rounded-md border text-[10px] font-mono transition ${
                        currentPage === page
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <i className="bi bi-chevron-right text-[10px]" />
                </button>

              </div>

            </div>

          </div>

        ) : (

          <div className="px-4 py-14 text-center">

            <div className="w-10 h-10 mx-auto rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
              <i className="bi bi-person-x text-slate-400" />
            </div>

            <p className="text-xs font-semibold text-slate-600 mt-3">
              NO AUTHORS FOUND
            </p>

            <p className="text-[10px] text-slate-400 font-mono mt-1">
              {searchTerm
                ? `No authors match "${searchTerm}".`
                : 'The Authors API returned no records.'}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-3 text-[10px] font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Clear filter
              </button>
            )}

          </div>

        )}

        <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">

          <span>
            GET /CRUD/get/Authors
          </span>

          <span>
            {sortedAuthors.length !== authors.length
              ? `FILTERED ${sortedAuthors.length} / ${authors.length}`
              : `${authors.length} AUTHORS`}
          </span>

        </div>

      </div>
    </div>
  );
}