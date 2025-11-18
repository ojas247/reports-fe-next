'use client';

import Head from 'next/head';
import NavBar from "../components/Functionalities/NavBar";
import SearchBar from '../components/Functionalities/SearchBar';
import Footer from '../components/Website/Footer';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "../styles/Pages/home.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { fetchDataFromGetApi } from '../pages/api/Api';
import DataTiles from '@/components/Website/DataTiles';

export default function HomePage() {
  const [expandedFAQs, setExpandedFAQs] = useState([true, true, true, true, true, true]);

  fetchDataFromGetApi("_ah/warmup");

  const toggleFAQ = (index) => {
    const newExpanded = [...expandedFAQs];
    newExpanded[index] = !newExpanded[index];
    setExpandedFAQs(newExpanded);
  };

  const websiteSchema = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    "url": "https://marketreports.in",
    "name": "MarketReports-by SYNTHESIS",
    "potentialAction": {
      "@type": "ReadAction",
      "target": "https://marketreports.in/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MarketReports-by SYNTHESIS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://storage.googleapis.com/marketreports/Brand/Logo/Logo.ico",
        "width": 600,
        "height": 60
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Market-Reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Market-Reports is a community-driven platform that provides a aggregation of Reports and Data for investment analysts, Fund houses and Corporate Strategists."
        }
      },
      {
        "@type": "Question",
        "name": "How can I access the reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can access the reports by registering on our platform and subscribing to the desired plan by paying a nominal fee."
        }
      },
      {
        "@type": "Question",
        "name": "Why do you charge when the reports and data is available in public domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Although we do not author or publish any reports, there is effort to aggregate reports according to various parameters. Also we as a community bear the cost of servers, databases, and cloud infrastructure. Therefore, we charge a very nominal fee just to justify these expenses."
        }
      },
      {
        "@type": "Question",
        "name": "What if I want to remove reports from this platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely, we understand your concern. Just drop us a line at admin@marketreports.in and we'll promptly comply with your request."
        }
      },
      {
        "@type": "Question",
        "name": "Is there customer support available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide customer support for any inquiries or assistance you may need regarding our reports."
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a specific report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! You can drop us a line at admin@marketreports.in, and we will do our best to cover the specific sector or sub-sector you are interested in."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>MarketReports - Search for Market Reports and Datasets</title>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <div className="w-full z-50 relative">
        <NavBar />
      </div>


      <div className='w-full h-full py-10'>
        <div className="text-center pt-8 pr-6 pb-2 pl-6">
          <p className="text-3xl sm:text-4xl text-center text-[#27406d] mb-12 leading-snug">
            <span className="bg-yellow-200 text-[#1a1a1a] px-2 py-1 rounded-md">
              Byte-Size 
            </span>{" "}
            Snackable Data-Nuggets, <br />
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
              SIMPLIFIED
            </span>{" "}
            and{" "}
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
              VIZUALIZED
            </span>{" "}
            for easy Access
          </p>

        </div>
      </div>

      <div className='w-full h-full py-10'>
        <DataTiles />
      </div>
   

      <div className={styles.homeContainer}>
        <div className={styles.homeSearchBar}>
          <SearchBar />
        </div>

        <p className="text-3xl sm:text-4xl text-center text-[#27406d] mb-12">Search what you&apos;d Research</p>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-16">
          <div className="lg:w-1/2 pl-4 lg:pl-40 pt-10">
            <h1 className={styles.homeHeroText}>Reports & Insights <br /> from over <b>10 years</b></h1>
            <p>MARKET-REPORTS by SYNTHESIS is a community driven platform to help <br /> Investment Analysts & Funds gather market insights with ease.</p>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <Image src="/Assets/Images/HeroIllustration.svg" alt="MarketInsight" className="w-[350px] h-auto pt-5" width={80} height={80} />
          </div>
        </div>

        <div className={styles.homeNumbersBackground}>
          <h3 className={styles.homeNumbersText}>A Macro-Analytics Platform for Market Research</h3>
          <div className={styles.homeNumbersUnderline}></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-4">
            {[
              { number: 150, label: "Publications" },
              { number: 1000, label: "Market Reports" },
              { number: 70, label: "Industries" },
              { number: 10, label: "Clients" }
            ].map(({ number, label }, i) => (
              <div key={i} className="text-center">
                <div className={styles.homeFactsNumbers}>{number}<span className="text-2xl">+</span></div>
                <p className="font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          {[
            {
              icon: "bi-binoculars",
              title: "Quick Research",
              text: "Quick glance through dozens of reports in few clicks saving time on endless google searches"
            },
            {
              icon: "bi-newspaper",
              title: "Tagged Reports",
              text: "Each report is tagged with searchable keywords making it easy to preempt what to expect in the reports"
            },
            {
              icon: "bi-chat-dots",
              title: "Support on Request",
              text: "Drop us a line if you are looking for report coverage on any specific sector or sub-sector."
            }
          ].map(({ icon, title, text }, i) => (
            <div key={i} className="text-center px-4">
              <i className={`bi ${icon} text-3xl text-[#27406d]`} />
              <p className="font-bold text-lg mt-4">{title}</p>
              <p className="text-sm mt-2">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center my-10">
          <Link href="/Register">
            <button className={styles.homeRegisterBtn}>
              Register with us?
            </button>
          </Link>
        </div>

        <div className="w-full bg-gray-100 px-6 py-12 border-t border-gray-200">
          <h2 className={styles.homeFAQText}>Frequently Asked Questions</h2>
          {[
            "What is Market-Reports?",
            "How can I access the reports?",
            "Why do you charge when the reports and data is available in public domain?",
            "What if I want to remove reports from this platform?",
            "Is there customer support available?",
            "Can I request a specific report?"
          ].map((question, index) => (
            <div key={index} className="mb-6 max-w-3xl mx-auto">
              <h3
                onClick={() => toggleFAQ(index)}
                className="cursor-pointer flex justify-between items-center text-lg font-medium text-gray-800"
              >
                {question}
                <span className="text-blue-600 text-xl">{expandedFAQs[index] ? '−' : '+'}</span>
              </h3>
              {expandedFAQs[index] && (
                <p className="mt-2 text-gray-600 text-sm">{
                  faqSchema.mainEntity[index].acceptedAnswer.text
                }</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
