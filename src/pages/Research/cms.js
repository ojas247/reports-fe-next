'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SingleDropDown_v1 from "@/components/UtilityComponents/SingleDropdown_v1";
import { isSessionTokenValid } from '../../pages/api/UtilFunctions';
import { fetchDataFromPostApi, fetchDataFromGetApi } from '../../pages/api/Api';
import SectorHierarchyDropDown from '../../components/Functionalities/Admin/SectorHierarchyDropDown';
import styles from '../../styles/Pages/reports.module.css';
import TextWithGrid from '@/components/UtilityComponents/SEODataSets/TextWithGrid';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CMS() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectorChain, setSectorChain] = useState({});
  const [reportList, setReportList] = useState(['select']);
  const [oldReportData, setOldReportData] = useState({});
  const [SecSubdata, setSecSubdata] = useState([]);
  const comp = { id: 1, data: {} }


  useEffect(() => {
    const auth = isSessionTokenValid();
    setIsAuthenticated(auth);
    if (!auth) {
      router.push('/Login');
      return;
    }
    // loadSlugs();
  }, []);

  if (!isAuthenticated) return null;

  /// to fetch ReportList based on the sectorChain ///
  const fetchReportList = async () => {
    const data = await fetchDataFromPostApi(sectorChain, 'GetDataBySector_v1');
    setReportList(data);
  }

  const getSelectedReportDetails = async (data) => {
    const payload = { ...sectorChain, data: data.value };
    const Report_Data = await fetchDataFromPostApi(payload, 'GetReportEntity_v1');
    const mergedReportEntityData = {
      ...Report_Data,
    };
    setOldReportData(mergedReportEntityData);
    console.log("Old Report Data: ", mergedReportEntityData);
  }

  const getSectorFilters = (data) => {
    setSectorChain({ ...sectorChain, "sectorChain": data });
}

  /// call back functino from TxtGrid Component ///
  const getTextWithGridData = (id, data) => {
    setAggDataFromTxtgrdComponent((prevData) => ({ ...prevData, [`txtGrid_${id}`]: data, }));
};

  return (
    <DashboardLayout>
      <div>
        <h1> CMS </h1>

        <div className="flex flex-col w-1/4 bg-gray-100 p-4 sticky top-0 h-screen">
          <div className="px-4 py-4">
            <SectorHierarchyDropDown options={SecSubdata} onSelect={getSectorFilters} />
          </div>
          <div className='px-6 py-4'>
            <button
              onClick={fetchReportList}
              className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Fetch ReportList
            </button>
          </div>
          <div>
            <SingleDropDown_v1
              options={reportList}
              onSelect={getSelectedReportDetails}
            />
          </div>
        </div>

       {/* <RenderGrid></RenderGrid> */}
        
      </div>
    </DashboardLayout>
  );
}
