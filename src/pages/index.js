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
import AutoCarouselBanner from '@/components/Website/AutoCarouselBanner';
import MarketUpdate from '@/components/Website/MarketUpdate';

export default function IndexPage() {
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
          "text": "Market-Reports is a community-driven platform that provides a aggregation of Reports and Data for investment analysts, Fund houses and Corporate Strategists. Our entire data-sets are free for donwload, a gesture of paying it forward to the entrepreneur-communityx"
        }
      },
      {
        "@type": "Question",
        "name": "How can I access the data-reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can access the reports/data for free and download it for building your own analysis. For using Filter-based searching, AI-powered summary, we charge a nominal fee, that we'd need to keep our server running."
        }
      },
      {
        "@type": "Question",
        "name": "Why do you charge when the data is available in public domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can freely access our data. We charge for a few premium features where,  we as a community bear the cost of servers, databases, and cloud infrastructure. Therefore, we charge a very nominal fee just to justify these expenses."
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
        "name": "Can I request report or data in a specific domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! You can drop us a line at admin@marketreports.in, and we will do our best to cover the specific sector or sub-sector you are interested in."
        }
      }
    ]
  };

  const bannerImages = [
    '/Assets/Images/HomePage/SS1.png',
    '/Assets/Images/HomePage/SS2.png',
    '/Assets/Images/HomePage/SS3.png',
  ];

  return (
    <>
      <Head>
        <title>MarketReports - Search for Market Reports and Datasets</title>
        <meta name="description" content="A repository for free download of Research Reports and Market Data, from over 1000+ Reports and 80,000+ Data points, across 70+ industries and 100+ authors"></meta>
        <meta name="keywords" content="Market Reports, Research Reports, Market Data, Free Download, Open Source, Community Driven, Aggregation and Visualization, Market Research Tracking"></meta>
        <meta name="author" content="MarketReports"></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta name="googlebot" content="index, follow"></meta>
        <meta name="bingbot" content="index, follow"></meta>
        <meta name="yandexbot" content="index, follow"></meta>
        <meta name="duckduckbot" content="index, follow"></meta>
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

      <div className='w-full h-full py-10 ml-[3%]'>
        <h2 className="text-2xl font-bold text-[#27406d] border-b border-gray-600">Insights across 8k Datapoints</h2>
        <DataTiles />
      </div>


      <div className=" flex flex-col items-center mt-[10%] mb-[10%]">
        <div className="w-[80%] max-w-md my-8">
          <SearchBar />
        </div>
        <p className="text-3xl sm:text-4xl text-center text-[#27406d] mb-5">Search / Download for FREE</p>
        <p className="text-xl sm:text-sm text-center text-[#27406d] mb-8">We do charge a small patronage fee, if you wish to use product-features for analytics, AI-assisted Summaries and Insigths</p>
      </div>


      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-[#27406d] border-b border-gray-600">Monitor 70+ Sectors & Sub-Sectors</h2>
        <MarketUpdate />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-16">
        <div className="lg:w-1/2 pl-4 lg:pl-40 pt-10">
          <h1 className={styles.homeHeroText}>Reports & Insights <br /> from over <b>10 years</b></h1>
          <p>MARKET-REPORTS by SYNTHESIS is a community driven platform to help <br /> Investment Analysts & Funds gather market insights with ease.</p>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <Image src="/Assets/Images/HeroIllustration.svg" alt="MarketInsight" className="w-[350px] h-auto pt-5" width={80} height={80} />
        </div>
      </div>

      <div>
        <div className="bg-gray-50 py-8 mt-[15%] ml-[3%]">
          <h2 className="text-2xl font-bold text-[#27406d] border-b border-gray-600 mb-8">APIs and Data-Correlation Inside </h2>
          <AutoCarouselBanner
            images={bannerImages}
            height={500}
          />
        </div>




        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#27406d" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        <div className="bg-[#27406d] w-full pt-12 pb-12 text-center">
          <h3 className="text-2xl sm:text-4xl font-semibold mb-[-12px] text-blue-100">A Macro-Analytics Platform for Market Research</h3>
          <div className="h-2 bg-blue-300 w-3/5 mx-auto opacity-50 mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-4">
            {[
              { number: 150, label: "Publications" },
              { number: 1000, label: "Market Reports" },
              { number: 70, label: "Industries" },
              { number: 80000, label: "Data Points" }
            ].map(({ number, label }, i) => (
              <div key={i} className="text-center">
                <div className="text-blue-300 text-4xl leading-10 font-bold">{number}<span className="text-2xl">+</span></div>
                <p className="font-semibold text-blue-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#27406d" fill-opacity="1" d="M0,224L48,224C96,224,192,224,288,224C384,224,480,224,576,208C672,192,768,160,864,149.3C960,139,1056,149,1152,170.7C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>

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

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f3f4f6" fill-opacity="1" d="M0,224L48,224C96,224,192,224,288,224C384,224,480,224,576,208C672,192,768,160,864,149.3C960,139,1056,149,1152,170.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
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
