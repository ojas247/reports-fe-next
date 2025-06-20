import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../components/Functionalities/NavBar";
import ReportResultsComp from "../components/Functionalities/ReportResultsComp";
import SearchFilters from '../components/Functionalities/SearchFilters';
import FilterTags from '../components/UtilityComponents/FilterTags';
import ToggleLeftPanel from '../components/UtilityComponents/ToggleLeftPanel';
import Footer from "../components/Website/Footer";
import { checkAuthentication } from '../pages/api/UtilFunctions';
import { useRouter } from 'next/router';
import SearchBar from '../components/Functionalities/SearchBar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '../styles/reportResult.module.css';

export default function ReportResult() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

  const router = useRouter();
  const hasMounted = useRef(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isToggled, setIsToggled] = useState(false);

  const getAppliedFiltersFromChild = (filters) => {
    console.log("Received filters from SearchFilters:", filters);
    setAppliedFilters(filters);
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // Function to handle button click
  const handleToggle = () => {
    setIsToggled(prevState => !prevState); // Toggle the state
  };


  return (
    <div className={styles.resultBodyContainer}>
      <NavBar />
      <div className={styles.searchRow}>
        <div className={styles.searchToggle}></div>

        <button
          onClick={handleToggle}
          className={`${styles.toggleButton} ${isToggled ? styles.filter : styles.search}`}
        >
          <div className={styles.toggleImg}>
            {isToggled ? (
              <i className="bi bi-search"></i>
            ) : (
              <i className="bi bi-funnel"></i>
            )}
          </div>
        </button>
        {isToggled && appliedFilters !== null && (
          <SearchFilters onDataSend={getAppliedFiltersFromChild} />
        )}
        {!isToggled &&
          <div className={styles.searchContainerRpts}>
            <div className={styles.searchWrapperRpts}>
              <SearchBar />
            </div>
          </div>
        }

      </div>
      <div className={styles.filterTags}>
        <FilterTags applied_filters={appliedFilters} />
      </div>
      <div className={styles.resultContainer}>
        <div className={styles.toggleLeftPanel}>
          <ToggleLeftPanel />
        </div>
        <ReportResultsComp result={appliedFilters} />
      </div>
      <Footer />
    </div>
  );
}