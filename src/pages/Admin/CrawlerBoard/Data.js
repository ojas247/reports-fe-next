import { useState, useEffect, useMemo } from 'react';
import { fetchDataFromGetApi, fetchDataFromPostApi } from '../../api/Api';

export const config = {
  unstable_runtimeJS: true,
};

export default function CrawlerBoard() {
  const [crawlerData, setCrawlerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUrl, setUpdatingUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'lastCrawled', direction: 'desc' });

  const fetchCrawlerData = async () => {
    try {
      setLoading(true);
      const data = await fetchDataFromGetApi('DataSiteCrawler');
      setCrawlerData(Array.isArray(data) ? data : []);
      console.log("Crawler Data:", data);
    } catch (err) {
      console.error("Failed to fetch crawler data:", err);
      setCrawlerData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrawlerData();
  }, []);

  const updatePg = async (url) => {
    if (!url) return;
    try {
      setUpdatingUrl(url);
      const payload = { url };
      const response = await fetchDataFromPostApi(payload, 'DataSiteCrawler');

      if (response?.status === 200 || response?.status === "success") {
        fetchCrawlerData();
      } else {
        alert("Failed to update page ❌");
      }
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Error updating page ❌");
    } finally {
      setUpdatingUrl(null);
    }
  };

  const totalCount = crawlerData.length;
  const changedCount = useMemo(() => crawlerData.filter((d) => d.pgChanged).length, [crawlerData]);
  const syncedCount = totalCount - changedCount;
  const syncedPercentage = totalCount > 0 ? Math.round((syncedCount / totalCount) * 100) : 100;
  const changedPercentage = totalCount > 0 ? 100 - syncedPercentage : 0;

  const filteredData = useMemo(() => {
    return crawlerData.filter((item) => {
      if (statusFilter === 'CHANGED' && !item.pgChanged) return false;
      if (statusFilter === 'SYNCED' && item.pgChanged) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        (item.scriptID && String(item.scriptID).toLowerCase().includes(term)) ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.url && item.url.toLowerCase().includes(term)) ||
        (item.sector && item.sector.toLowerCase().includes(term)) ||
        (item.sub1 && item.sub1.toLowerCase().includes(term)) ||
        (item.lastCrawled && String(item.lastCrawled).toLowerCase().includes(term)) ||
        (item.cacheUpdateDate && String(item.cacheUpdateDate).toLowerCase().includes(term)) ||
        (item.pgLastUpdated && String(item.pgLastUpdated).toLowerCase().includes(term))
      );
    });
  }, [crawlerData, searchTerm, statusFilter]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = a[sortConfig.key] ?? '';
      let bValue = b[sortConfig.key] ?? '';

      const dateA = Date.parse(aValue);
      const dateB = Date.parse(bValue);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="bi bi-arrow-down-up opacity-25 text-[10px]"></i>;
    }
    return sortConfig.direction === 'asc' ? (
      <i className="bi bi-arrow-up text-slate-900 text-[10px] font-bold"></i>
    ) : (
      <i className="bi bi-arrow-down text-slate-900 text-[10px] font-bold"></i>
    );
  };

  if (loading && crawlerData.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
        <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="text-xs font-mono mt-3 text-slate-500 tracking-wider">FETCHING INDEX DATA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased p-4 sm:p-6">
      <div className="max-w-[1700px] mx-auto space-y-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs font-bold shadow-2xs">
              MR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                  Data Site Telemetry
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Automated web page delta monitoring & sync engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Filter index..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="bi bi-x-circle-fill text-[11px]"></i>
                </button>
              )}
            </div>

            <button
              onClick={fetchCrawlerData}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 shadow-2xs disabled:opacity-50"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-medium">INDEX HEALTH</span>
              
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setStatusFilter('CHANGED')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
                    statusFilter === 'CHANGED'
                      ? 'bg-white text-amber-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Out of Sync ({changedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('SYNCED')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 ${
                    statusFilter === 'SYNCED'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Synchronized ({syncedCount})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
              <span>{syncedPercentage}% Healthy</span>
              <span className="text-slate-300">|</span>
              <span>{sortedData.length} records shown</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200/60">
              <div
                style={{ width: `${syncedPercentage}%` }}
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                title={`Synchronized: ${syncedCount} (${syncedPercentage}%)`}
              ></div>
              <div
                style={{ width: `${changedPercentage}%` }}
                className="h-full bg-amber-500 rounded-r-full transition-all duration-500"
                title={`Out of Sync: ${changedCount} (${changedPercentage}%)`}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="w-full">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500 font-semibold select-none">
                  <th onClick={() => handleSort("scriptID")} className="w-[7%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Script ID</span>
                      {getSortIcon("scriptID")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("name")} className="w-[13%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Site Name</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("url")} className="w-[18%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Target URL</span>
                      {getSortIcon("url")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("sector")} className="w-[10%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Sector</span>
                      {getSortIcon("sector")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("sub1")} className="w-[10%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Category</span>
                      {getSortIcon("sub1")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("pgChanged")} className="w-[9%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Status</span>
                      {getSortIcon("pgChanged")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("lastCrawled")} className="w-[11%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Last Checked</span>
                      {getSortIcon("lastCrawled")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("cacheUpdateDate")} className="w-[11%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Site Changed</span>
                      {getSortIcon("cacheUpdateDate")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("pgLastUpdated")} className="w-[11%] px-3 py-2.5 cursor-pointer hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-1 truncate">
                      <span>Page Updated</span>
                      {getSortIcon("pgLastUpdated")}
                    </div>
                  </th>
                  <th className="w-[5%] px-3 py-2.5 text-right font-semibold">
                    <span>Sync</span>
                  </th>
                </tr>
              </thead>

            <tbody className="divide-y divide-slate-100 text-[11px]">
  {sortedData.length > 0 ? (
    sortedData.map((data, index) => {
      const safeUrl = data.url || "#";
      const isUpdating = updatingUrl === data.url;

      return (
        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
          {/* SCRIPT ID - Improved Display */}
          <td className="px-3 py-2.5 font-mono text-xs font-semibold text-slate-700 bg-slate-50/80 border-r border-slate-100 truncate" title={data.scriptID}>
            {data.scriptID ? (
              <span className="inline-flex items-center px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px]">
                {data.scriptID}
              </span>
            ) : (
              <span className="text-slate-300">—</span>
            )}
          </td>

          <td className="px-3 py-2.5 font-medium text-slate-900 truncate" title={data.name}>
            {data.name || "—"}
          </td>

          <td className="px-3 py-2.5 font-mono text-[10px] text-slate-600 truncate" title={safeUrl}>
            {safeUrl !== "#" ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 hover:underline truncate inline-flex items-center gap-1 max-w-full"
              >
                <span className="truncate">{safeUrl}</span>
              </a>
            ) : (
              <span className="text-slate-300">—</span>
            )}
          </td>

          <td className="px-3 py-2.5 text-slate-600 truncate" title={data.sector}>
            {data.sector ? (
              <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[10px] font-medium text-slate-600 truncate max-w-full">
                {data.sector}
              </span>
            ) : (
              <span className="text-slate-300">—</span>
            )}
          </td>

          <td className="px-3 py-2.5 text-slate-500 truncate" title={data.sub1}>
            {data.sub1 || "—"}
          </td>

          <td className="px-3 py-2.5 whitespace-nowrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                data.pgChanged
                  ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  data.pgChanged ? "bg-amber-500" : "bg-emerald-500"
                }`}
              ></span>
              {data.pgChanged ? "Out of Sync" : "Synced"}
            </span>
          </td>

          <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500 truncate" title={data.lastCrawled}>
            {data.lastCrawled || "—"}
          </td>

          <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500 truncate" title={data.cacheUpdateDate}>
            {data.cacheUpdateDate || "—"}
          </td>

          <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500 truncate" title={data.pgLastUpdated}>
            {data.pgLastUpdated || "—"}
          </td>

          <td className="px-3 py-2.5 text-right whitespace-nowrap">
            <button
              onClick={() => updatePg(data.url)}
              disabled={isUpdating}
              className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-md text-[10px] font-medium transition inline-flex items-center gap-1 disabled:opacity-40"
              title="Synchronize page"
            >
              <span>{isUpdating ? "..." : "Sync"}</span>
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={10} className="px-3 py-12 text-center text-slate-400 font-mono text-[11px]">
        NO MATCHING RECORDS FOUND
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>

          <div className="px-4 py-2 bg-[#f8f9fa] border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>FILTER: {statusFilter}</span>
            <span>SHOWING {sortedData.length} OF {totalCount} ENTRIES</span>
          </div>
        </div>

      </div>
    </div>
  );
}