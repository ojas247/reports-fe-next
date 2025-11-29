//////////////////////////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import styles from "../../styles/UtilityComps/navbar.module.css";
import { isSessionTokenValid } from "../../pages/api/UtilFunctions";
import SearchBar from '../../components/Functionalities/SearchBar';
import SearchBarMobile from '../../components/Functionalities/SearchBarMobile';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar_PostLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen1, setIsServicesOpen1] = useState(false); // false in production
  const [isServicesOpen2, setIsServicesOpen2] = useState(false); // false in production
  const [isServicesOpen3, setIsServicesOpen3] = useState(false); // false in production

  const toggleNav = () => setIsOpen(!isOpen);
  const toggleServices1 = () => setIsServicesOpen1(!isServicesOpen1);
  const toggleServices2 = () => setIsServicesOpen2(!isServicesOpen2);
  const toggleServices3 = () => setIsServicesOpen3(!isServicesOpen3);


  // 🛠️ Auto-close mobile nav when switching to desktop
  useEffect(() => {
    setIsAuthenticated(isSessionTokenValid());
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setIsServicesOpen1(false);
        setIsServicesOpen2(false);
        setIsServicesOpen3(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="flex w-full sticky sm:relative top-0 md:py-2 z-50 justify-between items-center px-4 py-0 bg-white">

      {!isOpen && (
        <button
          className={styles.hamburger}
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          onClick={toggleNav}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
      )}
      {isOpen && (
        <button
          className={styles.hamburger}
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
          onClick={toggleNav}
        >
          <span className={styles.hamburgerBar}></span>
        </button>
      )}

      {/* MOBILE VERSION (visible only on mobile) */}
      <div className="w-full">
        {/* Mobile: Below md breakpoint */}
        <div className="md:hidden">
          <SearchBarMobile />
        </div>
        {/* Desktop: md breakpoint and up */}
        <div className="hidden md:block">
          <SearchBar />
        </div>
      </div>



      <nav
        id="primary-navigation"
        className={`${styles.navMenu} ${isOpen ? styles.show : styles.hide}`}
      >
        <ul className={styles.navList}>
          <li className={styles.dropdown}>
            <div className="flex flex-col ">
              <div className="inline-flex items-center flex-row ml-4 md:hidden">
                <i className="bi bi-newspaper" style={{ color: 'midnightblue' }}></i>
                <Link href="/Research/Reports" style={{ paddingLeft: '10px' }}>Reports</Link>
              </div>

              <div className="inline-flex items-center flex-row ml-4 md:hidden">
                <i className="bi bi-pie-chart" style={{ color: 'midnightblue' }}></i>
                <Link href="/Research/Data" style={{ paddingLeft: '10px' }}>Data</Link>
              </div>

              <div className="inline-flex items-center flex-row ml-4 md:hidden">
                <i className="bi bi-reception-3" style={{ color: 'midnightblue' }}></i>
                <Link href="/Research/Correlations" style={{ paddingLeft: '10px' }}>Corellations</Link>
              </div>

              <div className="inline-flex items-center flex-row ml-4 md:hidden">
                <i className="bi bi-claude" style={{ color: 'midnightblue' }}></i>
                <Link href="/Research/AI-Insights" style={{ paddingLeft: '10px' }}>AI Insights</Link>
              </div>

              <button className={styles.dropbtn} onClick={toggleServices3}>
                <i className="bi bi-person-circle" style={{ fontSize: '2.25rem', color: 'midnightblue'  }}></i>
              </button>
              <div
                className={`${styles.dropdownContentProfile} ${isServicesOpen3 ? styles.showDropdown : ""
                  }`}
              >
                <div className={styles.dropdownContentItem}>
                  <i className="bi bi-person-badge" style={{ color: 'midnightblue' }}></i>
                  <Link href="/Settings/Profile" style={{ paddingLeft: '10px' }}>Your Profile</Link>
                </div>
                <div className={styles.dropdownContentItem}>
                  <i className="bi bi-award" style={{ color: 'midnightblue' }}></i>
                  <Link href="/Pricing" style={{ paddingLeft: '10px' }}>Upgrade</Link>
                </div>
                <div className={styles.dropdownContentItem}>
                  <i className="bi bi-box-arrow-right" style={{ color: 'midnightblue' }}></i>
                  <Link href="/Login" style={{ paddingLeft: '10px' }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevents default navigation so you can clear storage first
                      sessionStorage.removeItem('token');
                      window.location.href = "/Login"; // Redirect manually
                    }}>Logout</Link>
                </div>
              </div>
            </div>
          </li>


        </ul>
      </nav>
    </header>
  );
}
