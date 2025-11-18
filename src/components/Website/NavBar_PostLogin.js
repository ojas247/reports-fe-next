//////////////////////////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import styles from "../../styles/UtilityComps/navbar.module.css";
import { isSessionTokenValid } from "../../pages/api/UtilFunctions";
import SearchBar from '../../components/Functionalities/SearchBar';
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
    <header className="flex justify-between items-center p-4 bg-white relative">
      <div className={styles.logo}>
        <Link href="/">
          <Image className={styles.LogoImg} src="/favicon.ico" alt="MarketInsight" width={40 } height={150}/>
        </Link>
      </div>

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

      <SearchBar />


      <nav
        id="primary-navigation"
        className={`${styles.navMenu} ${isOpen ? styles.show : styles.hide}`}
      >
        <ul className={styles.navList}>          
            <li className={styles.dropdown}>
              <button className={styles.dropbtn} onClick={toggleServices3}>
                <i className="bi bi-person-circle" style={{ fontSize: '1.25rem' }}></i>
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
            </li>
        

        </ul>
      </nav>
    </header>
  );
}
