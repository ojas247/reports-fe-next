'use client'

import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import NavBar from "../components/Functionalities/NavBar";
import Footer from "../components/Website/Footer";
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { pushGTMEvent, isSessionTokenValid, getSessionToken } from '../pages/api/UtilFunctions';
import styles from "../styles/Pages/pricing.module.css";
import Link from 'next/link';

export default function Pricing() {
  const backendAPI = process.env.NEXT_PUBLIC_backendAPI;
  const frontendAPI = process.env.NEXT_PUBLIC_frontendAPI;
  const environment = process.env.NEXT_PUBLIC_environment;
  const [emailID, setEmailID] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let cashfree;

  const sessionToken = async () => {
    try {
      const token = await getSessionToken();
      if (token) {
        // Check if token exists and is not undefined or "undefined" string
        return (token && token !== "undefined") ? token : null;
      }
      else {
        router.push('/Login');
        return null;
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }


  const fetchAndDecodeToken = async () => {
    const token = await sessionToken();
    console.log("ldskgjd: ", token)
    if (token) {  // This will now only be true if token exists and is valid
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {  // Additional validation for token structure
          const emailID = decodedToken.sub;
          setEmailID(emailID);
        } else {
          console.warn('Invalid token structure: missing sub field');
          setEmailID("");  // Reset email if token is invalid
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setEmailID("");  // Reset email if decoding fails
      }
    } else {
      console.log('No valid token found');
      setEmailID("");  // Reset email if no valid token
    }
  }



  const handleClick = (price) => {
    fetchAndDecodeToken();
    console.log("price: ", price)
    if (isSessionTokenValid()) {
      // Get UCC from sessionStorage or use a default value
      const ucc = sessionStorage.getItem('UCC') || 'anonymous_user';

      // Push GTM event
      pushGTMEvent({
        eventName: 'plan_button_clicked',
        eventParams: {
          button_name: `${price.id}`,
          plan_amount: price.amount,
          page: window.location.pathname
        },
        userId: ucc,
        userProperties: {
          role: 'client',
          plan: 'xxx',
          country: 'IN'
        }
      });

      axios.post(`${backendAPI}/CashfreeCreateOrder`, {
        mailID: emailID,
        planAmt: price
      })
        .then(response => {
          console.log('SessionID: ', response.data);
          const orderID = response.data;  // Assuming response.data is the order ID
          return orderID; // Return something to the next .then() block, if needed
        })
        .then(orderID => { // This .then() block receives orderID from the previous .then() block
          let checkoutOptions = {
            paymentSessionId: orderID,
            returnUrl: `${frontendAPI}/PaymentSuccess?myorder=${orderID}`
          }

          cashfree.checkout(checkoutOptions).then(function (result) {
            if (result.error) {
              alert(result.error.message)
            }
            if (result.redirect) {
              console.log("Redirection")
            }
          });
        })
        .catch(error => {
          console.error('There was an error creating the order:', error);
        });
    }
    else {
      router.push('/Login'); // redirect to login first before going for plan purchase
    }
  };


  let initializeSDK = async function () {
    if (environment === "UAT") {
      cashfree = await load({
        mode: "sandbox"
      });
    }
    else {
      cashfree = await load({
        mode: "production" //or production
      });
    }
    console.log("ENV: ", environment)
  }

  initializeSDK();

  return (
    <>
      <Head>
        <title>Payment Plans for MarketReports </title>
      </Head>
      <NavBar />
      <div className={styles.pricingContainer}>
        <h1 className={styles.pricingTitle}>Pricing Plans</h1>
        <p className={styles.pricingDesc}>MarketReports is a Brand Company owned by Synthesis</p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6">
          {/* Try it Out Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-xs shadow-md">
            <h2 className={styles.pricingName}>Try it Out</h2>
            <p className="text-3xl text-gray-800 my-4">
              ₹ 20 <span className="text-sm text-gray-500">/day</span>
            </p>
            <ul className={styles.pricingListDetails}>
              <li className="border-b border-gray-200 pb-2">10 Filter-based Searches/day</li>
              <li className="border-b border-gray-200 pb-2">TAT of 2 Days for requested Data</li>
              <li className="border-b border-gray-200 pb-2">Email Support</li>
            </ul>
            <button
              className={styles.pricingBtn}
              onClick={() => handleClick({ id: 'basic', amount: 1 })}
            >
              Get Started
            </button>
          </div>

          {/* Standard Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-xs shadow-md">
            <h2 className={styles.pricingName}>Standard</h2>
            <p className="text-3xl text-gray-800 my-4">
              ₹ 199 <span className="text-sm text-gray-500">/month</span>
            </p>
            <ul className={styles.pricingListDetails}>
              <li className="border-b border-gray-200 pb-2">50 Filter-based Searches/day</li>
              <li className="border-b border-gray-200 pb-2">TAT of 1 Days for requested Data</li>
              <li className="border-b border-gray-200 pb-2">Priority Support</li>
            </ul>
            <button
              className={styles.pricingBtn}
              onClick={() => handleClick({ id: 'standard', amount: 3 })}
            >
              Good Choice
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-xs shadow-md">
            <h2 className={styles.pricingName}>Enterprise</h2>
            <p className="text-3xl text-gray-800 my-4">
              ₹ 1000 <span className="text-sm text-gray-500">/year</span>
            </p>
            <ul className={styles.pricingListDetails}>
              <li className="border-b border-gray-200 pb-2">Unlimited Searches</li>
              <li className="border-b border-gray-200 pb-2">TAT of 3 hours for requested Data</li>
              <li className="border-b border-gray-200 pb-2">24/7 Support</li>
            </ul>
            <button
              className={styles.pricingBtn}
              onClick={() => handleClick({ id: 'pro', amount: 5 })}
            >
              Be a Pro
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// from https://mdbootstrap.com/docs/standard/extended/login/