import { useState, useMemo } from 'react';
import { fetchDataFromGetApi } from '../../api/Api';
import { AgGridReact, AgGridProvider } from 'ag-grid-react';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { themeQuartz } from 'ag-grid-community';

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
  const [sectorHierarchy, setSectorHierarchy] = useState('');
  const [units, setUnits] = useState('');
  const [granularity, setGranularity] = useState('');
  const [dataName, setDataName] = useState('');

  const [formValues, setFormValues] = useState({});

  const normalizeData = (record) => {
    if (!record || typeof record !== 'object') {
      return [];
    }

    let data = record.data;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Unable to parse staging data:', error);
        return [];
      }
    }

    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.children)) {
      return [data];
    }

    return [data];
  };

  const tableRows = useMemo(() => {
    const rows = [];

    const cloneNode = (node, parentPath = [], recordIndex = 0) => {
      if (!node || typeof node !== 'object') {
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

      const children = Array.isArray(node.children)
        ? node.children
            .map((child) =>
              cloneNode(
                child,
                [...parentPath, name],
                recordIndex
              )
            )
            .filter(Boolean)
        : [];

      const row = {
        ...node,
        name,
        id,
        units: node.units || '',
        value:
          node.value !== undefined &&
          node.value !== null
            ? node.value
            : '',
        children,
        path: [...parentPath, name],
        hasChildren: children.length > 0,
        recordIndex,
      };

      rows.push(row);

      return row;
    };

    const roots = [];

    stagingData.forEach((record, recordIndex) => {
      const data = normalizeData(record);

      data.forEach((node) => {
        const row = cloneNode(
          node,
          [],
          recordIndex
        );

        if (row) {
          roots.push(row);
        }
      });
    });

    return roots;
  }, [stagingData]);

  const gridRows = useMemo(() => {
    return tableRows;
  }, [tableRows]);

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
    return nodes.map((node) => {
      if (node.id === targetId) {
        return {
          ...node,
          value: newValue,
        };
      }

      if (Array.isArray(node.children)) {
        return {
          ...node,
          children: updateNestedValue(
            node.children,
            targetId,
            newValue
          ),
        };
      }

      return node;
    });
  };

  const setTableRowsForPublish = (
    targetId,
    newValue
  ) => {
    setStagingData((previous) => {
      return previous.map((record) => {
        let data = record.data;

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return record;
          }
        }

        const dataIsArray = Array.isArray(data);

        const updatedData = dataIsArray
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
          data: dataIsArray
            ? updatedData
            : updatedData[0],
        };
      });
    });
  };

  const handleGridValueChange = (params) => {
    const node = params.data;

    if (!node) {
      return;
    }

    if (node.value === params.newValue) {
      return;
    }

    setTableRowsForPublish(
      node.id,
      params.newValue
    );

    setFormValues((previous) => ({
      ...previous,
      [`metric_${node.id}`]:
        params.newValue,
    }));
  };

  const columnDefs = useMemo(() => {
    return [
      {
        headerName: 'Units',
        field: 'units',
        width: 150,
        minWidth: 120,
        maxWidth: 180,
        cellClass: 'units-cell',
        valueFormatter: (params) => {
          return params.value || '';
        },
      },
      {
        headerName: getYearHeader(),
        field: 'value',
        width: 220,
        minWidth: 180,
        flex: 0.35,
        editable: (params) =>
          !params.node.hasChildren(),
        cellClass: (params) => {
          return params.node.hasChildren()
            ? 'financial-value-parent'
            : 'financial-value';
        },
        valueFormatter: (params) => {
          if (
            params.value === null ||
            params.value === undefined ||
            params.value === ''
          ) {
            return '';
          }

          if (
            typeof params.value === 'number'
          ) {
            return params.value.toLocaleString(
              'en-IN'
            );
          }

          return String(params.value);
        },
      },
    ];
  }, [stagingData]);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Parameter',
      field: 'name',
      flex: 1,
      minWidth: 420,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        suppressCount: true,
      },
      cellClass: (params) => {
        return params.node.hasChildren()
          ? 'financial-parent'
          : 'financial-child';
      },
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      resizable: true,
      suppressHeaderMenuButton: true,
    };
  }, []);

  const handleFetchData = async () => {
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
          source
        )}`;

      console.log('GET:', endpoint);

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

      if (records.length === 0) {
        setStagingData([]);
        setFormValues({});

        setStatusMessage(
          `No staging records found for ${trimmedScriptId} (${source}).`
        );

        return;
      }

      setStagingData(records);

      const initialInputs = {};

      const extractNodes = (node) => {
        if (
          !node ||
          typeof node !== 'object'
        ) {
          return;
        }

        const fieldKey =
          node.id ||
          node.name ||
          'unnamed_metric';

        if (
          node.value !== undefined &&
          node.value !== null
        ) {
          initialInputs[
            `metric_${fieldKey}`
          ] = node.value;
        }

        if (
          Array.isArray(node.children)
        ) {
          node.children.forEach(
            extractNodes
          );
        }
      };

      records.forEach((record) => {
        normalizeData(record).forEach(
          extractNodes
        );
      });

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

  const handlePublish = async () => {
    try {
      setPublishing(true);

      const payload = {
        scriptID: scriptId,
        source,
        companyName,
        sectorHierarchy,
        units,
        granularity,
        dataName,
        updatedValues: formValues,
        stagingData,
      };

      console.log(
        'Publish Payload:',
        payload
      );

      setStatusMessage(
        'Staging data action triggered.'
      );

      alert('Action processed! ✓');
    } catch (error) {
      console.error(
        'Publish error:',
        error
      );

      alert(
        'Error publishing staging data ❌'
      );
    } finally {
      setPublishing(false);
    }
  };

  const isFormComplete = useMemo(() => {
    return Boolean(
      scriptId &&
        source &&
        stagingData.length > 0
    );
  }, [
    scriptId,
    source,
    stagingData,
  ]);

  return (
    <AgGridProvider modules={modules}>
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
              onClick={handleFetchData}
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
                v1.1
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
                  <select
                    value={source}
                    onChange={(e) =>
                      setSource(
                        e.target.value
                      )
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="AR">
                      AR (Annual Report)
                    </option>

                    <option value="QR">
                      QR (Quarterly Report)
                    </option>

                    <option value="PR">
                      PR (Press Release)
                    </option>
                  </select>
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

                <div className="p-2 md:col-span-2">
                  <select
                    value={
                      sectorHierarchy
                    }
                    onChange={(e) =>
                      setSectorHierarchy(
                        e.target.value
                      )
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="">
                      Select sector &gt; sub-sector...
                    </option>

                    <option value="Consumer > Auto & EV">
                      Consumer &gt; Auto &amp; EV
                    </option>

                    <option value="Industrials > Cement & Construction">
                      Industrials &gt; Cement &amp; Construction
                    </option>

                    <option value="Infrastructure > Power & Energy">
                      Infrastructure &gt; Power &amp; Energy
                    </option>

                    <option value="Digital > Fintech & Payments">
                      Digital &gt; Fintech &amp; Payments
                    </option>
                  </select>
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
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="">
                      Select unit...
                    </option>

                    <option value="INR Crore">
                      INR Crore
                    </option>

                    <option value="Units (Count)">
                      Units (Count)
                    </option>

                    <option value="Percentage (%)">
                      Percentage (%)
                    </option>
                  </select>

                  <select
                    value={granularity}
                    onChange={(e) =>
                      setGranularity(
                        e.target.value
                      )
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    <option value="">
                      Select frequency...
                    </option>

                    <option value="Monthly">
                      Monthly
                    </option>

                    <option value="Quarterly">
                      Quarterly
                    </option>

                    <option value="Annual">
                      Annual
                    </option>
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
                    2 · Review &amp; Edit Staging Data
                  </span>

                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                    TREE DATA
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
                    theme={financialTheme}
                    rowData={gridRows}
                    columnDefs={columnDefs}
                    defaultColDef={
                      defaultColDef
                    }
                    treeData={true}
                    treeDataChildrenField="children"
                    autoGroupColumnDef={
                      autoGroupColumnDef
                    }
                    groupDefaultExpanded={0}
                    animateRows={false}
                    suppressCellFocus={false}
                    singleClickEdit={true}
                    stopEditingWhenCellsLoseFocus={
                      true
                    }
                    onCellValueChanged={
                      handleGridValueChange
                    }
                    getRowId={(params) =>
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
                onClick={handlePublish}
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
                {scriptId || 'NONE'}

                <span className="mx-2">
                  |
                </span>

                SOURCE:{' '}
                {source || 'NONE'}
              </div>
            </div>
          )}

        </div>
      </div>
    </AgGridProvider>
  );
}