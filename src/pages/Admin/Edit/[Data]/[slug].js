
import { fetchDataFromGetApi } from '../../../api/Api';
import { useState } from 'react';
import RenderEditableGrid from '../../../../components/UtilityComponents/RenderEditableGrid'
import Papa from 'papaparse';

export default function DataEdits(propObj) {
    const dataObj = propObj.propObj.dataObj[0]
    // const dataSetCSVurl = dataObj.ReportUrl
    console.log("Check: ", dataObj)
    const dataSetName = dataObj.DataName
    const publishedYear = dataObj.Year
    const description = dataObj.description
    const csvTable = propObj.propObj.ArrayofArray

    const [dName, setDName] = useState(dataSetName);
    const [year, setYear] = useState(publishedYear);
    const [desc, setDesc] = useState(description);

    const saveTable = async (tableData) => {
        try {
            const payload = {
                dataName: dName,
                year: year, 
                description: desc,
                tableData: tableData
            };

        } catch (err) {
            console.error("API error:", err);
        }
    };


    return (
        <>
            <div>
                Dataset Name - <input
                    type="text"
                    value={dName}                // prefilled value
                    onChange={(e) => setDName(e.target.value)} // update state on edit
                    className="border p-2 rounded w-64"
                />
            </div>
            <div>
                Published Year - <input
                    type="text"
                    value={dName}                // prefilled value
                    onChange={(e) => setDName(e.target.value)} // update state on edit
                    className="border p-2 rounded w-64"
                />
            </div>
            <div>
                Data description - <textarea
                    value={desc}                // prefilled value
                    onChange={(e) => setDesc(e.target.value)} // update state on edit
                    rows={10}
                    className="border p-2 rounded w-200"
                />
            </div>
            <div>
                <RenderEditableGrid ArrayofArray={csvTable} onSave={saveTable}/>
            </div>
        </>
    );


}

export async function getServerSideProps(context) {
    const { Data, slug } = context.params;

    //Fetch Data from dataStore Published_Data
    let propObj = {}
    const dataSetObj = await fetchDataFromGetApi("get-dataset-objs?count=&sector=&slug=" + slug);
    propObj = { ...propObj, slug1: Data, slug2: slug, dataObj: dataSetObj };

    //Fetch rows+columns from csv bucket object
    const url = "https://storage.googleapis.com/marketreports/Data/Milk-Production-in-India-2024";
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