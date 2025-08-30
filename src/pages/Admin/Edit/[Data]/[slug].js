import { fetchDataFromGetApi, fetchDataFromPostApi } from '../../../api/Api';
import { useEffect, useState } from 'react';
import RenderEditableGrid from '../../../../components/UtilityComponents/RenderEditableGrid'
import Papa from 'papaparse';

export default function DataEdits(propObj) {
    const dataObj = propObj.propObj.dataObj[0]
    const dataSetName = dataObj.DataName
    const publishedYear = dataObj.Year
    const description = dataObj.description
    const TSdata = dataObj.isTSdata
    let csvTable = propObj.propObj.ArrayofArray

    const [sector, setSector] = useState(propObj.propObj.slug1)
    const [pageUrl, setPageUrl] = useState(propObj.propObj.slug2)
    const [dName, setDName] = useState(dataSetName);
    const [year, setYear] = useState(publishedYear);
    const [desc, setDesc] = useState(description);
    const [tableData, setTableData] = useState(csvTable)
    const [isTimeSeriesData, setIsTimeSeriesData] = useState(TSdata); // No Need to Show this on Frontend
    const [updatedTableData, setUpdatedTableData] = useState(csvTable)
    const [updatedPgData, setUpdatedPgData] = useState({})
    const [isUpdating, setIsUpdating] = useState(false);
    
   

    const saveTable = (tableData) => {
        // console.log("Saving table data:", tableData);
        setTableData(tableData)
        csvTable = tableData
    };

    const updatePage = async () => {
        try {
            setIsUpdating(true);
            await fetchDataFromPostApi(updatedPgData, "RePublishing-Data");
            console.log("Page update payload:", updatedPgData);
        } catch (error) {
            console.error("Error updating page:", error);
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        setUpdatedPgData((prev) => {
          const newData = {
            OldDataSetName: dataSetName,
            DataSetName: dName,
            year: year,
            description: desc,
            tableData: tableData,
            sector: sector,
            PgUrl: pageUrl,
            isTimeSeriesData: isTimeSeriesData
          };
      
          // Avoid unnecessary updates
          if (JSON.stringify(prev) !== JSON.stringify(newData)) {
            return newData;
          }
          return prev;
        });
      }, [dName, year, desc, tableData, sector, pageUrl]);


    return (
        <>
        {/* Page Heading */}
        <div className="max-w-3xl mx-auto mt-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Dataset</h1>
          <p className="text-gray-500 mt-1">Update dataset details and make changes to the table below.</p>
        </div>
      
        {/* Main container */}
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6">
          {/* Dataset Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Dataset Name
            </label>
            <input
              type="text"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
                //   onChange={(e) => setPageData({...pageData, "DataSetName": e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
              placeholder="Enter dataset name"
            />
          </div>
      
          {/* Published Year */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
                //   onChange={(e) => setPageData({...pageData, "year": e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
              placeholder="e.g. 2024"
            />
          </div>
      
          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Data Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
                //   onChange={(e) => setPageData({...pageData, "description": e.target.value})}
              rows={6}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full resize-y"
              placeholder="Enter dataset description"
            />
          </div>
      
          {/* Editable Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Table</h3>
            <div className="shadow-sm p-3 bg-gray-50">
              <RenderEditableGrid ArrayofArray={csvTable} onSave={saveTable}/>
            </div>
          </div>
        </div>
      
        {/* Save button (outside container) */}
        <div className="max-w-3xl mx-auto mt-6 flex justify-end">
          <button
            onClick={updatePage}
            disabled={isUpdating}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            {isUpdating ? (
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                </div>
            ) : (
                "Save Changes"
            )}
          </button>
        </div>
      </>
      
      
    );


}

export async function getServerSideProps(context) {
    const { Data, slug } = context.params;

    //Fetch Data from dataStore Published_Data
    let propObj = null;
    const dataSetObj = await fetchDataFromGetApi("get-dataset-objs?count=&sector=&slug=" + slug);
    propObj = { ...propObj, slug1: Data, slug2: slug, dataObj: dataSetObj };

    console.log("dataSetObj: ", dataSetObj)

    //Fetch rows+columns from csv bucket object
    // const url = "https://storage.googleapis.com/marketreports/Data/Milk-Production-in-India-2024";
    const url = dataSetObj[0]?.ReportUrl;
    console.log("check: ", url);
    const res = await fetch(url);
    const csvText = await res.text();            // read CSV as plain text

   

    const parsed = Papa.parse(csvText, {         // Parse CSV → array of arrays
        header: false,       // don't use first row as keys
        skipEmptyLines: true
    });
    propObj = { ...propObj, ArrayofArray: parsed.data };

    return {
        props: {
            propObj
        },

    }
}