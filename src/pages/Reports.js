"use client"
import React, { useState, useEffect, useRef } from 'react';
import NavBar from "../components/Navbar/NavBar";
import Footer from "../components/Website/Footer";
import SearchFilters from '../components/Functionalities/SearchFilters';
import SearchBar from '../components/Functionalities/SearchBar';
import Carousel from '../components/UtilityComponents/Carousel';
import Carousel1 from '../components/UtilityComponents/Carousel1';
import styles from '../styles/reports.module.css';
import algoliasearch from 'algoliasearch';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Reports() {
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
    const algoliaAppId = process.env.NEXT_PUBLIC_algoliaAppId;
    const algoliaApiKey = process.env.NEXT_PUBLIC_algoliaApiKeyMarketContent;
    const searchClient = algoliasearch(algoliaAppId, algoliaApiKey);
    const index = searchClient.initIndex('market_content');
    const router = useRouter();
    const [token, setToken] = useState(null);
   const [appliedFilters, setAppliedFilters] = useState({});
    const [isToggled, setIsToggled] = useState(false);
    const [arrayBlogs, setArrayBlogs] = useState([]); // State to store the blogs
    const hasMounted = useRef(false);

    const cardsReports = [
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/EdTech_The_Advent_of_Digital_Education.pdf",
          imageUrl: "./Assets/Images/HomePage/ReportCover/EdTech Advent.png",
          title: "EdTech Advent"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf",
          imageUrl: "./Assets/Images/HomePage/ReportCover/ChirataeVen.png",
          title: "ChirataeVen"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/edtech-2023-road-ahead-pgalabs.pdf",
          imageUrl: "./Assets/Images/HomePage/ReportCover/EdTechLandscape.png",
          title: "EdTech Landscape"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf",
          imageUrl: "./Assets/Images/HomePage/ReportCover/EdTEch Road Ahead.png",
          title: "EdTech Road Ahead"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf",
          imageUrl: "./Assets/Images/HomePage/ReportCover/NasscomReort.png",
          title: "Nasscom Report"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Repirt%2C%20Ministry%20of%20Education%20(2021-22).pdf",
          imageUrl: "https://storage.googleapis.com/marketreports/ReportCover/EdTech%20Landscape%20in%20India.png",
          title: "EdTech Landscape in India"
        }
      ];

    const cardsLogos =  [
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf",
          imageUrl: "./Assets/Images/HomePage/nascomm.jfif",
          title: "Nasscom"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/EdTech_The_Advent_of_Digital_Education.pdf",
          imageUrl: "./Assets/Images/HomePage/Government_of_India_logo.svg",
          title: "Government of India"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf",
          imageUrl: "./Assets/Images/HomePage/McKinsey.svg",
          title: "McKinsey"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf",
          imageUrl: "./Assets/Images/HomePage/HDFC.png",
          title: "HDFC"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/nasscom-India-The-Tech-Talent-Nation-Final-Dec%202023.pdf",
          imageUrl: "./Assets/Images/HomePage/RBI.PNG",
          title: "RBI"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/edtech-2023-road-ahead-pgalabs.pdf",
          imageUrl: "./Assets/Images/HomePage/KPMG_logo.svg",
          title: "KPMG"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf",
          imageUrl: "./Assets/Images/HomePage/Bloomberg.png",
          title: "Bloomberg"
        },
        {
          pdfUrl: "https://storage.googleapis.com/marketreports/Reports/Annual%20Status%20of%20Education%20Report%202022.pdf",
          imageUrl: "./Assets/Images/HomePage/cii.png",
          title: "CII"
        },
      ];
      
      
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('token'));
      }
      index.search('', { hitsPerPage: 8 }).then(({ hits }) => {
        setArrayBlogs(hits);
      });
    }, []);

    useEffect(() => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return; // ❌ Skip first run
      }
    
      // ✅ Only runs on actual changes to appliedFilters
      function SearchReports() {
        console.log("appliedFilters098: ", appliedFilters);
          axios.post(`${backendAPI}/SearchReports`, appliedFilters,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            })
            .then(res => {
              const ReportFilterProps = res.data;
              if (ReportFilterProps.message === "Invalid Authorization") {
                router.push('/Login');
              }
              else if (ReportFilterProps.message === "Update plan") {
                router.push('/Pricing');
              } else {
                router.push({
                  pathname: '/ReportResult',
                  query: {
                    appliedFilters: JSON.stringify(appliedFilters)
                  }
                });
              }
            });
        }
        SearchReports();
      }, [appliedFilters]);
 
  
    // Function to handle button click
    const handleToggle = () => {
      setIsToggled(prevState => !prevState); // Toggle the state
    };

    const getAppliedFiltersFromChild = (filters) => {
      console.log("RedlkgjhFilters:", filters);
      setAppliedFilters(filters);
    }
  
    return (
      <div className='home-container'>
        <NavBar />
        <div className={styles.searchRow}>
          <div className={styles.searchToggle}>
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
          </div>
  
          {isToggled &&
            <SearchFilters onDataSend={getAppliedFiltersFromChild} />
          }
  
          {!isToggled &&
            <div className={styles.searchContainerRpts}>
              <div className={styles.searchWrapperRpts}>
              <SearchBar />
              </div>
            </div>
          }
        </div>
  
        <div className={styles.homeFold1}>
  
          <h1 className={styles.homeH1Title}>TOP TRENDING REPORTS</h1>
          <h2 className={styles.homeH2Title}>Explore top reports published in sectors / domains of your choice from an aggreation of 1000+ reports</h2>
          <Carousel cards={cardsReports} />

  
          <h1 className={styles.homeH1Title}>KEY PUBLICATIONS</h1>
          <h2 className={styles.homeH2Title}>Explore reports published by more than 100+ publishers and institutions</h2>
          <Carousel1 />
  
          <h1 className={styles.homeH1Title}>OUR VIEWS ON TRENDING REPORTS</h1>
          <h2 className={styles.homeH2Title}>See what insights we have from summarizing reports</h2>
  
          <div className={styles.containerCarouselBlog}>
            <div className={styles.blogCardCarouselScroll}>
              {arrayBlogs.map((blog, index) => (
                <div className={styles.blogCard} key={index}>
                  <div className={styles.blogCardContent}>
                    <img src={blog.bannerImage} alt={blog.contentSlug} className={styles.blogCardImage} />
                    <p>{blog.content.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <Footer />
      </div>
    );
  
  }
  export default Reports;