import { useState, useEffect } from 'react';
import { fetchDataFromGetApi, fetchDataFromPostApi } from '../../api/Api';


export default function CrawlerBoard() {
  const [crawlerData, setCrawlerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResults, setApiResults] = useState({});
  const [processingStatus, setProcessingStatus] = useState({});

  useEffect(() => {
    const fetchCrawlerData = async () => {
      try {
        setLoading(true);
        const data = await fetchDataFromGetApi('DataSiteCrawler');
        setCrawlerData(data);
      } catch (err) {
        setError('Failed to fetch crawler data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrawlerData();
  }, []);



  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 className="text-2xl font-bold mb-6">Data Crawler Status</h1>

  <div className="bg-white shadow rounded-lg overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Site Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            URL
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Checked
          </th>
         
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Object.entries(crawlerData).map(([url, data]) => (
          <tr key={url}>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {data.name}
            </td>
            <td className="px-6 py-4 text-sm text-blue-600">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.url}
              </a>
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  data.pgChanged === "Yes"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {data.pgChanged === "Yes" ? "Changed" : "No Change"}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{data.date}</td>
          
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </>
  );
}
