"use client";
import React, { useState, useEffect, useRef } from 'react';
import style from './NavBar.module.css';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';


  function StandardNavBar() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const [isAuthenticated, setIsAuthenticated] = useState(false); // false in production
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef();

  // <To open a hamburger dropdown>
  useEffect(() => {
    navRef.current = document.querySelector("#NavbarStd");
    checkAuthentication();
  }, []);

  const showNavbar = () => {
    setIsOpen(true);
    navRef.current.classList.toggle(
      "responsive_nav"
    );
  };
  // </To open a hamburger dropdown>

  //<To close the hamburger menu>
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navRef.current.contains(event.target)) {// Click occurred outside of the hamburger menu, close the menu
        setIsOpen(false);
        navRef.current.classList.remove("responsive_nav");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Make sure to include isOpen in the dependency array...../////////
  // </ To close the hamburger menu>


  // Authentication
  function checkAuthentication() {
    const token = localStorage.getItem('token');
    axios.get(`${backendAPI}/AuthCheck`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      .then(res => {
        console.log("resData:", res.data);
        const authBoolean = res.data;
        setIsAuthenticated(authBoolean);

      })
  }
  // checkAuthentication();

  return (
    <div className={style.NavBar}>
      <div className={style.Logo}>
      <img className={style.LogoImg} src="/Assets/Images/Logo-Trans.svg" alt="MarketInsight" />
      </div>

      <div ref={navRef} id='NavbarStd' className={style.NavbarStd}>
        <div className={style.itemContainer}>
          <div className={style.dropdown}>
            <div className={style.Home}>
              <a href="\">Home</a>
            </div>
          </div>
        </div>

        <div className={style.itemContainer}>
          <div className={style.dropdown}>
            <button className={style.dropbtn}>Market Research</button>
            <img className={style.dropdownImg} src="\Assets\Images\Toggle.svg" alt="Toggle" />
            <div className={style.dropdownContent}>
              <div className={style.dropdownContentItem}>
                <i className="bi bi-clipboard-data"></i>
                <a href="\Graphics">Graphics</a></div>
              <div className={style.dropdownContentItem}>
                <i className="bi bi-newspaper" ></i>
                <a href="\Reports">Reports</a></div>
            </div>
          </div>
        </div>

        <div className={style.itemContainer}>
          <div className={style.dropdown}>
            <button className={style.dropbtn}>Resources</button>
            <img className={style.dropdownImg} src="\Assets\Images\Toggle.svg" alt="MarketInsight" />
            <div className={style.dropdownContent}>
              <div className={style.dropdownContentItem}>
                <i className="bi bi-layout-text-sidebar"></i>
                <a href="\Insights">Insights</a>
              </div>
              <div className={style.dropdownContentItem}>
                <i className="bi bi-pie-chart"></i>
                <a href="\Data-Search">Data</a></div>
            </div>
          </div>
        </div>

        <div className={style.itemContainer}>
          <div className={style.Home}>
            <a href="\Pricing">Pricing</a>
          </div>
        </div>

        {!isAuthenticated && (
          <div className={style.itemContainerPushRight}>
            <div className={style.Signup}>
              <a className="aLinkSP" href="\Register">Signup</a>
            </div>
          </div>
        )}



        {isAuthenticated ? (
          <div className={style.LoginLogoutAuthenticated}>
            <div>
              <div className={style.dropdown}>
                <button className={style.profileCircle}><i class="bi bi-person-circle"></i></button>
                <div className={style.dropdownContent}>

                  <div className={style.dropdownContentItem}>
                    <i class="bi bi-box-arrow-right"></i>
                    <a
                      href="/Login"
                      onClick={(e) => {
                        e.preventDefault(); // Prevents default navigation so you can clear storage first
                        localStorage.removeItem('token');
                        window.location.href = "/Login"; // Redirect manually
                      }}
                      className={style.logoutLink}
                    >
                      Logout
                    </a>
                  </div>


                  <div className={style.dropdownContentItem}>
                    <i class="bi bi-person-badge"></i>
                    <a href="\Profile">Your Profile</a></div>
                  <div className={style.dropdownContentItem}>
                    <i class="bi bi-award"></i>
                    <a href="\Pricing">Upgrade</a></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Render components for unauthenticated user
          <div className={style.itemContainer}>
            <div>
              <div className={style.Login}> <a className="aLink" href="\Login">Login </a></div>
            </div>
          </div>

        )}
      </div>



      <button onClick={showNavbar} className={style.navBtn}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M4 6l16 0" /> <path d="M4 12l16 0" /> <path d="M4 18l16 0" /> </svg>
      </button>
    </div>
  );
}

export default StandardNavBar;

