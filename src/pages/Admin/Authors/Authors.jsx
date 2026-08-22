'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchDataFromGetApi } from '../../api/Api';

const ITEMS_PER_PAGE = 15;

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_backendAPI || 'http://localhost:8080'
).replace(/\/$/, '');

const TABS = {
  AUTHORS: 'authors',
  TAGS: 'tags',
  LINKAGES: 'linkages',
  UNITS: 'units',
  GRANULARITY: 'granularity',
};

const LINKAGE_CATEGORIES = [
  {
    value: 'raw_materials',
    label: 'Raw Materials',
  },
  {
    value: 'operating_cost',
    label: 'Operating Cost',
  },
  {
    value: 'capital_expenditure',
    label: 'Capital Expenditure',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export default function Authors() {
  const [activeTab, setActiveTab] = useState(TABS.AUTHORS);

  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [authorSort, setAuthorSort] = useState('asc');
  const [authorPage, setAuthorPage] = useState(1);
  const [newAuthor, setNewAuthor] = useState('');
  const [addingAuthor, setAddingAuthor] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [tagSort, setTagSort] = useState('asc');
  const [tagPage, setTagPage] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  const [linkages, setLinkages] = useState([]);
  const [linkagesLoading, setLinkagesLoading] = useState(false);
  const [linkagesError, setLinkagesError] = useState('');
  const [linkageSearch, setLinkageSearch] = useState('');
  const [linkageSort, setLinkageSort] = useState('asc');
  const [linkagePage, setLinkagePage] = useState(1);
  const [linkageCategory, setLinkageCategory] = useState('raw_materials');
  const [newLinkage, setNewLinkage] = useState({
    displayName: '',
    category: 'raw_materials',
    tagCategory: '',
    dataName: '',
    tsItemName: '',
  });
  const [addingLinkage, setAddingLinkage] = useState(false);

  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [unitsError, setUnitsError] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [unitSort, setUnitSort] = useState('asc');
  const [unitPage, setUnitPage] = useState(1);
  const [newUnit, setNewUnit] = useState('');
  const [addingUnit, setAddingUnit] = useState(false);

  const [granularities, setGranularities] = useState([]);
  const [granularityLoading, setGranularityLoading] = useState(false);
  const [granularityError, setGranularityError] = useState('');
  const [granularitySearch, setGranularitySearch] = useState('');
  const [granularitySort, setGranularitySort] = useState('asc');
  const [granularityPage, setGranularityPage] = useState(1);
  const [newGranularity, setNewGranularity] = useState('');
  const [addingGranularity, setAddingGranularity] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [requestError, setRequestError] = useState('');

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setRequestError('');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3500);
  };

  const showError = (message) => {
    setRequestError(message);
    setSuccessMessage('');
  };

  const postData = async (endpoint, body) => {
    const response = await fetch(
      `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    let responseData = null;

    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const message =
        responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`;

      throw new Error(message);
    }

    return responseData;
  };

  const fetchAuthors = async () => {
    try {
      setAuthorsLoading(true);
      setAuthorsError('');

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
              author.Authors ||
              author.authors ||
              author.name ||
              author.author ||
              author.authorName ||
              author.title ||
              ''
            )
              .toString()
              .trim();
          }

          return '';
        })
        .filter(Boolean);

      setAuthors([...new Set(normalizedAuthors)]);
      setAuthorPage(1);
    } catch (err) {
      console.error('Failed to fetch authors:', err);
      setAuthorsError(err?.message || 'Failed to load authors.');
      setAuthors([]);
    } finally {
      setAuthorsLoading(false);
    }
  };

  const handleAddAuthor = async (event) => {
    event.preventDefault();

    const value = newAuthor.trim();

    if (!value) {
      showError('Author name is required.');
      return;
    }

    try {
      setAddingAuthor(true);
      setRequestError('');

      await postData('CRUD/post/Authors', {
        Authors: value,
      });

      setNewAuthor('');
      showSuccess(`Author "${value}" added successfully.`);
      await fetchAuthors();
    } catch (err) {
      console.error('Failed to add author:', err);
      showError(err?.message || 'Failed to add author.');
    } finally {
      setAddingAuthor(false);
    }
  };

  const fetchTags = async () => {
    try {
      setTagsLoading(true);
      setTagsError('');

      const response = await fetchDataFromGetApi('CRUD/get/Tags');

      console.log('Tags API Response:', response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.options_list)) {
        records = response.options_list;
      } else if (Array.isArray(response?.tags)) {
        records = response.tags;
      } else if (Array.isArray(response?.Tags)) {
        records = response.Tags;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      } else if (response && typeof response === 'object') {
        records = Object.values(response);
      }

      const normalizedTags = records
        .flat()
        .map((tag) => {
          if (typeof tag === 'string') {
            return tag.trim();
          }

          if (tag && typeof tag === 'object') {
            return (
              tag.Tags ||
              tag.tags ||
              tag.name ||
              tag.tag ||
              tag.title ||
              tag.year ||
              ''
            )
              .toString()
              .trim();
          }

          return '';
        })
        .filter(Boolean);

      setTags([...new Set(normalizedTags)]);
      setTagPage(1);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setTagsError(err?.message || 'Failed to load tags.');
      setTags([]);
    } finally {
      setTagsLoading(false);
    }
  };

  const handleAddTag = async (event) => {
    event.preventDefault();

    const value = newTag.trim();

    if (!value) {
      showError('Tag name is required.');
      return;
    }

    try {
      setAddingTag(true);
      setRequestError('');

      await postData('CRUD/post/Tags', {
        Tags: value,
      });

      setNewTag('');
      showSuccess(`Tag "${value}" added successfully.`);
      await fetchTags();
    } catch (err) {
      console.error('Failed to add tag:', err);
      showError(err?.message || 'Failed to add tag.');
    } finally {
      setAddingTag(false);
    }
  };

  const fetchLinkages = async (category = linkageCategory) => {
    try {
      setLinkagesLoading(true);
      setLinkagesError('');

      const endpoint = `CRUD/get/Linkages?category=${encodeURIComponent(category)}`;
      const response = await fetchDataFromGetApi(endpoint);

      console.log('Linkages API Response:', response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.options_list)) {
        records = response.options_list;
      } else if (Array.isArray(response?.linkages)) {
        records = response.linkages;
      } else if (Array.isArray(response?.Linkages)) {
        records = response.Linkages;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      }

      const normalizedLinkages = records
        .filter(Boolean)
        .map((item) => {
          if (typeof item === 'string') {
            return {
              displayName: item,
              category,
              tagCategory: '',
              dataName: '',
              tsItemName: '',
            };
          }

          return {
            ...item,
            displayName:
              item.display_name ||
              item.displayName ||
              item.DisplayName ||
              item.name ||
              '',
            category: item.category || category || '',
            tagCategory:
              item.tag_category ||
              item.tagCategory ||
              item.TagCategory ||
              '',
            dataName:
              item.key ||
              item.data_name ||
              item.dataName ||
              item.DataName ||
              '',
            tsItemName:
              item.ts_item_name ||
              item.tsItemName ||
              item.TsItemName ||
              '',
          };
        });

      console.log('Normalized Linkages:', normalizedLinkages);

      setLinkages(normalizedLinkages);
      setLinkagePage(1);
    } catch (err) {
      console.error('Failed to fetch linkages:', err);
      setLinkagesError(err?.message || 'Failed to load linkages.');
      setLinkages([]);
    } finally {
      setLinkagesLoading(false);
    }
  };

  const handleAddLinkage = async (event) => {
    event.preventDefault();

    const displayName = newLinkage.displayName.trim();

    if (!displayName) {
      showError('Display Name is required.');
      return;
    }

    if (!newLinkage.category) {
      showError('Category is required.');
      return;
    }

    try {
      setAddingLinkage(true);
      setRequestError('');

      const payload = {
        displayName,
        category: newLinkage.category,
        tagCategory: newLinkage.tagCategory.trim(),
        dataName: newLinkage.dataName.trim(),
        tsItemName: newLinkage.tsItemName.trim(),
      };

      await postData('CRUD/post/Linkages', payload);

      setNewLinkage({
        displayName: '',
        category: newLinkage.category,
        tagCategory: '',
        dataName: '',
        tsItemName: '',
      });

      showSuccess(`Linkage "${displayName}" added successfully.`);
      await fetchLinkages(newLinkage.category);
    } catch (err) {
      console.error('Failed to add linkage:', err);
      showError(err?.message || 'Failed to add linkage.');
    } finally {
      setAddingLinkage(false);
    }
  };

  const fetchUnits = async () => {
    try {
      setUnitsLoading(true);
      setUnitsError('');

      const response = await fetchDataFromGetApi('CRUD/get/Units');

      console.log('Units API Response:', response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.options_list)) {
        records = response.options_list;
      } else if (Array.isArray(response?.units)) {
        records = response.units;
      } else if (Array.isArray(response?.Units)) {
        records = response.Units;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      } else if (response && typeof response === 'object') {
        records = Object.values(response);
      }

      const normalizedUnits = records
        .flat()
        .map((unit) => {
          if (typeof unit === 'string') {
            return unit.trim();
          }

          if (unit && typeof unit === 'object') {
            return (
              unit.Units ||
              unit.units ||
              unit.name ||
              unit.unit ||
              unit.title ||
              ''
            )
              .toString()
              .trim();
          }

          return '';
        })
        .filter(Boolean);

      setUnits([...new Set(normalizedUnits)]);
      setUnitPage(1);
    } catch (err) {
      console.error('Failed to fetch units:', err);
      setUnitsError(err?.message || 'Failed to load units.');
      setUnits([]);
    } finally {
      setUnitsLoading(false);
    }
  };

  const handleAddUnit = async (event) => {
    event.preventDefault();

    const value = newUnit.trim();

    if (!value) {
      showError('Unit is required.');
      return;
    }

    try {
      setAddingUnit(true);
      setRequestError('');

      await postData('CRUD/post/Units', {
        Units: value,
      });

      setNewUnit('');
      showSuccess(`Unit "${value}" added successfully.`);
      await fetchUnits();
    } catch (err) {
      console.error('Failed to add unit:', err);
      showError(err?.message || 'Failed to add unit.');
    } finally {
      setAddingUnit(false);
    }
  };

  const fetchGranularities = async () => {
    try {
      setGranularityLoading(true);
      setGranularityError('');

      const response = await fetchDataFromGetApi('CRUD/get/Granularity');

      console.log('Granularity API Response:', response);

      let records = [];

      if (Array.isArray(response)) {
        records = response;
      } else if (Array.isArray(response?.options_list)) {
        records = response.options_list;
      } else if (Array.isArray(response?.granularity)) {
        records = response.granularity;
      } else if (Array.isArray(response?.Granularity)) {
        records = response.Granularity;
      } else if (Array.isArray(response?.data)) {
        records = response.data;
      } else if (response && typeof response === 'object') {
        records = Object.values(response);
      }

      const normalizedGranularities = records
        .flat()
        .map((item) => {
          if (typeof item === 'string') {
            return item.trim();
          }

          if (item && typeof item === 'object') {
            return (
              item.Granularity ||
              item.granularity ||
              item.name ||
              item.title ||
              ''
            )
              .toString()
              .trim();
          }

          return '';
        })
        .filter(Boolean);

      setGranularities([...new Set(normalizedGranularities)]);
      setGranularityPage(1);
    } catch (err) {
      console.error('Failed to fetch granularity:', err);
      setGranularityError(err?.message || 'Failed to load granularity.');
      setGranularities([]);
    } finally {
      setGranularityLoading(false);
    }
  };

  const handleAddGranularity = async (event) => {
    event.preventDefault();

    const value = newGranularity.trim();

    if (!value) {
      showError('Granularity is required.');
      return;
    }

    try {
      setAddingGranularity(true);
      setRequestError('');

      await postData('CRUD/post/Granularity', {
        Granularity: value,
      });

      setNewGranularity('');
      showSuccess(`Granularity "${value}" added successfully.`);
      await fetchGranularities();
    } catch (err) {
      console.error('Failed to add granularity:', err);
      showError(err?.message || 'Failed to add granularity.');
    } finally {
      setAddingGranularity(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (activeTab === TABS.TAGS && tags.length === 0 && !tagsLoading) {
      fetchTags();
    }

    if (activeTab === TABS.LINKAGES && linkages.length === 0 && !linkagesLoading) {
      fetchLinkages(linkageCategory);
    }

    if (activeTab === TABS.UNITS && units.length === 0 && !unitsLoading) {
      fetchUnits();
    }

    if (activeTab === TABS.GRANULARITY && granularities.length === 0 && !granularityLoading) {
      fetchGranularities();
    }
  }, [activeTab]);

  const filteredAuthors = useMemo(() => {
    const term = authorSearch.trim().toLowerCase();

    if (!term) {
      return authors;
    }

    return authors.filter((author) => author.toLowerCase().includes(term));
  }, [authors, authorSearch]);

  const sortedAuthors = useMemo(() => {
    return [...filteredAuthors].sort((a, b) => {
      const result = a.localeCompare(b, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return authorSort === 'asc' ? result : -result;
    });
  }, [filteredAuthors, authorSort]);

  const authorTotalPages = Math.max(
    1,
    Math.ceil(sortedAuthors.length / ITEMS_PER_PAGE)
  );

  const paginatedAuthors = useMemo(() => {
    const start = (authorPage - 1) * ITEMS_PER_PAGE;

    return sortedAuthors.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedAuthors, authorPage]);

  const filteredTags = useMemo(() => {
    const term = tagSearch.trim().toLowerCase();

    if (!term) {
      return tags;
    }

    return tags.filter((tag) => tag.toLowerCase().includes(term));
  }, [tags, tagSearch]);

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => {
      const result = a.localeCompare(b, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return tagSort === 'asc' ? result : -result;
    });
  }, [filteredTags, tagSort]);

  const tagTotalPages = Math.max(
    1,
    Math.ceil(sortedTags.length / ITEMS_PER_PAGE)
  );

  const paginatedTags = useMemo(() => {
    const start = (tagPage - 1) * ITEMS_PER_PAGE;

    return sortedTags.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTags, tagPage]);

  const filteredLinkages = useMemo(() => {
    const term = linkageSearch.trim().toLowerCase();

    if (!term) {
      return linkages;
    }

    return linkages.filter((item) =>
      [item.displayName, item.category, item.tagCategory, item.dataName, item.tsItemName]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [linkages, linkageSearch]);

  const sortedLinkages = useMemo(() => {
    return [...filteredLinkages].sort((a, b) => {
      const result = (a.displayName || '').localeCompare(b.displayName || '', undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return linkageSort === 'asc' ? result : -result;
    });
  }, [filteredLinkages, linkageSort]);

  const linkageTotalPages = Math.max(
    1,
    Math.ceil(sortedLinkages.length / ITEMS_PER_PAGE)
  );

  const paginatedLinkages = useMemo(() => {
    const start = (linkagePage - 1) * ITEMS_PER_PAGE;

    return sortedLinkages.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedLinkages, linkagePage]);

  const filteredUnits = useMemo(() => {
    const term = unitSearch.trim().toLowerCase();

    if (!term) {
      return units;
    }

    return units.filter((unit) => unit.toLowerCase().includes(term));
  }, [units, unitSearch]);

  const sortedUnits = useMemo(() => {
    return [...filteredUnits].sort((a, b) => {
      const result = a.localeCompare(b, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return unitSort === 'asc' ? result : -result;
    });
  }, [filteredUnits, unitSort]);

  const unitTotalPages = Math.max(
    1,
    Math.ceil(sortedUnits.length / ITEMS_PER_PAGE)
  );

  const paginatedUnits = useMemo(() => {
    const start = (unitPage - 1) * ITEMS_PER_PAGE;

    return sortedUnits.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedUnits, unitPage]);

  const filteredGranularities = useMemo(() => {
    const term = granularitySearch.trim().toLowerCase();

    if (!term) {
      return granularities;
    }

    return granularities.filter((item) => item.toLowerCase().includes(term));
  }, [granularities, granularitySearch]);

  const sortedGranularities = useMemo(() => {
    return [...filteredGranularities].sort((a, b) => {
      const result = a.localeCompare(b, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return granularitySort === 'asc' ? result : -result;
    });
  }, [filteredGranularities, granularitySort]);

  const granularityTotalPages = Math.max(
    1,
    Math.ceil(sortedGranularities.length / ITEMS_PER_PAGE)
  );

  const paginatedGranularities = useMemo(() => {
    const start = (granularityPage - 1) * ITEMS_PER_PAGE;

    return sortedGranularities.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedGranularities, granularityPage]);

  const getPageNumbers = (currentPage, totalPages) => {
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

  const renderPagination = (currentPage, totalPages, setPage, totalItems) => {
    const startResult = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endResult = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
      <div className="px-4 py-3 bg-[#f8f9fa] border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-slate-400">
          SHOWING{' '}
          <span className="text-slate-600 font-semibold">{startResult}</span> –{' '}
          <span className="text-slate-600 font-semibold">{endResult}</span> OF{' '}
          <span className="text-slate-600 font-semibold">{totalItems}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <i className="bi bi-chevron-left text-[10px]" />
          </button>

          {getPageNumbers(currentPage, totalPages).map((page, index) =>
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
                onClick={() => setPage(page)}
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
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <i className="bi bi-chevron-right text-[10px]" />
          </button>
        </div>
      </div>
    );
  };

  const inputClass =
    'w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-400';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold">
            CR
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Content Registry
              </h1>

              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Manage authors, tags, data linkages, units and granularity
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200 bg-[#f8f9fa]">
          <button
            type="button"
            onClick={() => setActiveTab(TABS.AUTHORS)}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === TABS.AUTHORS
                ? 'text-slate-900 border-slate-900 bg-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <i className="bi bi-person mr-2" />
            Authors
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(TABS.TAGS)}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === TABS.TAGS
                ? 'text-slate-900 border-slate-900 bg-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <i className="bi bi-tags mr-2" />
            Tags
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(TABS.LINKAGES)}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === TABS.LINKAGES
                ? 'text-slate-900 border-slate-900 bg-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <i className="bi bi-diagram-3 mr-2" />
            Linkages
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(TABS.UNITS)}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === TABS.UNITS
                ? 'text-slate-900 border-slate-900 bg-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <i className="bi bi-rulers mr-2" />
            Units
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(TABS.GRANULARITY)}
            className={`px-5 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === TABS.GRANULARITY
                ? 'text-slate-900 border-slate-900 bg-white'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <i className="bi bi-bar-chart-steps mr-2" />
            Granularity
          </button>
        </div>

        {activeTab === TABS.AUTHORS && (
          <div>
            <div className="border-b border-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold">
                1 · Add Author
              </div>

              <form onSubmit={handleAddAuthor} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Enter author name..."
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={addingAuthor}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition disabled:opacity-50"
                  >
                    {addingAuthor ? 'Adding...' : 'Add Author'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2 · Authors Registry</span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    {authors.length} TOTAL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setAuthorSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  disabled={authors.length === 0}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 hover:text-white disabled:opacity-50"
                >
                  {authorSort === 'asc' ? 'A → Z' : 'Z → A'}
                  <i className={`bi ${authorSort === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'}`} />
                </button>
              </div>

              <div className="px-4 py-3 flex flex-col md:flex-row gap-2 justify-between">
                <div className="relative w-full md:w-80">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

                  <input
                    type="text"
                    value={authorSearch}
                    onChange={(e) => {
                      setAuthorSearch(e.target.value);
                      setAuthorPage(1);
                    }}
                    placeholder="Search authors..."
                    className={`${inputClass} pl-8`}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchAuthors}
                  disabled={authorsLoading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <i
                    className={`bi ${
                      authorsLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'
                    } mr-1.5`}
                  />
                  {authorsLoading ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {authorsError ? (
                <div className="px-4 py-12 text-center">
                  <i className="bi bi-exclamation-triangle text-amber-500 text-xl" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">
                    Unable to load authors
                  </p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">{authorsError}</p>

                  <button
                    onClick={fetchAuthors}
                    className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[10px]"
                  >
                    Retry
                  </button>
                </div>
              ) : paginatedAuthors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-y border-slate-200/80">
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
                        const rowNumber = (authorPage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <tr key={`${author}-${rowNumber}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                              {String(rowNumber).padStart(2, '0')}
                            </td>

                            <td className="px-4 py-3 text-xs font-medium text-slate-700">{author}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {renderPagination(authorPage, authorTotalPages, setAuthorPage, sortedAuthors.length)}
                </div>
              ) : (
                <div className="px-4 py-14 text-center">
                  <i className="bi bi-person-x text-slate-400 text-xl" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">NO AUTHORS FOUND</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {authorSearch
                      ? `No authors match "${authorSearch}".`
                      : 'The Authors API returned no records.'}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>GET /CRUD/get/Authors</span>
                <span>{authors.length} AUTHORS</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === TABS.TAGS && (
          <div>
            <div className="border-b border-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold">
                1 · Add Tag
              </div>

              <form onSubmit={handleAddTag} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag name..."
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={addingTag}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium disabled:opacity-50"
                  >
                    {addingTag ? 'Adding...' : 'Add Tag'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2 · Tags Registry</span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    {tags.length} TOTAL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setTagSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="text-[10px] font-mono text-slate-300 hover:text-white"
                >
                  {tagSort === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
              </div>

              <div className="px-4 py-3 flex flex-col md:flex-row justify-between gap-2">
                <div className="relative w-full md:w-80">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => {
                      setTagSearch(e.target.value);
                      setTagPage(1);
                    }}
                    placeholder="Search tags..."
                    className={`${inputClass} pl-8`}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchTags}
                  disabled={tagsLoading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <i
                    className={`bi ${
                      tagsLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'
                    } mr-1.5`}
                  />
                  {tagsLoading ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {tagsError ? (
                <div className="px-4 py-12 text-center">
                  <i className="bi bi-exclamation-triangle text-amber-500 text-xl" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">Unable to load tags</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">{tagsError}</p>

                  <button
                    onClick={fetchTags}
                    className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[10px]"
                  >
                    Retry
                  </button>
                </div>
              ) : paginatedTags.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-y border-slate-200/80">
                        <th className="w-16 px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          #
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Tag
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedTags.map((tag, index) => {
                        const rowNumber = (tagPage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <tr key={`${tag}-${rowNumber}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                              {String(rowNumber).padStart(2, '0')}
                            </td>

                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                                {tag}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {renderPagination(tagPage, tagTotalPages, setTagPage, sortedTags.length)}
                </div>
              ) : (
                <div className="px-4 py-14 text-center">
                  <i className="bi bi-tags text-slate-400 text-xl" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">NO TAGS FOUND</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {tagSearch ? `No tags match "${tagSearch}".` : 'The Tags API returned no records.'}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>GET /CRUD/get/Tags</span>
                <span>{tags.length} TAGS</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === TABS.LINKAGES && (
          <div>
            <div className="border-b border-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <span>1 · Add Linkage</span>

                <span className="font-mono text-[10px] text-slate-300">
                  POST /CRUD/post/Linkages
                </span>
              </div>

              <form onSubmit={handleAddLinkage} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Display Name
                    </label>

                    <input
                      type="text"
                      value={newLinkage.displayName}
                      onChange={(e) => setNewLinkage((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="e.g. Crude Oil"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Category
                    </label>

                    <select
                      value={newLinkage.category}
                      onChange={(e) => setNewLinkage((prev) => ({ ...prev, category: e.target.value }))}
                      className={inputClass}
                    >
                      {LINKAGE_CATEGORIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Tag Category
                    </label>

                    <input
                      type="text"
                      value={newLinkage.tagCategory}
                      onChange={(e) => setNewLinkage((prev) => ({ ...prev, tagCategory: e.target.value }))}
                      placeholder="e.g. Energy Cost"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Data Name
                    </label>

                    <input
                      type="text"
                      value={newLinkage.dataName}
                      onChange={(e) => setNewLinkage((prev) => ({ ...prev, dataName: e.target.value }))}
                      placeholder="Data name"
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      TS Item Name
                    </label>

                    <input
                      type="text"
                      value={newLinkage.tsItemName}
                      onChange={(e) => setNewLinkage((prev) => ({ ...prev, tsItemName: e.target.value }))}
                      placeholder="Time-series item name"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={addingLinkage}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium disabled:opacity-50"
                  >
                    {addingLinkage ? 'Adding...' : 'Add Linkage'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2 · Linkages Registry</span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    {linkages.length} TOTAL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLinkageSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="text-[10px] font-mono text-slate-300 hover:text-white"
                >
                  {linkageSort === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
              </div>

              <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-2">
                <div className="relative">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

                  <input
                    type="text"
                    value={linkageSearch}
                    onChange={(e) => {
                      setLinkageSearch(e.target.value);
                      setLinkagePage(1);
                    }}
                    placeholder="Search linkages..."
                    className={`${inputClass} pl-8`}
                  />
                </div>

                <select
                  value={linkageCategory}
                  onChange={(e) => {
                    const category = e.target.value;

                    setLinkageCategory(category);
                    setNewLinkage((prev) => ({ ...prev, category }));
                    setLinkagePage(1);
                    fetchLinkages(category);
                  }}
                  className={inputClass}
                >
                  {LINKAGE_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => fetchLinkages(linkageCategory)}
                  disabled={linkagesLoading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <i
                    className={`bi ${
                      linkagesLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'
                    } mr-1.5`}
                  />
                  {linkagesLoading ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {linkagesError ? (
                <div className="px-4 py-12 text-center">
                  <i className="bi bi-exclamation-triangle text-amber-500 text-xl" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">Unable to load linkages</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">{linkagesError}</p>

                  <button
                    onClick={() => fetchLinkages(linkageCategory)}
                    className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[10px]"
                  >
                    Retry
                  </button>
                </div>
              ) : paginatedLinkages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-y border-slate-200/80">
                        <th className="w-14 px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          #
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Display Name
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Category
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Tag Category
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Data Name
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          TS Item Name
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedLinkages.map((item, index) => {
                        const rowNumber = (linkagePage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <tr key={`${item.displayName}-${rowNumber}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                              {String(rowNumber).padStart(2, '0')}
                            </td>

                            <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                              {item.displayName || '—'}
                            </td>

                            <td className="px-4 py-3">
                              <span className="inline-flex px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600">
                                {item.category || '—'}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-xs text-slate-600">{item.tagCategory || '—'}</td>

                            <td className="px-4 py-3 text-xs text-slate-600">{item.dataName || '—'}</td>

                            <td className="px-4 py-3 text-xs text-slate-600">{item.tsItemName || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {renderPagination(linkagePage, linkageTotalPages, setLinkagePage, sortedLinkages.length)}
                </div>
              ) : (
                <div className="px-4 py-14 text-center">
                  <i className="bi bi-diagram-3 text-slate-400 text-xl" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">NO LINKAGES FOUND</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {linkageSearch
                      ? `No linkages match "${linkageSearch}".`
                      : `No linkages found for ${linkageCategory}.`}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>GET /CRUD/get/Linkages?category={linkageCategory}</span>
                <span>{linkages.length} LINKAGES</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === TABS.UNITS && (
          <div>
            <div className="border-b border-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <span>1 · Add Unit</span>

                <span className="font-mono text-[10px] text-slate-300">
                  POST /CRUD/post/Units
                </span>
              </div>

              <form onSubmit={handleAddUnit} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="e.g. USD/bbl"
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={addingUnit}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium disabled:opacity-50"
                  >
                    {addingUnit ? 'Adding...' : 'Add Unit'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2 · Units Registry</span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    {units.length} TOTAL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setUnitSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  disabled={units.length === 0}
                  className="text-[10px] font-mono text-slate-300 hover:text-white disabled:opacity-50"
                >
                  {unitSort === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
              </div>

              <div className="px-4 py-3 flex flex-col md:flex-row justify-between gap-2">
                <div className="relative w-full md:w-80">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

                  <input
                    type="text"
                    value={unitSearch}
                    onChange={(e) => {
                      setUnitSearch(e.target.value);
                      setUnitPage(1);
                    }}
                    placeholder="Search units..."
                    className={`${inputClass} pl-8`}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchUnits}
                  disabled={unitsLoading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <i
                    className={`bi ${
                      unitsLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'
                    } mr-1.5`}
                  />
                  {unitsLoading ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {unitsError ? (
                <div className="px-4 py-12 text-center">
                  <i className="bi bi-exclamation-triangle text-amber-500 text-xl" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">Unable to load units</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">{unitsError}</p>

                  <button
                    onClick={fetchUnits}
                    className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[10px]"
                  >
                    Retry
                  </button>
                </div>
              ) : paginatedUnits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-y border-slate-200/80">
                        <th className="w-16 px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          #
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Unit
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedUnits.map((unit, index) => {
                        const rowNumber = (unitPage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <tr key={`${unit}-${rowNumber}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                              {String(rowNumber).padStart(2, '0')}
                            </td>

                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                                {unit}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {renderPagination(unitPage, unitTotalPages, setUnitPage, sortedUnits.length)}
                </div>
              ) : (
                <div className="px-4 py-14 text-center">
                  <i className="bi bi-rulers text-slate-400 text-xl" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">NO UNITS FOUND</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {unitSearch ? `No units match "${unitSearch}".` : 'The Units API returned no records.'}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>GET /CRUD/get/Units</span>
                <span>{units.length} UNITS</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === TABS.GRANULARITY && (
          <div>
            <div className="border-b border-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <span>1 · Add Granularity</span>

                <span className="font-mono text-[10px] text-slate-300">
                  POST /CRUD/post/Granularity
                </span>
              </div>

              <form onSubmit={handleAddGranularity} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    value={newGranularity}
                    onChange={(e) => setNewGranularity(e.target.value)}
                    placeholder="e.g. Monthly Cumulative"
                    className={inputClass}
                  />

                  <button
                    type="submit"
                    disabled={addingGranularity}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium disabled:opacity-50"
                  >
                    {addingGranularity ? 'Adding...' : 'Add Granularity'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>2 · Granularity Registry</span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    {granularities.length} TOTAL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setGranularitySort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  disabled={granularities.length === 0}
                  className="text-[10px] font-mono text-slate-300 hover:text-white disabled:opacity-50"
                >
                  {granularitySort === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
              </div>

              <div className="px-4 py-3 flex flex-col md:flex-row justify-between gap-2">
                <div className="relative w-full md:w-80">
                  <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]" />

                  <input
                    type="text"
                    value={granularitySearch}
                    onChange={(e) => {
                      setGranularitySearch(e.target.value);
                      setGranularityPage(1);
                    }}
                    placeholder="Search granularity..."
                    className={`${inputClass} pl-8`}
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchGranularities}
                  disabled={granularityLoading}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <i
                    className={`bi ${
                      granularityLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'
                    } mr-1.5`}
                  />
                  {granularityLoading ? 'Fetching...' : 'Refresh'}
                </button>
              </div>

              {granularityError ? (
                <div className="px-4 py-12 text-center">
                  <i className="bi bi-exclamation-triangle text-amber-500 text-xl" />

                  <p className="text-xs font-semibold text-slate-700 mt-3">Unable to load granularity</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">{granularityError}</p>

                  <button
                    onClick={fetchGranularities}
                    className="mt-4 px-3 py-1.5 bg-slate-900 text-white rounded-md text-[10px]"
                  >
                    Retry
                  </button>
                </div>
              ) : paginatedGranularities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-y border-slate-200/80">
                        <th className="w-16 px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          #
                        </th>

                        <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Granularity
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedGranularities.map((item, index) => {
                        const rowNumber = (granularityPage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <tr key={`${item}-${rowNumber}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">
                              {String(rowNumber).padStart(2, '0')}
                            </td>

                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                                {item}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {renderPagination(
                    granularityPage,
                    granularityTotalPages,
                    setGranularityPage,
                    sortedGranularities.length
                  )}
                </div>
              ) : (
                <div className="px-4 py-14 text-center">
                  <i className="bi bi-bar-chart-steps text-slate-400 text-xl" />

                  <p className="text-xs font-semibold text-slate-600 mt-3">NO GRANULARITY FOUND</p>

                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {granularitySearch
                      ? `No granularity matches "${granularitySearch}".`
                      : 'The Granularity API returned no records.'}
                  </p>
                </div>
              )}

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>GET /CRUD/get/Granularity</span>
                <span>{granularities.length} GRANULARITY</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {(successMessage || requestError) && (
        <div
          className={`px-4 py-2.5 rounded-lg border text-[10px] font-mono flex items-center gap-2 ${
            requestError
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${requestError ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
          {requestError || successMessage}
        </div>
      )}
    </div>
  );
}