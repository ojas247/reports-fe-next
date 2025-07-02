// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import styles from '../../styles/navbar.module.css';
// import axios from 'axios';
// import 'bootstrap-icons/font/bootstrap-icons.css';


// function NavBar1() {
//   const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production
//   const [isOpen, setIsOpen] = useState(false);
//   const navRef = useRef();

//   // // <To open a hamburger dropdown>
//   // useEffect(() => {
//   //   navRef.current = document.querySelector("#NavbarStd");
//   //   checkAuthentication();
//   // }, []);

//   const showNavbar = () => {
//     setIsOpen(!isOpen);
//   };
//   // // </To open a hamburger dropdown>

//   // //<To close the hamburger menu>
//   // useEffect(() => {
//   //   const handleClickOutside = (event) => {
//   //     if (!navRef.current.contains(event.target)) {// Click occurred outside of the hamburger menu, close the menu
//   //       setIsOpen(false);
//   //       navRef.current.classList.remove("responsive_nav");
//   //     }
//   //   };
//   //   document.addEventListener("mousedown", handleClickOutside);

//   //   return () => {
//   //     document.removeEventListener("mousedown", handleClickOutside);
//   //   };
//   // }, [isOpen]); // Make sure to include isOpen in the dependency array...../////////
//   // // </ To close the hamburger menu>


//   const toggleMenu = () => setIsOpen(prev => !prev);


//   // Authentication
//   function checkAuthentication() {
//     const token = localStorage.getItem('token');
//     axios.get(`${backendAPI}/AuthCheck`,
//       {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         }
//       })
//       .then(res => {
//         console.log("resData:", res.data);
//         const authBoolean = res.data;
//         setIsAuthenticated(authBoolean);

//       })
//   }
//   // checkAuthentication();

//   return (
//     <div className={styles.NavBar}>
//       <div className={styles.Logo}>
//         <img className={styles.LogoImg} src="/Assets/Images/Logo-Trans.svg" alt="MarketInsight" />
//       </div>

//       <nav
//         id="primary-navigation"
//         className={`${styles.navMenu} ${isOpen ? styles.show : styles.hide}`}
//         aria-controls="primary-navigation"
//       >

//         <div ref={navRef} className={styles.NavbarStd}>
//           <div className={styles.itemContainer}>
//             <div className={styles.dropdown}>
//               <div className={styles.Home}>
//                 <a href="\">Home</a>
//               </div>
//             </div>
//           </div>

//           <div className={styles.itemContainer}>
//             <div className={styles.dropdown}>
//               <button className={styles.dropbtn}>Market Research</button>
//               <img className={styles.dropdownImg} src="\Assets\Images\Toggle.svg" alt="Toggle" />
//               <div className={styles.dropdownContent}>
//                 <div className={styles.dropdownContentItem}>
//                   <i className="bi bi-clipboard-data"></i>
//                   <a href="\Graphics">Graphics</a></div>
//                 <div className={styles.dropdownContentItem}>
//                   <i className="bi bi-newspaper" ></i>
//                   <a href="\Reports">Reports</a></div>
//               </div>
//             </div>
//           </div>

//           <div className={styles.itemContainer}>
//             <div className={styles.dropdown}>
//               <button className={styles.dropbtn}>Resources</button>
//               <img className={styles.dropdownImg} src="\Assets\Images\Toggle.svg" alt="MarketInsight" />
//               <div className={styles.dropdownContent}>
//                 <div className={styles.dropdownContentItem}>
//                   <i className="bi bi-layout-text-sidebar"></i>
//                   <a href="\Insights">Insights</a>
//                 </div>
//                 <div className={styles.dropdownContentItem}>
//                   <i className="bi bi-pie-chart"></i>
//                   <a href="\Data-Search">Data</a></div>
//               </div>
//             </div>
//           </div>

//           <div className={styles.itemContainer}>
//             <div className={styles.Home}>
//               <a href="\Pricing">Pricing</a>
//             </div>
//           </div>

//           {!isAuthenticated && (
//             <div className={styles.itemContainerPushRight}>
//               <div className={styles.Signup}>
//                 <a className="aLinkSP" href="\Register">Signup</a>
//               </div>
//             </div>
//           )}



//           {isAuthenticated ? (
//             <div className={styles.LoginLogoutAuthenticated}>
//               <div>
//                 <div className={styles.dropdown}>
//                   <button className={styles.profileCircle}><i class="bi bi-person-circle"></i></button>
//                   <div className={styles.dropdownContent}>

//                     <div className={styles.dropdownContentItem}>
//                       <i class="bi bi-box-arrow-right"></i>
//                       <a
//                         href="/Login"
//                         onClick={(e) => {
//                           e.preventDefault(); // Prevents default navigation so you can clear storage first
//                           localStorage.removeItem('token');
//                           window.location.href = "/Login"; // Redirect manually
//                         }}
//                         className={styles.logoutLink}
//                       >
//                         Logout
//                       </a>
//                     </div>


//                     <div className={styles.dropdownContentItem}>
//                       <i class="bi bi-person-badge"></i>
//                       <a href="\Profile">Your Profile</a></div>
//                     <div className={styles.dropdownContentItem}>
//                       <i class="bi bi-award"></i>
//                       <a href="\Pricing">Upgrade</a></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // Render components for unauthenticated user
//             <div className={styles.itemContainer}>
//               <div>
//                 <div className={styles.Login}> <a className="aLink" href="\Login">Login </a></div>
//               </div>
//             </div>

//           )}
//         </div>
//       </nav>


//       <button aria-controls="primary-navigation"
//         aria-expanded={isOpen}
//         onClick={toggleMenu}
//         className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         <span className={styles.srOnly}>Menu</span>
//         ☰
//       </button>

//     </div>
//   );
// }

// export default NavBar1;

