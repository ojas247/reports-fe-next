////// THIS PAGE IS WIP ////////
import { fetchDataFromGetApi, fetchDataFromPostApi } from '../../api/Api';
import { useEffect, useState } from 'react';
import RenderEditableGrid from '../../../components/UtilityComponents/RenderEditableGrid'
import Papa from 'papaparse';



export default function DataPage_v1(propObj) {
    return (
        <div>
            <h1>Data Page</h1>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { DataPage} = context.params;
    console.log("DataPage: ", DataPage)

    //Fetch Data from dataStore Published_Data
    let propObj = null;
    const dataSetObj = await fetchDataFromGetApi("GetDataPageEntity_v1slug=" + DataPage);

    console.log("dataSetObj: ", dataSetObj)



   
    return {
        props: {
            dataSetObj
        },

    }
}