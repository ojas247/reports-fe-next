import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../../components/Functionalities/NavBar";
import Footer from "../../components/Website/Footer";
import ReportResultsComp from "../../components/Functionalities/ReportResultsComp";
import SearchFilters from '../../components/Functionalities/SearchFilters';
import SearchFilters_v1 from '../../components/Functionalities/Research/SearchFilters_v1';
import FilterTags from '../../components/UtilityComponents/FilterTags';
import ToggleLeftPanel from '../../components/UtilityComponents/ToggleLeftPanel';
import { checkAuthentication } from '../api/UtilFunctions';
import SearchBar from '../../components/Functionalities/SearchBar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '../../styles/Pages/reports.module.css';
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { isSessionTokenValid } from "../../pages/api/UtilFunctions"
import { useRouter } from "next/navigation";


export default function Data() {
  const router = useRouter();
  const hasMounted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isToggled, setIsToggled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production

  useEffect(() => {
    const auth = isSessionTokenValid();
    setIsAuthenticated(auth);

    if (!auth) {
      alert("Please login to access product-based services.");
      router.push("/Login");
      return;
    }
  }, []);

  const getAppliedFiltersFromChild = (filters) => {
    console.log("Received filters from SearchFilters:", filters);
    setAppliedFilters({ ...filters }); // creates a new object
  }

  // Function to handle button click
  const handleToggle = () => {
    setIsToggled(prevState => !prevState); // Toggle the state
  };


  return (
    <DashboardLayout>
      <div className={styles.resultBodyContainer}>
        <div className={styles.searchRow}>
          <div className={styles.searchToggle}></div>
          <SearchFilters_v1 onDataSend={getAppliedFiltersFromChild} />

        </div>
        {/* <div className={styles.filterTags}>
        <FilterTags applied_filters={appliedFilters} />
      </div> */}
        <div className="">
          <ReportResultsComp researchType="Data" result={appliedFilters} />
        </div>

      </div>
    </DashboardLayout>
  );
}