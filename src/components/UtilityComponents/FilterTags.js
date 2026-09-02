'use client';

import React from 'react';

const FilterTags = ({ applied_filters = {} }) => {
  const data = applied_filters;

  const extractValues = (items) => {
    if (!items) return [];
    if (Array.isArray(items)) {
      return items.map((item) => (typeof item === 'object' ? item.value || item.label : item));
    }
    return typeof items === 'object' ? [items.value || items.label] : [items];
  };

  const years = extractValues(data.year);
  const authors = extractValues(data.author);
  const tags = extractValues(data.tags);

  const sector = data.sector_filters?.sector || null;
  const sub1 = data.sector_filters?.sub1
    ? Array.isArray(data.sector_filters.sub1)
      ? data.sector_filters.sub1
      : data.sector_filters.sub1.split(',').map((s) => s.trim())
    : [];

  const hasAnyFilters = sector || sub1.length > 0 || authors.length > 0 || years.length > 0 || tags.length > 0;

  if (!hasAnyFilters) {
    return (
      <div className="w-full py-4 text-center">
        <p className="text-xs text-slate-400">No filters applied</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap items-center gap-2 py-1">
      {/* Sector Pill */}
      {sector && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-xs">
          <span className="text-slate-400 mr-1.5 font-normal">Sector:</span>
          {sector}
        </span>
      )}

      {/* Sub-Sector Pills */}
      {sub1.map((sub, idx) => (
        <span
          key={`sub1-${idx}`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-xs"
        >
          <span className="text-slate-400 mr-1.5 font-normal">Sub:</span>
          {sub}
        </span>
      ))}

      {/* Author Pills */}
      {authors.map((author, idx) => (
        <span
          key={`author-${idx}`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200/80 shadow-xs"
        >
          <span className="text-sky-500 mr-1.5 font-normal">Author:</span>
          {author}
        </span>
      ))}

      {/* Year Pills */}
      {years.map((year, idx) => (
        <span
          key={`year-${idx}`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs"
        >
          <span className="text-emerald-500 mr-1.5 font-normal">Year:</span>
          {year}
        </span>
      ))}

      {/* Tag Pills */}
      {tags.map((tag, idx) => (
        <span
          key={`tag-${idx}`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-xs"
        >
          <span className="text-indigo-400 mr-1.5 font-normal">Tag:</span>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default FilterTags;