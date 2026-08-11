'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchDataFromGetApi } from '../../api/Api';

const getBackendUrl = () => {
  return (
    process.env.NEXT_PUBLIC_backendAPI ||
    'http://localhost:8080'
  );
};

const normalizeArrayResponse = (response, possibleKeys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of possibleKeys) {
    if (Array.isArray(response?.[key])) {
      return response[key];
    }
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const normalizeTextList = (response, possibleKeys = []) => {
  const records = normalizeArrayResponse(
    response,
    possibleKeys
  );

  return [
    ...new Set(
      records
        .map((item) => {
          if (typeof item === 'string') {
            return item.trim();
          }

          if (item && typeof item === 'object') {
            return (
              item.name ||
              item.author ||
              item.authorName ||
              item.title ||
              item.Tags ||
              item.tags ||
              item.tag ||
              item.value ||
              item.displayName ||
              item.display_name ||
              ''
            )
              .toString()
              .trim();
          }

          return '';
        })
        .filter(Boolean)
    ),
  ];
};

const normalizeLinkages = (response) => {
  const records = normalizeArrayResponse(
    response,
    [
      'linkages',
      'Linkages',
      'options_list',
    ]
  );

  return records
    .map((item) => {
      if (typeof item === 'string') {
        return {
          displayName: item.trim(),
          category: 'raw_materials',
          tagCategory: '',
          dataName: '',
          tsItemName: '',
        };
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      return {
        id:
          item.id ||
          item._id ||
          item.linkageId ||
          '',
        displayName:
          item.displayName ||
          item.display_name ||
          item.name ||
          item.title ||
          '',
        category:
          item.category ||
          'raw_materials',
        tagCategory:
          item.tagCategory ||
          item.tag_category ||
          '',
        dataName:
          item.dataName ||
          item.data_name ||
          '',
        tsItemName:
          item.tsItemName ||
          item.ts_item_name ||
          '',
      };
    })
    .filter(
      (item) =>
        item &&
        item.displayName
    );
};

export default function CompanyPublishing() {
  const [companyName, setCompanyName] = useState('');
  const [symbol, setSymbol] = useState('');

  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState([]);
  const [linkages, setLinkages] = useState([]);

  const [rawMaterials, setRawMaterials] = useState([]);
  const [outputProducts, setOutputProducts] = useState([]);
  const [leadingIndicators, setLeadingIndicators] = useState([]);
  const [laggingIndicators, setLaggingIndicators] = useState([]);

  const [authorsList, setAuthorsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [linkagesList, setLinkagesList] = useState([]);

  const [rawMaterialInput, setRawMaterialInput] =
    useState('');

  const [outputProductInput, setOutputProductInput] =
    useState('');

  const [leadingIndicatorInput, setLeadingIndicatorInput] =
    useState('');

  const [laggingIndicatorInput, setLaggingIndicatorInput] =
    useState('');

  const [tagInput, setTagInput] = useState('');

  const [loadingMasterData, setLoadingMasterData] =
    useState(true);

  const [publishing, setPublishing] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [masterDataError, setMasterDataError] =
    useState('');

  /*
   * ----------------------------------------------------
   * FETCH MASTER DATA
   * ----------------------------------------------------
   */

  const fetchAuthors = async () => {
    const response =
      await fetchDataFromGetApi(
        'CRUD/get/Authors'
      );

    const normalized =
      normalizeTextList(
        response,
        [
          'authors',
          'Authors',
          'options_list',
        ]
      );

    setAuthorsList(normalized);
  };

  const fetchTags = async () => {
    /*
     * Endpoint supplied:
     * GET /CRUD/get/year
     *
     * If your backend later exposes:
     * GET /CRUD/get/Tags
     * change only this endpoint.
     */
    const response =
      await fetchDataFromGetApi(
        'CRUD/get/year'
      );

    const normalized =
      normalizeTextList(
        response,
        [
          'tags',
          'Tags',
          'years',
          'options_list',
        ]
      );

    setTagsList(normalized);
  };

  const fetchLinkages = async () => {
    const response =
      await fetchDataFromGetApi(
        'CRUD/get/Linkages?category=raw_materials'
      );

    const normalized =
      normalizeLinkages(response);

    setLinkagesList(normalized);
  };

  const fetchMasterData = async () => {
    try {
      setLoadingMasterData(true);
      setMasterDataError('');

      await Promise.all([
        fetchAuthors(),
        fetchTags(),
        fetchLinkages(),
      ]);
    } catch (err) {
      console.error(
        'Failed to fetch publishing master data:',
        err
      );

      setMasterDataError(
        err?.message ||
          'Unable to load Authors, Tags or Linkages.'
      );
    } finally {
      setLoadingMasterData(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  /*
   * ----------------------------------------------------
   * GENERIC ITEM FUNCTIONS
   * ----------------------------------------------------
   */

  const addItem = (
    input,
    setInput,
    items,
    setItems
  ) => {
    const value = input.trim();

    if (!value) {
      return;
    }

    if (
      items.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setInput('');
      return;
    }

    setItems((previous) => [
      ...previous,
      value,
    ]);

    setInput('');
  };

  const removeItem = (
    item,
    setItems
  ) => {
    setItems((previous) =>
      previous.filter(
        (value) => value !== item
      )
    );
  };

  const handleKeyDown = (
    event,
    input,
    setInput,
    items,
    setItems
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      addItem(
        input,
        setInput,
        items,
        setItems
      );
    }
  };

  /*
   * ----------------------------------------------------
   * TAG MANAGEMENT
   * ----------------------------------------------------
   */

  const addTag = (tag) => {
    const value =
      typeof tag === 'string'
        ? tag.trim()
        : '';

    if (!value) {
      return;
    }

    if (
      tags.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setTagInput('');
      return;
    }

    setTags((previous) => [
      ...previous,
      value,
    ]);

    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags((previous) =>
      previous.filter(
        (item) => item !== tag
      )
    );
  };

  /*
   * ----------------------------------------------------
   * LINKAGE MANAGEMENT
   * ----------------------------------------------------
   */

  const addLinkage = (linkage) => {
    if (!linkage) {
      return;
    }

    const displayName =
      typeof linkage === 'string'
        ? linkage.trim()
        : linkage.displayName?.trim();

    if (!displayName) {
      return;
    }

    if (
      linkages.some(
        (item) =>
          (
            typeof item === 'string'
              ? item
              : item.displayName
          )
            .toLowerCase() ===
          displayName.toLowerCase()
      )
    ) {
      return;
    }

    if (typeof linkage === 'string') {
      setLinkages((previous) => [
        ...previous,
        {
          displayName,
          category: 'raw_materials',
          tagCategory: '',
          dataName: '',
          tsItemName: '',
        },
      ]);
    } else {
      setLinkages((previous) => [
        ...previous,
        linkage,
      ]);
    }
  };

  const removeLinkage = (
    linkage
  ) => {
    const name =
      typeof linkage === 'string'
        ? linkage
        : linkage.displayName;

    setLinkages((previous) =>
      previous.filter(
        (item) =>
          (
            typeof item === 'string'
              ? item
              : item.displayName
          ) !== name
      )
    );
  };

  /*
   * ----------------------------------------------------
   * PUBLISH
   * ----------------------------------------------------
   */

  const handlePublish = async () => {
    setError('');
    setSuccess(false);

    if (!companyName.trim()) {
      setError(
        'Company name is required.'
      );
      return;
    }

    if (!symbol.trim()) {
      setError(
        'Company symbol is required.'
      );
      return;
    }

    if (rawMaterials.length === 0) {
      setError(
        'Add at least one raw material.'
      );
      return;
    }

    if (outputProducts.length === 0) {
      setError(
        'Add at least one output product.'
      );
      return;
    }

    try {
      setPublishing(true);

      /*
       * Payload sent to:
       * POST /Publishing/Company_v1
       */
      const payload = {
        company_name:
          companyName.trim(),

        symbol:
          symbol.trim().toUpperCase(),

        author:
          author.trim(),

        tags,

        raw_materials:
          rawMaterials,

        output_products:
          outputProducts,

        leading_indicators:
          leadingIndicators,

        lagging_indicators:
          laggingIndicators,

        linkages:
          linkages.map(
            (linkage) => ({
              displayName:
                linkage.displayName ||
                linkage.name ||
                linkage,

              category:
                linkage.category ||
                'raw_materials',

              tagCategory:
                linkage.tagCategory ||
                '',

              dataName:
                linkage.dataName ||
                '',

              tsItemName:
                linkage.tsItemName ||
                '',
            })
          ),
      };

      console.log(
        'Company Publishing Payload:',
        payload
      );

      const backendAPI =
        getBackendUrl();

      const response =
        await fetch(
          `${backendAPI}/Publishing/Company_v1`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(payload),
          }
        );

      if (!response.ok) {
        let errorMessage = '';

        try {
          const errorJson =
            await response.json();

          errorMessage =
            errorJson?.message ||
            errorJson?.error ||
            JSON.stringify(
              errorJson
            );
        } catch {
          errorMessage =
            await response.text();
        }

        throw new Error(
          errorMessage ||
            `Publishing failed with status ${response.status}`
        );
      }

      let responseData = null;

      try {
        responseData =
          await response.json();
      } catch {
        responseData = null;
      }

      console.log(
        'Company Publishing Response:',
        responseData
      );

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(
        'Company publishing error:',
        err
      );

      setError(
        err?.message ||
          'Unable to publish company configuration.'
      );
    } finally {
      setPublishing(false);
    }
  };

  /*
   * ----------------------------------------------------
   * CLEAR
   * ----------------------------------------------------
   */

  const clearForm = () => {
    setCompanyName('');
    setSymbol('');

    setAuthor('');
    setTags([]);
    setLinkages([]);

    setRawMaterials([]);
    setOutputProducts([]);
    setLeadingIndicators([]);
    setLaggingIndicators([]);

    setRawMaterialInput('');
    setOutputProductInput('');
    setLeadingIndicatorInput('');
    setLaggingIndicatorInput('');
    setTagInput('');

    setError('');
    setSuccess(false);
  };

  /*
   * ----------------------------------------------------
   * TAG SECTION
   * ----------------------------------------------------
   */

  const renderTagSection = ({
    label,
    description,
    input,
    setInput,
    items,
    setItems,
    placeholder,
  }) => (
    <div className="border-b border-slate-100 last:border-b-0">
      <div className="grid grid-cols-1 md:grid-cols-3">

        <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">
          <div className="text-[11px] font-semibold text-slate-700">
            {label}
          </div>

          <div className="text-[9px] text-slate-400 mt-1 leading-relaxed">
            {description}
          </div>
        </div>

        <div className="p-3 md:col-span-2">

          <div className="flex gap-2">

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleKeyDown(
                  event,
                  input,
                  setInput,
                  items,
                  setItems
                )
              }
              placeholder={placeholder}
              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />

            <button
              type="button"
              onClick={() =>
                addItem(
                  input,
                  setInput,
                  items,
                  setItems
                )
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 transition"
            >
              ADD
            </button>

          </div>

          {items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2.5">

              {items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600"
                >
                  {item}

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item,
                        setItems
                      )
                    }
                    className="text-slate-400 hover:text-red-500 transition"
                    title={`Remove ${item}`}
                  >
                    <i className="bi bi-x text-[11px]" />
                  </button>
                </span>
              ))}

            </div>
          ) : (
            <div className="text-[9px] text-slate-400 font-mono mt-2">
              NO ITEMS ADDED
            </div>
          )}

        </div>
      </div>
    </div>
  );

  /*
   * ----------------------------------------------------
   * COUNTER
   * ----------------------------------------------------
   */

  const totalItems = useMemo(() => {
    return (
      rawMaterials.length +
      outputProducts.length +
      leadingIndicators.length +
      laggingIndicators.length +
      tags.length +
      linkages.length
    );
  }, [
    rawMaterials,
    outputProducts,
    leadingIndicators,
    laggingIndicators,
    tags,
    linkages,
  ]);

  /*
   * ----------------------------------------------------
   * UI
   * ----------------------------------------------------
   */

  return (
    <div className="space-y-4">

      {/* PAGE HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
            CP
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Company Publishing
              </h1>

              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PUBLISH
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Configure company inputs, outputs and market intelligence mappings
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={clearForm}
            disabled={publishing}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium transition disabled:opacity-50"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {publishing ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-upload" />
                Publish Company
              </>
            )}
          </button>

          {success && (
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600"
              title="Company published successfully"
            >
              <i className="bi bi-check-lg text-sm" />
            </span>
          )}

          {error && (
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 border border-red-200 text-red-600"
              title={error}
            >
              <i className="bi bi-exclamation-lg text-sm" />
            </span>
          )}

        </div>

      </div>


      {/* MASTER DATA STATUS */}

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2 bg-[#f8f9fa] text-[10px] font-mono flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span
              className={`w-1.5 h-1.5 rounded-full ${
                loadingMasterData
                  ? 'bg-amber-500 animate-pulse'
                  : masterDataError
                    ? 'bg-red-500'
                    : 'bg-emerald-500'
              }`}
            />

            <span className="text-slate-500">
              {loadingMasterData
                ? 'LOADING MASTER DATA...'
                : masterDataError
                  ? masterDataError
                  : 'MASTER DATA CONNECTED'}
            </span>

          </div>

          <button
            type="button"
            onClick={fetchMasterData}
            disabled={loadingMasterData}
            className="text-slate-500 hover:text-slate-900 disabled:opacity-40"
          >
            <i
              className={`bi ${
                loadingMasterData
                  ? 'bi-arrow-repeat animate-spin'
                  : 'bi-arrow-clockwise'
              }`}
            />
          </button>

        </div>

      </div>


      {/* COMPANY CONFIGURATION */}

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <span>
            1 · Company Configuration
          </span>

          <span className="font-mono text-[10px] text-slate-300 font-normal">
            REQUIRED
          </span>

        </div>

        <div className="divide-y divide-slate-100">

          {/* COMPANY NAME */}

          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">

              <div className="text-[11px] font-semibold text-slate-700">
                Company Name
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Registered company name
              </div>

            </div>

            <div className="p-3 md:col-span-2">

              <input
                type="text"
                value={companyName}
                onChange={(event) =>
                  setCompanyName(
                    event.target.value
                  )
                }
                placeholder="e.g. Reliance Industries Limited"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />

            </div>

          </div>


          {/* SYMBOL */}

          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">

              <div className="text-[11px] font-semibold text-slate-700">
                Trading Symbol
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Exchange/company symbol
              </div>

            </div>

            <div className="p-3 md:col-span-2">

              <input
                type="text"
                value={symbol}
                onChange={(event) =>
                  setSymbol(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. RELIANCE"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px] font-semibold text-slate-900 uppercase focus:outline-none focus:ring-1 focus:ring-slate-400"
              />

            </div>

          </div>


          {/* AUTHOR */}

          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">

              <div className="text-[11px] font-semibold text-slate-700">
                Author
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Publishing authority / source
              </div>

            </div>

            <div className="p-3 md:col-span-2">

              <select
                value={author}
                onChange={(event) =>
                  setAuthor(
                    event.target.value
                  )
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >

                <option value="">
                  Select author...
                </option>

                {authorsList.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <div className="text-[9px] text-slate-400 font-mono mt-1">
                {authorsList.length} AUTHORS AVAILABLE
              </div>

            </div>

          </div>


          {/* TAGS */}

          <div className="grid grid-cols-1 md:grid-cols-3">

            <div className="px-4 py-3 bg-[#f8f9fa] border-r border-slate-100">

              <div className="text-[11px] font-semibold text-slate-700">
                Tags
              </div>

              <div className="text-[9px] text-slate-400 mt-1">
                Categorisation and discovery tags
              </div>

            </div>

            <div className="p-3 md:col-span-2">

              <div className="flex gap-2">

                <select
                  value=""
                  onChange={(event) =>
                    addTag(
                      event.target.value
                    )
                  }
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-slate-400"
                >

                  <option value="">
                    Select existing tag...
                  </option>

                  {tagsList.map(
                    (tag) => (
                      <option
                        key={tag}
                        value={tag}
                      >
                        {tag}
                      </option>
                    )
                  )}

                </select>

                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) =>
                    setTagInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
                    ) {
                      event.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Custom tag"
                  className="w-40 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-slate-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    addTag(tagInput)
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700"
                >
                  ADD
                </button>

              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2.5">

                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600"
                    >

                      {tag}

                      <button
                        type="button"
                        onClick={() =>
                          removeTag(tag)
                        }
                        className="text-slate-400 hover:text-red-500"
                      >
                        <i className="bi bi-x" />
                      </button>

                    </span>
                  ))}

                </div>
              ) : (
                <div className="text-[9px] text-slate-400 font-mono mt-2">
                  NO TAGS ADDED
                </div>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* COMPANY INTELLIGENCE */}

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <span>
            2 · Company Intelligence Mapping
          </span>

          <span className="font-mono text-[10px] text-slate-300 font-normal">
            {totalItems} ITEMS
          </span>

        </div>


        {/* RAW MATERIALS */}

        {renderTagSection({
          label: 'Raw Materials',
          description:
            'Key inputs / commodities required by the company.',
          input:
            rawMaterialInput,
          setInput:
            setRawMaterialInput,
          items:
            rawMaterials,
          setItems:
            setRawMaterials,
          placeholder:
            'e.g. crude_oil',
        })}


        {/* OUTPUT PRODUCTS */}

        {renderTagSection({
          label: 'Output Products',
          description:
            'Primary products or outputs generated by the company.',
          input:
            outputProductInput,
          setInput:
            setOutputProductInput,
          items:
            outputProducts,
          setItems:
            setOutputProducts,
          placeholder:
            'e.g. petrochemicals',
        })}


        {/* LEADING INDICATORS */}

        {renderTagSection({
          label: 'Leading Indicators',
          description:
            'External indicators that may provide forward-looking signals.',
          input:
            leadingIndicatorInput,
          setInput:
            setLeadingIndicatorInput,
          items:
            leadingIndicators,
          setItems:
            setLeadingIndicators,
          placeholder:
            'e.g. brent_crude_futures',
        })}


        {/* LAGGING INDICATORS */}

        {renderTagSection({
          label: 'Lagging Indicators',
          description:
            'Company or market indicators reflecting historical performance.',
          input:
            laggingIndicatorInput,
          setInput:
            setLaggingIndicatorInput,
          items:
            laggingIndicators,
          setItems:
            setLaggingIndicators,
          placeholder:
            'e.g. quarterly_gross_refining_margin',
        })}

      </div>


      {/* LINKAGES */}

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span>
              3 · Linkage Mapping
            </span>

            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
              RAW MATERIALS
            </span>

          </div>

          <span className="font-mono text-[10px] text-slate-300 font-normal">
            {linkages.length} SELECTED
          </span>

        </div>

        <div className="p-3">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

            <div className="md:col-span-2">

              <select
                value=""
                onChange={(event) => {
                  const selected =
                    linkagesList.find(
                      (item) =>
                        item.displayName ===
                        event.target.value
                    );

                  if (selected) {
                    addLinkage(selected);
                  }
                }}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-slate-400"
              >

                <option value="">
                  Select raw material linkage...
                </option>

                {linkagesList.map(
                  (linkage) => (
                    <option
                      key={
                        linkage.id ||
                        linkage.displayName
                      }
                      value={
                        linkage.displayName
                      }
                    >
                      {linkage.displayName}
                      {linkage.tagCategory
                        ? ` — ${linkage.tagCategory}`
                        : ''}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="flex items-center text-[9px] font-mono text-slate-400 px-2">
              {linkagesList.length} LINKAGES AVAILABLE
            </div>

          </div>

          {linkages.length > 0 ? (
            <div className="mt-3 space-y-1.5">

              {linkages.map(
                (linkage) => (
                  <div
                    key={
                      linkage.id ||
                      linkage.displayName
                    }
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                  >

                    <div className="min-w-0">

                      <div className="text-[10px] font-semibold text-slate-700 truncate">
                        {linkage.displayName}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-0.5 text-[9px] font-mono text-slate-400">

                        {linkage.tagCategory && (
                          <span>
                            TAG: {linkage.tagCategory}
                          </span>
                        )}

                        {linkage.dataName && (
                          <span>
                            DATA: {linkage.dataName}
                          </span>
                        )}

                        {linkage.tsItemName && (
                          <span>
                            TS: {linkage.tsItemName}
                          </span>
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeLinkage(
                          linkage
                        )
                      }
                      className="shrink-0 text-slate-400 hover:text-red-500"
                    >
                      <i className="bi bi-x text-[12px]" />
                    </button>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="text-[9px] text-slate-400 font-mono mt-3">
              NO LINKAGES SELECTED
            </div>
          )}

        </div>

      </div>


      {/* ERROR MESSAGE */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">

          <div className="w-7 h-7 shrink-0 rounded-md bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
            <i className="bi bi-exclamation-triangle text-xs" />
          </div>

          <div>

            <div className="text-[11px] font-semibold text-red-700">
              Publishing failed
            </div>

            <div className="text-[10px] text-red-600 mt-0.5 font-mono">
              {error}
            </div>

          </div>

        </div>
      )}


      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">

          <div className="w-7 h-7 shrink-0 rounded-md bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <i className="bi bi-check-lg text-xs" />
          </div>

          <div>

            <div className="text-[11px] font-semibold text-emerald-700">
              Company published successfully
            </div>

            <div className="text-[10px] text-emerald-600 mt-0.5 font-mono">
              Company configuration has been sent to the publishing API.
            </div>

          </div>

        </div>
      )}


      {/* API FOOTER */}

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">

        <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[9px] font-mono text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

          <span>
            POST /Publishing/Company_v1
          </span>

          <span>
            {symbol
              ? `TARGET: ${symbol.toUpperCase()}`
              : 'TARGET: NONE'}
            {' · '}
            {totalItems} MAPPINGS
          </span>

        </div>

      </div>

    </div>
  );
}