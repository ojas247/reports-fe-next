//////////////////////////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import styles from "../../styles/UtilityComps/navbar.module.css";
import { isSessionTokenValid } from "../../pages/api/UtilFunctions";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production
  const [isOpen, setIsOpen] = useState(true);
  const [isServicesOpen1, setIsServicesOpen1] = useState(false); // false in production
  const [isServicesOpen2, setIsServicesOpen2] = useState(false); // false in production
  const [isServicesOpen3, setIsServicesOpen3] = useState(false); // false in production

  const toggleNav = () => setIsOpen(!isOpen);
  const toggleServices1 = () => setIsServicesOpen1(!isServicesOpen1);
  const toggleServices2 = () => setIsServicesOpen2(!isServicesOpen2);
  const toggleServices3 = () => setIsServicesOpen3(!isServicesOpen3);

  // // Authentication
  // function checkAuthentication() {
  //   const authBoolean = ;
  //   setIsAuthenticated(authBoolean);
  // }

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
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">
          <img className={styles.LogoImg} src="/Assets/Images/Logo-Trans.svg" alt="MarketInsight" />
        </a>
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


      <nav
        id="primary-navigation"
        className={`${styles.navMenu} ${isOpen ? styles.show : styles.hide}`}
      >
        <ul className={styles.navList}>
          <li className={styles.dropdown}>
            <a href="\Home">Home</a>
          </li>

          <li className={styles.dropdown}>
            <button className={styles.dropbtn} onClick={toggleServices1}>
              MarketResearch
              <img className={styles.toggleImg} src="\Assets\Images\Toggle.svg" alt="MarketInsight" style={{ width: '0.5rem', height: '0.5rem' }} />
            </button>
            <div
              className={`${styles.dropdownContent} ${isServicesOpen1 ? styles.showDropdown : ""
                }`}
            >
              <div className={styles.dropdownContentItem}>
                <i className="bi bi-newspaper" style={{ color: 'midnightblue' }}></i>
                <a href="\Reports" style={{ paddingLeft: '10px' }}>Reports</a>
              </div>

              <div className={styles.dropdownContentItem}>
                <i className="bi bi-pie-chart" style={{ color: 'midnightblue' }}></i>
                <a href="\Data-Search" style={{ paddingLeft: '10px' }}>Data</a>
              </div>

            </div>
          </li>

          <li className={styles.dropdown}>
            <button className={styles.dropbtn} onClick={toggleServices2}>
              Resources
              <img className={styles.toggleImg} src="\Assets\Images\Toggle.svg" alt="MarketInsight" style={{ width: '0.5rem', height: '0.5rem' }} />
            </button>
            <div
              className={`${styles.dropdownContent} ${isServicesOpen2 ? styles.showDropdown : ""
                }`}
            >
              <div className={styles.dropdownContentItem}>
                <i className="bi bi-layout-text-sidebar" style={{ color: 'midnightblue' }}></i>
                <a href="\Insights" style={{ paddingLeft: '10px' }}>Insights</a>
              </div>
              <div className={styles.dropdownContentItem}>
                <i className="bi bi-clipboard-data" style={{ color: 'midnightblue' }}></i>
                <a href="\#" style={{ paddingLeft: '10px' }}>Graphics</a>
              </div>
            </div>
          </li>

          <li className={styles.dropdown}>
            <a href="\Pricing">Pricing</a>
          </li>


          {!isAuthenticated && (
            <ul className={styles.LoginSignup}>

              <li className={`${styles.dropdown} ${styles.signupBtn}`}>
                <a href="\Register">Signup</a>
              </li>

              <li className={styles.dropdown}>
                <a href="\Login">Login</a>
              </li>
            </ul>
          )}

          {isAuthenticated && (
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
                  <a href="\Profile" style={{ paddingLeft: '10px' }}>Your Profile</a>
                </div>
                <div className={styles.dropdownContentItem}>
                  <i className="bi bi-award" style={{ color: 'midnightblue' }}></i>
                  <a href="\Pricing" style={{ paddingLeft: '10px' }}>Upgrade</a>
                </div>
                <div className={styles.dropdownContentItem}>
                  <i className="bi bi-box-arrow-right" style={{ color: 'midnightblue' }}></i>
                  <a href="\Login" style={{ paddingLeft: '10px' }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevents default navigation so you can clear storage first
                      sessionStorage.removeItem('token');
                      window.location.href = "/Login"; // Redirect manually
                    }}>Logout</a>
                </div>
              </div>
            </li>
          )}







        </ul>
      </nav>
    </header>
  );
}
