'use client';

import { useState, useMemo, useEffect } from 'react';

import {
  fetchDataFromGetApi,
  fetchDataFromPostApi,
} from '../../api/Api';

import {
  AgGridReact,
  AgGridProvider,
} from 'ag-grid-react';

import {
  AllEnterpriseModule,
} from 'ag-grid-enterprise';

import {
  themeQuartz,
} from 'ag-grid-community';

import SectorHierarchyDropDown from '../../../components/Functionalities/Admin/SectorHierarchyDropDown';

export const config = {
  unstable_runtimeJS: true,
};

const modules = [AllEnterpriseModule];

const financialTheme = themeQuartz.withParams({
  spacing: 4,
  rowHeight: 30,
  headerHeight: 34,
  borderRadius: 0,
  backgroundColor: '#ffffff',
  foregroundColor: '#334155',
  headerBackgroundColor: '#f8f9fa',
  headerTextColor: '#475569',
  rowHoverColor: '#f8fafc',
  accentColor: '#1e3a5f',
  borderColor: '#d9dee7',
  columnBorder: true,
});

export default function PublishStagingData() {
  const [scriptId, setScriptId] = useState('MARUTI');
  const [source, setSource] = useState('AR');
  const [stagingData, setStagingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(
    'Enter Script ID and Source, then click Fetch Staging.'
  );
  const [companyName, setCompanyName] = useState('');
  const [sectorHierarchy, setSectorHierarchy] = useState({});
  const [units, setUnits] = useState('');
  const [granularity, setGranularity] = useState('');
  const [unitOptions, setUnitOptions] = useState([]);
  const [granularityOptions, setGranularityOptions] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingGranularity, setLoadingGranularity] = useState(false);
  const [formValues, setFormValues] = useState({});

  const normalizeOptionItem = (item) => {
    if (
      typeof item === 'string' ||
      typeof item === 'number'
    ) {
      return String(item);
    }

    if (!item || typeof item !== 'object') {
      return null;
    }

    const preferredKeys = [
      'name',
      'label',
      'value',
      'unit',
      'units',
      'granularity',
      'frequency',
      'option',
      'text',
      'title',
      'display_name',
      'displayName',
      'description',
      'key',
    ];

    for (const key of preferredKeys) {
      const value = item[key];

      if (
        typeof value === 'string' ||
        typeof value === 'number'
      ) {
        const cleanedValue = String(value).trim();

        if (cleanedValue) {
          return cleanedValue;
        }
      }
    }

    const objectValues = Object.values(item);

    for (const value of objectValues) {
      if (
        typeof value === 'string' ||
        typeof value === 'number'
      ) {
        const cleanedValue = String(value).trim();

        if (cleanedValue) {
          return cleanedValue;
        }
      }
    }

    return null;
  };

  const normalizeOptionsResponse = (
    response,
    possibleKeys = []
  ) => {
    if (
      response === null ||
      response === undefined
    ) {
      return [];
    }

    let data = response;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error(
          'Unable to parse options API response:',
          error
        );

        return [];
      }
    }

    if (Array.isArray(data)) {
      return data
        .map(normalizeOptionItem)
        .filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            value !== ''
        );
    }

    if (
      typeof data !== 'object'
    ) {
      return [];
    }

    const keysToCheck = [
      'options_list',
      ...possibleKeys,
      'data',
      'result',
      'results',
    ];

    for (const key of keysToCheck) {
      const value = data[key];

      if (Array.isArray(value)) {
        const normalized = value
          .map(normalizeOptionItem)
          .filter(
            (item) =>
              item !== null &&
              item !== undefined &&
              item !== ''
          );

        if (normalized.length > 0) {
          return normalized;
        }
      }
    }

    const directValue =
      normalizeOptionItem(data);

    if (
      directValue !== null &&
      directValue !== undefined &&
      directValue !== ''
    ) {
      return [directValue];
    }

    for (const key of keysToCheck) {
      const nestedValue = data[key];

      if (
        nestedValue &&
        typeof nestedValue === 'object' &&
        !Array.isArray(nestedValue)
      ) {
        const normalized =
          normalizeOptionsResponse(
            nestedValue,
            []
          );

        if (normalized.length > 0) {
          return normalized;
        }
      }
    }

    return [];
  };

  useEffect(() => {
    let mounted = true;

    const loadUnitsAndGranularity = async () => {
      try {
        setLoadingUnits(true);
        setLoadingGranularity(true);
        setFetchError(null);

        const [
          granularityResponse,
          unitsResponse,
        ] = await Promise.all([
          fetchDataFromGetApi(
            'CRUD/get/Granularity'
          ),
          fetchDataFromGetApi(
            'CRUD/get/Units'
          ),
        ]);

        console.log(
          'Granularity API Response:',
          granularityResponse
        );

        console.log(
          'Units API Response:',
          unitsResponse
        );

        const normalizedGranularity =
          normalizeOptionsResponse(
            granularityResponse,
            [
              'granularity',
              'granularities',
              'frequencies',
              'frequency',
            ]
          );

        const normalizedUnits =
          normalizeOptionsResponse(
            unitsResponse,
            [
              'units',
              'unit',
            ]
          );

        const uniqueGranularity = [
          ...new Set(
            normalizedGranularity
          ),
        ];

        const uniqueUnits = [
          ...new Set(
            normalizedUnits
          ),
        ];

        console.log(
          'Normalized Granularity:',
          uniqueGranularity
        );

        console.log(
          'Normalized Units:',
          uniqueUnits
        );

        if (!mounted) {
          return;
        }

        setGranularityOptions(
          uniqueGranularity
        );

        setUnitOptions(
          uniqueUnits
        );

        if (
          uniqueGranularity.length > 0
        ) {
          setGranularity(
            uniqueGranularity[0]
          );
        }

        if (
          uniqueUnits.length > 0
        ) {
          setUnits(
            uniqueUnits[0]
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch Units/Granularity:',
          error
        );

        if (!mounted) {
          return;
        }

        setFetchError(
          error?.message ||
          'Failed to load Units and Granularity.'
        );
      } finally {
        if (mounted) {
          setLoadingUnits(false);
          setLoadingGranularity(false);
        }
      }
    };

    loadUnitsAndGranularity();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizeData = (record) => {
    if (
      !record ||
      typeof record !== 'object'
    ) {
      return [];
    }

    let data = record.data;

    if (
      typeof data === 'string'
    ) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error(
          'Unable to parse staging data:',
          error
        );

        return [];
      }
    }

    if (!data) {
      return [];
    }

    if (
      Array.isArray(data)
    ) {
      return data;
    }

    if (
      Array.isArray(data.children)
    ) {
      return [data];
    }

    return [data];
  };

  const rawApiRows = useMemo(() => {
    const rows = [];

    const extractMetrics = (
      node,
      parentPath = '',
      recordIndex = 0
    ) => {
      if (
        !node ||
        typeof node !== 'object'
      ) {
        return;
      }

      const metricName =
        node.name ||
        node.label ||
        node.title ||
        'Unnamed metric';

      const metricId =
        node.id ||
        `${metricName}-${recordIndex}-${rows.length}`;

      const children =
        Array.isArray(node.children)
          ? node.children
          : [];

      const hasChildren =
        children.length > 0;

      if (!hasChildren) {
        const hasValue =
          node.value !== undefined &&
          node.value !== null;

        const hasMetricData =
          node.name ||
          node.label ||
          node.title ||
          node.id ||
          hasValue ||
          node.units;

        if (hasMetricData) {
          rows.push({
            name: metricName,
            id: metricId,
            units:
              node.units || '—',
            value:
              hasValue
                ? node.value
                : '',
            path:
              parentPath,
            recordIndex,
            hasChildren: false,
          });
        }

        return;
      }

      children.forEach(
        (child) => {
          extractMetrics(
            child,
            metricName
              ? `${parentPath}${parentPath ? ' → ' : ''}${metricName}`
              : parentPath,
            recordIndex
          );
        }
      );
    };

    stagingData.forEach(
      (record, recordIndex) => {
        normalizeData(
          record
        ).forEach(
          (node) => {
            extractMetrics(
              node,
              '',
              recordIndex
            );
          }
        );
      }
    );

    return rows;
  }, [stagingData]);

  const tableRows = useMemo(() => {
    const rows = [];

    const cloneNode = (
      node,
      parentPath = [],
      recordIndex = 0
    ) => {
      if (
        !node ||
        typeof node !== 'object'
      ) {
        return null;
      }

      const name =
        node.name ||
        node.label ||
        node.title ||
        'Unnamed metric';

      const id =
        node.id ||
        `${name}-${recordIndex}-${rows.length}`;

      const children =
        Array.isArray(
          node.children
        )
          ? node.children
              .map(
                (child) =>
                  cloneNode(
                    child,
                    [...parentPath, name],
                    recordIndex
                  )
              )
              .filter(Boolean)
          : [];

      const originalValue =
        node.value !== undefined &&
        node.value !== null
          ? node.value
          : '';

      const row = {
        ...node,
        name,
        id,
        units:
          node.units || '',
        value:
          originalValue,
        children,
        path: [
          ...parentPath,
          name,
        ],
        hasChildren:
          children.length > 0,
        recordIndex,
      };

      rows.push(row);

      return row;
    };

    const roots = [];

    stagingData.forEach(
      (record, recordIndex) => {
        const data =
          normalizeData(record);

        data.forEach(
          (node) => {
            const row =
              cloneNode(
                node,
                [],
                recordIndex
              );

            if (row) {
              roots.push(row);
            }
          }
        );
      }
    );

    return roots;
  }, [stagingData]);

  const gridRows = useMemo(
    () => tableRows,
    [tableRows]
  );

  const getYearHeader = () => {
    const possibleYear =
      stagingData?.[0]?.year ||
      stagingData?.[0]?.yearEnded ||
      stagingData?.[0]?.year_ended ||
      stagingData?.[0]?.financialYear ||
      stagingData?.[0]?.financial_year;

    if (possibleYear) {
      return String(possibleYear);
    }

    return 'Value';
  };

  const updateNestedValue = (
    nodes,
    targetId,
    newValue
  ) => {
    return nodes.map(
      (node) => {
        if (
          node.id === targetId
        ) {
          return {
            ...node,
            value: newValue,
          };
        }

        if (
          Array.isArray(
            node.children
          )
        ) {
          return {
            ...node,
            children:
              updateNestedValue(
                node.children,
                targetId,
                newValue
              ),
          };
        }

        return node;
      }
    );
  };

  const setTableRowsForPublish = (
    targetId,
    newValue
  ) => {
    setStagingData(
      (previous) => {
        return previous.map(
          (record) => {
            let data =
              record.data;

            if (
              typeof data === 'string'
            ) {
              try {
                data =
                  JSON.parse(data);
              } catch {
                return record;
              }
            }

            const dataIsArray =
              Array.isArray(data);

            const updatedData =
              dataIsArray
                ? updateNestedValue(
                    data,
                    targetId,
                    newValue
                  )
                : updateNestedValue(
                    [data],
                    targetId,
                    newValue
                  );

            return {
              ...record,
              data:
                dataIsArray
                  ? updatedData
                  : updatedData[0],
            };
          }
        );
      }
    );
  };

  const handleGridValueChange = (
    params
  ) => {
    const node =
      params.data;

    if (!node) {
      return;
    }

    if (node.hasChildren) {
      return;
    }

    if (
      node.value ===
      params.newValue
    ) {
      return;
    }

    setTableRowsForPublish(
      node.id,
      params.newValue
    );

    setFormValues(
      (previous) => ({
        ...previous,
        [`metric_${node.id}`]:
          params.newValue,
      })
    );

    setStatusMessage(
      'Staging value edited. Changes will be included when published.'
    );
  };

  const handleInputChange = (
    row,
    value
  ) => {
    if (row.hasChildren) {
      return;
    }

    const fieldKey =
      `metric_${row.id}`;

    setFormValues(
      (previous) => ({
        ...previous,
        [fieldKey]: value,
      })
    );

    setTableRowsForPublish(
      row.id,
      value
    );

    setStatusMessage(
      'Staging value edited. Changes will be included when published.'
    );
  };

  const handleSectorHierarchyChange = (
    pathObject
  ) => {
    const cleanPath = {};

    if (
      pathObject &&
      typeof pathObject === 'object'
    ) {
      Object.entries(
        pathObject
      ).forEach(
        ([key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            value !== ''
          ) {
            cleanPath[key] =
              value;
          }
        }
      );
    }

    setSectorHierarchy(
      cleanPath
    );
  };

  const columnDefs = useMemo(() => {
    return [
      {
        headerName: 'Units',
        field: 'units',
        width: 150,
        minWidth: 120,
        maxWidth: 180,
        cellClass:
          'units-cell',
        valueFormatter:
          (params) =>
            params.value || '',
      },
      {
        headerName:
          getYearHeader(),
        field: 'value',
        width: 220,
        minWidth: 180,
        flex: 0.35,
        editable:
          (params) =>
            !params.data?.hasChildren,
        cellClass:
          (params) =>
            params.data?.hasChildren
              ? 'financial-value-parent'
              : 'financial-value',
        valueFormatter:
          (params) => {
            if (
              params.value === null ||
              params.value === undefined ||
              params.value === ''
            ) {
              return '';
            }

            if (
              typeof params.value ===
              'number'
            ) {
              return params.value.toLocaleString(
                'en-IN'
              );
            }

            return String(
              params.value
            );
          },
      },
    ];
  }, [stagingData]);

  const autoGroupColumnDef =
    useMemo(() => {
      return {
        headerName:
          'Parameter',
        field: 'name',
        flex: 1,
        minWidth: 420,
        cellRenderer:
          'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
        },
        cellClass:
          (params) =>
            params.data?.hasChildren
              ? 'financial-parent'
              : 'financial-child',
      };
    }, []);

  const defaultColDef =
    useMemo(() => {
      return {
        sortable: false,
        resizable: true,
        suppressHeaderMenuButton:
          true,
      };
    }, []);

  const handleFetchData =
    async () => {
      const trimmedScriptId =
        scriptId.trim();

      if (!trimmedScriptId) {
        setFetchError(
          'Script ID is required.'
        );

        setStatusMessage(
          'Enter a Script ID before fetching.'
        );

        return;
      }

      if (!source.trim()) {
        setFetchError(
          'Source is required.'
        );

        setStatusMessage(
          'Enter a Source before fetching.'
        );

        return;
      }

      try {
        setLoading(true);
        setFetchError(null);
        setStagingData([]);
        setFormValues({});

        setStatusMessage(
          `Fetching staging data for ${trimmedScriptId} (${source})...`
        );

        const endpoint =
          `getStagingData?scriptID=${encodeURIComponent(
            trimmedScriptId
          )}` +
          `&source=${encodeURIComponent(
            source.trim()
          )}`;

        console.log(
          'GET:',
          endpoint
        );

        const data =
          await fetchDataFromGetApi(
            endpoint
          );

        console.log(
          'Staging API response:',
          data
        );

        const records =
          Array.isArray(data)
            ? data
            : data
              ? [data]
              : [];

        if (
          records.length === 0
        ) {
          setStagingData([]);
          setFormValues({});

          setStatusMessage(
            `No staging records found for ${trimmedScriptId} (${source}).`
          );

          return;
        }

        setStagingData(
          records
        );

        const initialInputs =
          {};

        const extractNodes =
          (node) => {
            if (
              !node ||
              typeof node !== 'object'
            ) {
              return;
            }

            const children =
              Array.isArray(
                node.children
              )
                ? node.children
                : [];

            if (
              children.length === 0 &&
              node.value !==
                undefined &&
              node.value !== null
            ) {
              const fieldKey =
                node.id ||
                node.name ||
                'unnamed_metric';

              initialInputs[
                `metric_${fieldKey}`
              ] = node.value;
            }

            children.forEach(
              extractNodes
            );
          };

        records.forEach(
          (record) => {
            normalizeData(
              record
            ).forEach(
              extractNodes
            );
          }
        );

        setFormValues(
          initialInputs
        );

        setStatusMessage(
          `Loaded ${records.length} staging record(s) for ${trimmedScriptId} (${source}).`
        );
      } catch (err) {
        console.error(
          'Failed to fetch staging data:',
          err
        );

        setFetchError(
          err?.message ||
          'Error connecting to staging API.'
        );

        setStatusMessage(
          'Fetch failed. Check API server or API connection.'
        );

        setStagingData([]);
        setFormValues({});
      } finally {
        setLoading(false);
      }
    };

  const handlePublish =
    async () => {
      if (!scriptId.trim()) {
        setStatusMessage(
          'Script ID is required.'
        );

        return;
      }

      if (!source.trim()) {
        setStatusMessage(
          'Source is required.'
        );

        return;
      }

      if (
        !stagingData.length
      ) {
        setStatusMessage(
          'No staging data available to publish.'
        );

        return;
      }

      try {
        setPublishing(true);
        setFetchError(null);

        setStatusMessage(
          'Publishing staging data...'
        );

        const cleanSectorHierarchy =
          {};

        Object.entries(
          sectorHierarchy || {}
        ).forEach(
          ([key, value]) => {
            if (
              value !== null &&
              value !== undefined &&
              value !== ''
            ) {
              cleanSectorHierarchy[
                key
              ] = value;
            }
          }
        );

        const payload = {
          scriptID:
            scriptId.trim(),

          source:
            source.trim(),

          companyName:
            companyName.trim(),

          sectorHierarchy:
            cleanSectorHierarchy,

          units,

          granularity,

          updatedValues:
            formValues,

          stagingData,
        };

        console.log(
          'POST /Publishing/TSData'
        );

        console.log(
          'Publish Payload:',
          payload
        );

        const response =
          await fetchDataFromPostApi(
            payload,
            'Publishing/TSData'
          );

        console.log(
          'Publish Response:',
          response
        );

        setStatusMessage(
          'Data published successfully.'
        );

        alert(
          'Data published successfully! ✓'
        );
      } catch (error) {
        console.error(
          'Publish error:',
          error
        );

        setFetchError(
          error?.message ||
          'Failed to publish staging data.'
        );

        setStatusMessage(
          'Publishing failed. Check the backend endpoint.'
        );

        alert(
          error?.message ||
          'Error publishing staging data ❌'
        );
      } finally {
        setPublishing(false);
      }
    };

  const isFormComplete =
    useMemo(() => {
      return Boolean(
        scriptId.trim() &&
        source.trim() &&
        stagingData.length > 0
      );
    }, [
      scriptId,
      source,
      stagingData,
    ]);

  return (
    <AgGridProvider
      modules={modules}
    >
      <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased p-4 sm:p-6">
        <div className="max-w-[1700px] mx-auto space-y-4">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                PS
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                    Publish Staging Data
                  </h1>

                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    STAGING
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Review, edit, and push staging dataset to production index
                </p>
              </div>
            </div>

            <button
              onClick={
                handleFetchData
              }
              disabled={loading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 shadow-sm disabled:opacity-50"
            >
              {loading
                ? 'Fetching...'
                : 'Fetch Staging'}
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
              <span>
                1 · Script &amp; Pipeline Configuration
              </span>

              <span className="font-mono text-[10px] text-slate-300 font-normal">
                v1.2
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="px-4 py-2.5 bg-[#f8f9fa] font-medium text-slate-600">
                  Script ID
                </div>

                <div className="p-2 md:col-span-2">
                  <input
                    type="text"
                    value={scriptId}
                    onChange={(e) =>
                      setScriptId(
                        e.target.value
                      )
                    }
                    placeholder="e.g. MARUTI"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="px-4 py-2.5 bg-[#f8f9fa] font-medium text-slate-600">
                  Source
                </div>

                <div className="p-2 md:col-span-2">
                  <input
                    type="text"
                    value={source}
                    onChange={(e) =>
                      setSource(
                        e.target.value
                      )
                    }
                    placeholder="e.g. AR, QR, PR, or custom source"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="px-4 py-2.5 bg-[#f8f9fa] font-medium text-slate-600">
                  Company Name
                </div>

                <div className="p-2 md:col-span-2">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Maruti Suzuki India Ltd"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="px-4 py-2.5 bg-[#f8f9fa] font-medium text-slate-600">
                  Sector Hierarchy
                </div>

                <div className="p-3 md:col-span-2">
                  <SectorHierarchyDropDown
                    onSelect={
                      handleSectorHierarchyChange
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="px-4 py-2.5 bg-[#f8f9fa] font-medium text-slate-600">
                  Units &amp; Granularity
                </div>

                <div className="p-2 md:col-span-2 grid grid-cols-2 gap-2">

                  <select
                    value={units}
                    onChange={(e) =>
                      setUnits(
                        e.target.value
                      )
                    }
                    disabled={
                      loadingUnits
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {loadingUnits
                        ? 'Loading units...'
                        : 'Select unit...'}
                    </option>

                    {unitOptions.map(
                      (
                        unit,
                        index
                      ) => (
                        <option
                          key={`${unit}-${index}`}
                          value={unit}
                        >
                          {unit}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={granularity}
                    onChange={(e) =>
                      setGranularity(
                        e.target.value
                      )
                    }
                    disabled={
                      loadingGranularity
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {loadingGranularity
                        ? 'Loading frequency...'
                        : 'Select frequency...'}
                    </option>

                    {granularityOptions.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={`${item}-${index}`}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                </div>
              </div>

            </div>

            <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  fetchError
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              <span
                className={
                  fetchError
                    ? 'text-amber-700'
                    : 'text-slate-500'
                }
              >
                {fetchError ||
                  statusMessage}
              </span>
            </div>
          </div>

          {stagingData.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">

              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>
                    2 · Review &amp; Edit Staging Metrics
                  </span>

                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] font-mono text-emerald-300">
                    EDITABLE
                  </span>
                </div>

                <span className="font-mono text-[10px] text-slate-300 font-normal">
                  {rawApiRows.length}{' '}
                  Metrics
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-[#f8f9fa] border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="w-[35%] px-4 py-2.5">
                        Parameter
                      </th>

                      <th className="w-[20%] px-4 py-2.5">
                        Metric ID
                      </th>

                      <th className="w-[15%] px-4 py-2.5">
                        Units
                      </th>

                      <th className="w-[30%] px-4 py-2.5 text-right">
                        Target Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {rawApiRows.length > 0 ? (
                      rawApiRows.map(
                        (
                          row,
                          index
                        ) => {
                          const currentValue =
                            formValues[
                              `metric_${row.id}`
                            ] !== undefined
                              ? formValues[
                                  `metric_${row.id}`
                                ]
                              : row.value;

                          return (
                            <tr
                              key={`${row.recordIndex}-${row.id}-${index}`}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="px-4 py-2.5">
                                <div
                                  className="font-medium text-slate-700 truncate max-w-[500px]"
                                  title={
                                    row.name
                                  }
                                >
                                  {row.name}
                                </div>

                                {row.path && (
                                  <div
                                    className="mt-0.5 text-[9px] font-mono text-slate-400 truncate max-w-[500px]"
                                    title={
                                      row.path
                                    }
                                  >
                                    {row.path}
                                  </div>
                                )}
                              </td>

                              <td
                                className="px-4 py-2.5 font-mono text-[10px] text-slate-500 truncate"
                                title={
                                  row.id
                                }
                              >
                                {row.id}
                              </td>

                              <td className="px-4 py-2.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-mono text-slate-600">
                                  {row.units}
                                </span>
                              </td>

                              <td className="px-3 py-1.5">
                                <input
                                  type="text"
                                  value={
                                    currentValue ===
                                      null ||
                                    currentValue ===
                                      undefined
                                      ? ''
                                      : currentValue
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleInputChange(
                                      row,
                                      e
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full text-right px-2 py-1.5 font-mono text-[11px] font-semibold text-slate-700 bg-transparent border border-transparent hover:border-slate-200 focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300 rounded"
                                />
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-slate-400 font-mono text-[11px]"
                        >
                          NO ACTIVE STAGING FIELDS LOADED
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>
                  LEAF VALUES ONLY · NO CALCULATIONS
                </span>

                <span>
                  {rawApiRows.length}{' '}
                  EDITABLE FIELDS
                </span>
              </div>
            </div>
          )}

          {stagingData.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">

              <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>
                    3 · Staging Data Tree
                  </span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    ORIGINAL TREE
                  </span>
                </div>

                <span className="font-mono text-[10px] text-slate-300 font-normal">
                  {tableRows.length} Root Rows
                </span>
              </div>

              <div className="px-3 py-3">
                <div
                  style={{
                    width: '100%',
                    height: '620px',
                  }}
                >
                  <AgGridReact
                    theme={
                      financialTheme
                    }
                    rowData={
                      gridRows
                    }
                    columnDefs={
                      columnDefs
                    }
                    defaultColDef={
                      defaultColDef
                    }
                    treeData={
                      true
                    }
                    treeDataChildrenField="children"
                    autoGroupColumnDef={
                      autoGroupColumnDef
                    }
                    groupDefaultExpanded={
                      0
                    }
                    animateRows={
                      false
                    }
                    suppressCellFocus={
                      false
                    }
                    singleClickEdit={
                      true
                    }
                    stopEditingWhenCellsLoseFocus={
                      true
                    }
                    onCellValueChanged={
                      handleGridValueChange
                    }
                    getRowId={(
                      params
                    ) =>
                      `${params.data.recordIndex}-${params.data.id}`
                    }
                  />
                </div>
              </div>

              <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>
                  SOURCE: GET /getStagingData
                </span>

                <span>
                  {tableRows.length} ROOT NODES
                </span>
              </div>
            </div>
          )}

          {stagingData.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">

              <button
                onClick={
                  handlePublish
                }
                disabled={
                  !isFormComplete ||
                  publishing
                }
                className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black disabled:bg-slate-300 text-white font-semibold text-xs transition disabled:cursor-not-allowed"
              >
                {publishing
                  ? 'PUBLISHING...'
                  : 'PUBLISH DATA'}
              </button>

              <div className="px-4 py-2 bg-[#f8f9fa] text-center text-[10px] font-mono text-slate-400">
                TARGET SCRIPT:{' '}
                {scriptId ||
                  'NONE'}

                <span className="mx-2">
                  |
                </span>

                SOURCE:{' '}
                {source ||
                  'NONE'}

                <span className="mx-2">
                  |
                </span>

                SECTOR:{' '}

                {Object.values(
                  sectorHierarchy || {}
                ).join(
                  ' › '
                ) || 'NONE'}

                <span className="mx-2">
                  |
                </span>

                UNIT:{' '}
                {units ||
                  'NONE'}

                <span className="mx-2">
                  |
                </span>

                GRANULARITY:{' '}
                {granularity ||
                  'NONE'}
              </div>
            </div>
          )}

        </div>
      </div>
    </AgGridProvider>
  );
}