import { useState, useEffect } from 'react';
import { fetchDataFromGetApi, fetchDataFromPostApi } from '../../api/Api';

export default function CrawlerBoard() {
  const [crawlerData, setCrawlerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 🔹 Update Page function
  const updatePg = async (url) => {
    try {
      const payload = { url };
      const response = await fetchDataFromPostApi(payload, 'DataSiteCrawler');

      if (response?.status === 200 || response?.Status === "Success") {
        console.log("Page updated successfully");
        alert("Page updated successfully ✅");
      } else {
        console.error("Failed to update page");
        alert("Failed to update page ❌");
      }
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Error updating page ❌");
    }
  };

  // 🔹 Fetch data
  useEffect(() => {
    const fetchCrawlerData = async () => {
      try {
        setLoading(true);
        const data = await fetchDataFromGetApi('DataSiteCrawler');
        setCrawlerData(data);
      } catch (err) {
        console.error("Failed to fetch crawler data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrawlerData();
  }, []);

  // 🔹 Prepare data array (fixed: assume backend returns array of objects with 'url' property)
  const dataArray = Array.isArray(crawlerData) ? crawlerData : [];

  // 🔹 Sorting logic
  const sortedData = [...dataArray].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";

    // Try to handle dates correctly
    const isDate = Date.parse(aValue) && Date.parse(bValue);
    if (isDate) {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 🔹 Handle sort click
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🔹 Sort arrow
  const getArrow = (key) => {
    if (sortConfig.key !== key)
      return <i className="bi bi-arrow-down-up ml-1 text-gray-400"></i>;
    return sortConfig.direction === "asc" ? (
      <i className="bi bi-arrow-up ml-1 text-blue-600"></i>
    ) : (
      <i className="bi bi-arrow-down ml-1 text-blue-600"></i>
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading data...</div>;
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              { key: "name", label: "Site Name" },
              { key: "url", label: "URL" },
              { key: "sector", label: "Sector" },
              { key: "sub1", label: "Sub1" },
              { key: "pgChanged", label: "Status" },
              { key: "lastCrawled", label: "Last Checked" },
              { key: "cacheUpdateDate", label: "Site Last Changed" },
              { key: "pgLastUpdated", label: "Pg Last Updated" },
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:text-blue-600"
              >
                {label}
                {getArrow(key)}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Pg Updated
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((data, index) => {
            // 🔹 Fixed safeUrl: Use data.url directly (backend provides it as full URL)
            const safeUrl = data.url || "";

            return (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {data.name || "N/A"}
                </td>

                <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[300px]" title={safeUrl}>
                  {safeUrl ? (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {safeUrl}
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">{data.sector}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{data.sub1}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      data.pgChanged
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {data.pgChanged ? "Changed" : "Unchanged"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {data.lastCrawled}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {data.cacheUpdateDate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {data.pgLastUpdated}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => updatePg(data.url)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition"
                  >
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}