import { useState, useMemo } from 'react';
import { fetchDataFromGetApi } from '../../api/Api';

export const config = {
  unstable_runtimeJS: true,
};

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

  const rawApiRows = useMemo(() => {
    const rows = [];

    const extractMetrics = (node, parentPath = '') => {
      if (!node || typeof node !== 'object') return;

      const metricName = node.name;
      const metricId = node.id;

      if (
        metricName ||
        metricId ||
        node.value !== undefined ||
        node.units
      ) {
        rows.push({
          name: metricName || '—',
          id: metricId || '—',
          units: node.units || '—',
          value:
            node.value !== undefined &&
            node.value !== null &&
            node.value !== ''
              ? node.value
              : '—',
          path: parentPath,
        });
      }

      if (Array.isArray(node.children)) {
        node.children.forEach((child) => {
          extractMetrics(
            child,
            metricName
              ? `${parentPath}${parentPath ? ' → ' : ''}${metricName}`
              : parentPath
          );
        });
      }
    };

    stagingData.forEach((record) => {
      if (!record || typeof record !== 'object') return;

      let data = record.data;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (Array.isArray(data)) {
        data.forEach((node) => {
          extractMetrics(node);
        });
      } else if (data && typeof data === 'object') {
        extractMetrics(data);
      }
    });

    return rows;
  }, [stagingData]);

  const handleFetchData = async () => {
    const trimmedScriptId = scriptId.trim();

    if (!trimmedScriptId) {
      setFetchError('Script ID is required.');
      setStatusMessage('Enter a Script ID before fetching.');
      return;
    }

    try {
      setLoading(true);
      setFetchError(null);

      // Clear previous results immediately
      setStagingData([]);
      setFormValues({});

      setStatusMessage(
        `Fetching staging data for ${trimmedScriptId} (${source})...`
      );

      const endpoint =
        `getStagingData?scriptID=${encodeURIComponent(trimmedScriptId)}` +
        `&source=${encodeURIComponent(source)}`;

      console.log('GET:', endpoint);

      const data = await fetchDataFromGetApi(endpoint);

      console.log('Staging API response:', data);

      const records = Array.isArray(data)
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

      const extractFields = (obj, prefix = '') => {
        if (!obj || typeof obj !== 'object') return;

        Object.entries(obj).forEach(([key, val]) => {
          if (key === 'data') {
            let parsedData = val;

            if (typeof parsedData === 'string') {
              try {
                parsedData = JSON.parse(parsedData);
              } catch (e) {
                console.error(
                  'Error parsing nested data JSON string:',
                  e
                );
                return;
              }
            }

            const extractNodes = (node) => {
              if (!node || typeof node !== 'object') return;

              const fieldKey =
                node.id ||
                node.name ||
                'unnamed_metric';

              if (
                node.value !== undefined &&
                node.value !== null
              ) {
                initialInputs[`metric_${fieldKey}`] =
                  node.value;
              }

              if (Array.isArray(node.children)) {
                node.children.forEach(extractNodes);
              }
            };

            if (Array.isArray(parsedData)) {
              parsedData.forEach(extractNodes);
            } else if (
              parsedData &&
              typeof parsedData === 'object'
            ) {
              extractNodes(parsedData);
            }
          } else if (
            val === null ||
            typeof val !== 'object'
          ) {
            initialInputs[`${prefix}${key}`] = val ?? '';
          }
        });
      };

      records.forEach((record, index) => {
        extractFields(
          record,
          records.length > 1 ? `${index}_` : ''
        );
      });

      setFormValues(initialInputs);

      setStatusMessage(
        `Loaded ${records.length} staging record(s) for ${trimmedScriptId} (${source}).`
      );
    } catch (err) {
      console.error('Failed to fetch staging data:', err);

      setFetchError(
        err?.message || 'Error connecting to staging API.'
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

  const handleInputChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
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

      console.log('Publish Payload:', payload);

      setStatusMessage('Staging data action triggered.');

      alert('Action processed! ✓');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Error publishing staging data ❌');
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
  }, [scriptId, source, stagingData]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased p-4 sm:p-6">
      <div className="max-w-[1700px] mx-auto space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
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
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 shadow-2xs disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch Staging'}
          </button>
        </div>

        {/* Section 1: Configuration */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
            <span>1 · Script &amp; Pipeline Configuration</span>
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
                  onChange={(e) => setScriptId(e.target.value)}
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
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="AR">AR (Annual Report)</option>
                  <option value="QR">QR (Quarterly Report)</option>
                  <option value="PR">PR (Press Release)</option>
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
                  onChange={(e) => setCompanyName(e.target.value)}
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
                  value={sectorHierarchy}
                  onChange={(e) => setSectorHierarchy(e.target.value)}
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
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">Select unit...</option>
                  <option value="INR Crore">INR Crore</option>
                  <option value="Units (Count)">Units (Count)</option>
                  <option value="Percentage (%)">
                    Percentage (%)
                  </option>
                </select>

                <select
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="">Select frequency...</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                fetchError ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />

            <span
              className={
                fetchError
                  ? 'text-amber-700'
                  : 'text-slate-500'
              }
            >
              {fetchError || statusMessage}
            </span>
          </div>
        </div>

        {/* Section 2: Review & Edit Staging Metrics (Only shown after fetch) */}
        {stagingData.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
              <span>2 · Review &amp; Edit Staging Metrics</span>

              <span className="font-mono text-[10px] text-slate-300 font-normal">
                {Object.keys(formValues).length} Input Fields
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="w-1/2 px-4 py-2.5">
                      Parameter Key
                    </th>

                    <th className="w-1/2 px-4 py-2.5 text-right">
                      Target Value
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {Object.keys(formValues).length > 0 ? (
                    Object.entries(formValues).map(([fullKey, val]) => {
                      const fieldLabel = fullKey.replace(/^\d+_/, '');

                      return (
                        <tr
                          key={fullKey}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td
                            className="px-4 py-2.5 font-mono text-slate-600 bg-slate-50/50 truncate"
                            title={fieldLabel}
                          >
                            {fieldLabel}
                          </td>

                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                handleInputChange(fullKey, e.target.value)
                              }
                              className="w-full text-right px-2 py-1.5 font-mono text-[11px] font-semibold text-slate-700 bg-transparent focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300 rounded"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-10 text-center text-slate-400 font-mono text-[11px]"
                      >
                        NO ACTIVE STAGING FIELDS LOADED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Staging Data Preview (Only shown after fetch) */}
        {stagingData.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>3 · Staging Data Preview</span>

                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300">
                  READ ONLY
                </span>
              </div>

              <span className="font-mono text-[10px] text-slate-300 font-normal">
                {rawApiRows.length} Metrics
              </span>
            </div>

            {rawApiRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-4 py-2.5 min-w-[280px]">
                        Metric
                      </th>

                      <th className="px-4 py-2.5 min-w-[280px]">
                        Metric ID
                      </th>

                      <th className="px-4 py-2.5 min-w-[120px]">
                        Units
                      </th>

                      <th className="px-4 py-2.5 min-w-[140px] text-right">
                        Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {rawApiRows.map((row, index) => (
                      <tr
                        key={`${row.id}-${index}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <div
                            className="font-medium text-slate-700 truncate max-w-[360px]"
                            title={row.name}
                          >
                            {row.name}
                          </div>

                          {row.path && (
                            <div
                              className="mt-0.5 text-[9px] font-mono text-slate-400 truncate max-w-[360px]"
                              title={row.path}
                            >
                              {row.path}
                            </div>
                          )}
                        </td>

                        <td
                          className="px-4 py-2.5 font-mono text-[10px] text-slate-500 truncate max-w-[320px]"
                          title={row.id}
                        >
                          {row.id}
                        </td>

                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] font-mono text-slate-600">
                            {row.units}
                          </span>
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <span className="font-mono font-semibold text-slate-800">
                            {String(row.value)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="text-xs font-medium text-slate-500">
                  NO STAGING METRICS FOUND
                </p>

                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  The staging response does not contain readable metric nodes.
                </p>
              </div>
            )}

            <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>SOURCE: GET /getStagingData</span>
              <span>{rawApiRows.length} METRICS</span>
            </div>
          </div>
        )}

        {/* Publish Action Container (Only shown after fetch) */}
        {stagingData.length > 0 && (
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <button
              onClick={handlePublish}
              disabled={!isFormComplete || publishing}
              className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 active:bg-black disabled:bg-slate-300 text-white font-semibold text-xs transition disabled:cursor-not-allowed"
            >
              {publishing ? 'PUBLISHING...' : 'PUBLISH DATA'}
            </button>

            <div className="px-4 py-2 bg-[#f8f9fa] text-center text-[10px] font-mono text-slate-400">
              TARGET SCRIPT: {scriptId || 'NONE'}
              <span className="mx-2">|</span>
              SOURCE: {source || 'NONE'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}