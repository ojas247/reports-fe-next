'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import NavBar from "../components/Functionalities/NavBar";
import SearchBar from '../components/Functionalities/SearchBar';
import Footer from '../components/Website/Footer';
import DataTiles from '@/components/Website/DataTiles';
import MarketUpdate from '@/components/Website/MarketUpdate';
import {
  fetchDataFromGetApi,
  fetchDataFromPostApi
} from '../pages/api/Api';

export default function IndexPage() {
  const [expandedFAQs, setExpandedFAQs] = useState([
    true,
    false,
    false,
    false,
    false,
    false
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [tickertapeData, setTickertapeData] = useState([]);
  const [tickertapeLoading, setTickertapeLoading] = useState(true);

  const [correlationTable, setCorrelationTable] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [feedData, setFeedData] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [expandedFeed, setExpandedFeed] = useState([]);

  const carouselSlides = [
    {
      url: "https://storage.googleapis.com/marketreports/Brand/Logo/Logo.ico",
      title: "Data Correlation Engine",
      caption:
        "Real-time mapping of macro indicators against asset returns across 70+ sectors."
    },
    {
      url: "https://storage.googleapis.com/marketreports/Brand/Logo/Logo.ico",
      title: "API Endpoint Architecture",
      caption:
        "High-frequency REST and WebSocket data feeds built for instant analyst integration."
    },
    {
      url: "https://storage.googleapis.com/marketreports/Brand/Logo/Logo.ico",
      title: "Predictive Signal Heatmap",
      caption:
        "Sector-wise regression analysis identifying non-financial leading indicators."
    }
  ];

  useEffect(() => {
    const getTickertapeData = async () => {
      setTickertapeLoading(true);

      try {
        const response = await fetchDataFromGetApi("tickertape");

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const formattedData = data.map((item, index) => {
          const change = Number(
            item.perChange ??
            item.percentChange ??
            item.changePercent ??
            item.percentageChange ??
            0
          );

          const value =
            item.value ??
            item.price ??
            item.currentValue ??
            item.lastPrice ??
            item.currentPrice ??
            item.val ??
            null;

          return {
            id: item.id ?? index + 1,
            name:
              item.displayName ??
              item.item ??
              item.name ??
              "Market Indicator",
            val:
              value !== null && value !== undefined
                ? String(value)
                : null,
            chg: `${change >= 0 ? "▲" : "▼"} ${Math.abs(change)}%`,
            type: change >= 0 ? "up" : "down",
            raw: item
          };
        });

        setTickertapeData(formattedData);
      } catch (error) {
        console.error("Error fetching Tickertape data:", error);
        setTickertapeData([]);
      } finally {
        setTickertapeLoading(false);
      }
    };

    getTickertapeData();

    const getFeedData = async () => {
      setFeedLoading(true);
      try {
        const response = await fetchDataFromGetApi("latestFeed");
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setFeedData(data);
        setExpandedFeed(new Array(data.length).fill(false));
      } catch (error) {
        console.error("Error fetching latest feed:", error);
        setFeedData([]);
      } finally {
        setFeedLoading(false);
      }
    };

    getFeedData();

    setCorrelationTable([
      {
        id: 1,
        metric: "Rail Freight Volumes",
        targetSector: "Logistics & Supply Chain",
        correlation: "0.94",
        status: "Strong Positive",
        trend: "Up"
      },
      {
        id: 2,
        metric: "Cement Dispatches",
        targetSector: "Real Estate & Infrastructure",
        correlation: "0.89",
        status: "Strong Positive",
        trend: "Up"
      },
      {
        id: 3,
        metric: "Air Passenger Traffic",
        targetSector: "Aviation & Tourism",
        correlation: "0.88",
        status: "Strong Positive",
        trend: "Up"
      },
      {
        id: 4,
        metric: "GST E-way Bills",
        targetSector: "Broad Market (NIFTY50)",
        correlation: "0.69",
        status: "Moderate Positive",
        trend: "Stable"
      },
      {
        id: 5,
        metric: "Diesel Consumption",
        targetSector: "Logistics & OMCs",
        correlation: "0.76",
        status: "Moderate Positive",
        trend: "Up"
      },
      {
        id: 6,
        metric: "Power Demand (Peak)",
        targetSector: "Power & Utilities",
        correlation: "0.82",
        status: "Strong Positive",
        trend: "Up"
      }
    ]);
    setTableLoading(false);

  }, []);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % carouselSlides.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + carouselSlides.length) %
        carouselSlides.length
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQs((prev) => {
      const nextState = [...prev];
      nextState[index] = !nextState[index];
      return nextState;
    });
  };

  const toggleFeedExpand = (index) => {
    setExpandedFeed((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Show only the first 4 items
  const visibleFeed = feedData.slice(0, 4);

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
          "text":
            "Market-Reports is a community-driven platform that provides an aggregation of Reports and Data for investment analysts, Fund houses, and Corporate Strategists."
        }
      },
      {
        "@type": "Question",
        "name": "How can I access the data-reports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "You can access the reports/data for free and download it for building your own analysis."
        }
      },
      {
        "@type": "Question",
        "name":
          "Why do you charge when the data is available in public domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "We charge a nominal fee strictly for premium features like AI-powered summaries and custom filters to cover cloud infrastructure costs."
        }
      },
      {
        "@type": "Question",
        "name":
          "What if I want to remove reports from this platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Drop us a line at admin@marketreports.in and we will promptly comply with your request."
        }
      },
      {
        "@type": "Question",
        "name": "Is there customer support available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, we provide direct support for any inquiries or dataset requests."
        }
      },
      {
        "@type": "Question",
        "name":
          "Can I request report or data in a specific domain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Absolutely! Contact admin@marketreports.in to request specific sector coverage."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0F1A2B] font-sans antialiased selection:bg-[#F4E6C9] selection:text-[#152238]">
      <Head>
        <title>
          MarketReports — Byte-Size Snackable Data-Nuggets
        </title>

        <meta
          name="description"
          content="A repository for free download of Research Reports and Market Data, from over 1000+ Reports and 80,000+ Data points."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      </Head>

      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          display: flex;
          width: max-content;
          animation: scroll-left 85s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="bg-[#152238] text-white overflow-hidden whitespace-nowrap border-b border-white/10 select-none">
        <div className="animate-scroll-left py-2.5 font-mono text-[11px] sm:text-[12px]">
          {tickertapeLoading ? (
            <div className="flex gap-8 items-center px-4">
              <span className="text-slate-400">
                Loading market indicators...
              </span>
            </div>
          ) : tickertapeData.length > 0 ? (
            [1, 2, 3].map((repeatGroup) => (
              <div
                key={repeatGroup}
                className="flex gap-6 sm:gap-8 items-center px-4"
              >
                {tickertapeData.map((item) => (
                  <span
                    key={`${item.id}-${repeatGroup}`}
                    className="inline-flex items-center gap-1.5 text-slate-200"
                  >
                    <span>{item.name}</span>

                    {item.val !== null && (
                      <b className="text-white">
                        {item.val}
                      </b>
                    )}

                    <span
                      className={
                        item.type === "down"
                          ? "text-[#F0A08C]"
                          : "text-[#6FD3A5]"
                      }
                    >
                      {item.chg}
                    </span>
                  </span>
                ))}
              </div>
            ))
          ) : (
            <div className="flex gap-8 items-center px-4">
              <span className="text-slate-400">
                Market data unavailable
              </span>
            </div>
          )}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE3DE]">
        <NavBar />
      </header>

      <main>
        <section className="pt-8 sm:pt-16 pb-12 sm:pb-20 bg-[radial-gradient(700px_300px_at_85%_-10%,#F4E6C9,transparent_70%)]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">

            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <span className="inline-block font-mono text-[11px] sm:text-xs tracking-wider uppercase text-[#C7912F] font-semibold bg-[#F4E6C9]/40 px-3 py-1 rounded-full border border-[#C7912F]/20">
                Non-Financial Data · Leading Indicators
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#152238] leading-[1.15]">
                Byte-Size Snackable Data-Nuggets,{" "}
                <em className="not-italic text-[#C7912F] border-b-4 border-[#F4E6C9]">
                  SIMPLIFIED and VIZUALIZED
                </em>{" "}
                for easy Access
              </h1>

              <p className="text-sm sm:text-lg text-[#4A5568] leading-relaxed max-w-xl">
                The economy moves before the market does. Access and download high-frequency research datasets completely free.
              </p>

              <div className="pt-1 max-w-xl">
                <SearchBar />
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[11px] sm:text-xs text-[#4A5568] font-mono pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E7A5C]" />
                  1,000+ Reports Free
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E7A5C]" />
                  80,000+ Datapoints
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E7A5C]" />
                  70+ Sectors
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#152238] rounded-2xl p-5 sm:p-6 text-white shadow-2xl border border-white/10 space-y-4 sm:space-y-5">

                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                    Macro Signal Tracker
                  </h3>

                  <span className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#6FD3A5] uppercase tracking-wider bg-[#6FD3A5]/10 px-2.5 py-0.5 rounded-full border border-[#6FD3A5]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6FD3A5] animate-pulse" />
                    {tickertapeLoading ? "Loading" : "Live API"}
                  </span>
                </div>

                {tickertapeLoading ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 animate-pulse"
                      >
                        <div className="h-3 bg-white/10 rounded w-24 mb-3" />
                        <div className="h-6 bg-white/10 rounded w-20 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-14" />
                      </div>
                    ))}
                  </div>
                ) : tickertapeData.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {tickertapeData.slice(0, 4).map((ind) => (
                      <div
                        key={ind.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5 space-y-1 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[10px] sm:text-[11px] font-medium text-[#B7C1D6] block truncate">
                          {ind.name}
                        </span>

                        {ind.val !== null ? (
                          <div className="font-mono text-base sm:text-xl font-bold">
                            {ind.val}
                          </div>
                        ) : (
                          <div className="font-mono text-xs sm:text-sm text-[#B7C1D6]">
                            Market Data
                          </div>
                        )}

                        <div
                          className={`text-[11px] sm:text-xs font-mono font-semibold ${
                            ind.type === "down"
                              ? "text-[#F0A08C]"
                              : "text-[#6FD3A5]"
                          }`}
                        >
                          {ind.chg}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-[#B7C1D6]">
                    No market indicators available.
                  </div>
                )}

                <div className="pt-1 flex justify-between items-center text-xs text-[#B7C1D6]">
                  <a
                    href="#analytics"
                    className="text-[#C7912F] font-semibold hover:underline text-[11px] sm:text-xs"
                  >
                    View visualizer →
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        <section className="border-y border-[#DDE3DE] bg-[#F2F5F2] py-6 sm:py-8">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { number: "150+", label: "Publications" },
              { number: "1,000+", label: "Market Reports" },
              { number: "70+", label: "Industries Tracked" },
              { number: "80,000+", label: "Data Points" }
            ].map((stat, i) => (
              <div
                key={i}
                className="lg:border-r border-[#DDE3DE] last:border-0 px-2"
              >
                <b className="block text-xl sm:text-4xl font-bold text-[#152238] font-mono tracking-tight">
                  {stat.number}
                </b>

                <span className="text-[10px] sm:text-xs font-mono text-[#4A5568] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="mb-6 sm:mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
              Byte-Size Nuggets
            </span>

            <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
              Insights Across Datapoints
            </h2>
          </div>

          <DataTiles />
        </section>

        <section className="py-12 sm:py-16 bg-[#F2F5F2] border-y border-[#DDE3DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 space-y-6">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
                Sector Coverage
              </span>

              <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
                Monitor 70+ Sectors & Sub-Sectors
              </h2>
            </div>

            <MarketUpdate />
          </div>
        </section>

        {/* Today's data releases section */}
        <section className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
            <div>
              <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
                Live feed
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
                Today's data releases
              </h2>
            </div>
            <Link href="/all-releases" className="text-[#C7912F] font-semibold hover:underline text-sm whitespace-nowrap">
              See all releases →
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Left column: feed list (only 4 items) */}
            <div className="md:w-2/3 w-full">
              <div className="border border-[#DDE3DE] rounded-2xl overflow-hidden">
                {feedLoading ? (
                  <div className="p-8 text-center text-[#4A5568]">Loading feed...</div>
                ) : feedData.length === 0 ? (
                  <div className="p-8 text-center text-[#4A5568]">No releases available.</div>
                ) : (
                  visibleFeed.map((item, idx) => {
                    const isExpanded = expandedFeed[idx] || false;
                    const desc = item.dataDesc || '';
                    const shouldTruncate = desc.length > 120;
                    const displayDesc = shouldTruncate && !isExpanded
                      ? desc.slice(0, 120) + '…'
                      : desc;

                    const initials = item.dataName
                      ? item.dataName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
                      : 'N/A';

                    return (
                      <a
                        key={idx}
                        href={item.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border-b border-[#DDE3DE] last:border-0 p-4 hover:bg-[#F2F5F2] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#F2F5F2] flex items-center justify-center font-mono text-xs font-bold text-[#152238] shrink-0 border border-[#DDE3DE]">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-[#152238] text-sm sm:text-base">
                              {item.dataName || 'Untitled'}
                            </h5>
                            <p className="text-sm text-[#4A5568] leading-relaxed mt-1">
                              {displayDesc}
                              {shouldTruncate && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleFeedExpand(idx);
                                  }}
                                  className="ml-1 text-[#C7912F] font-medium hover:underline focus:outline-none"
                                >
                                  {isExpanded ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </p>
                            <div className="text-xs font-mono text-[#96A0B2] mt-1 flex items-center gap-2">
                              <span>{item.sub1 || 'General'}</span>
                              <span>·</span>
                              <span>{item.age || 'Just now'}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right column: Correlation spotlight with fixed height */}
            <div className="md:w-1/3 w-full md:self-start">
              <div className="bg-[#152238] rounded-2xl p-6 text-white flex flex-col h-[340px] overflow-y-auto">
                <h4 className="text-lg font-bold text-white">Correlation spotlight</h4>
                <p className="text-sm text-[#B7C1D6] mt-1 mb-4">
                  How today's leading indicators have historically tracked equity sectors, 24 months out.
                </p>
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Cement Dispatch → Infra stocks', score: '0.81' },
                    { label: 'Diesel Consumption → Logistics', score: '0.76' },
                    { label: 'Air Pax Traffic → Aviation', score: '0.88' },
                    { label: 'E-way Bills → Broad market', score: '0.69' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2 text-sm">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-[#C7912F]">{item.score}</span>
                    </div>
                  ))}
                </div>
                <Link href="/correlations">
                  <span className="mt-4 block w-full text-center bg-[#C7912F] text-[#231602] font-semibold py-2.5 rounded-full hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer">
                    Explore correlations →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="analytics"
          className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8"
        >
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
              Analytics Suite
            </span>

            <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
              APIs and Data-Correlation Inside
            </h2>
          </div>

          <div className="bg-[#152238] rounded-2xl p-4 sm:p-8 text-white border border-white/10 shadow-2xl space-y-4 sm:space-y-6">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Visual Engine & API Analytics
                </h3>

                <p className="text-xs text-[#B7C1D6]">
                  Explore real-time data visualizer slides and infrastructure maps.
                </p>
              </div>

              <span className="text-xs font-mono text-[#C7912F] bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
                Slide {currentSlide + 1} of {carouselSlides.length}
              </span>
            </div>

            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center group p-4 sm:p-8">
              <img
                src={carouselSlides[currentSlide].url}
                alt={carouselSlides[currentSlide].title}
                className="max-h-36 sm:max-h-64 w-auto object-contain transition-all duration-300 transform scale-100 group-hover:scale-105"
              />

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#C7912F] text-white w-9 h-9 rounded-full transition-colors flex items-center justify-center text-xs font-mono cursor-pointer border border-white/20"
                aria-label="Previous Slide"
              >
                ◀
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#C7912F] text-white w-9 h-9 rounded-full transition-colors flex items-center justify-center text-xs font-mono cursor-pointer border border-white/20"
                aria-label="Next Slide"
              >
                ▶
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
              <div className="space-y-1">
                <h4 className="text-base sm:text-xl font-bold text-white">
                  {carouselSlides[currentSlide].title}
                </h4>

                <p className="text-xs sm:text-sm text-[#B7C1D6]">
                  {carouselSlides[currentSlide].caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx
                        ? "w-8 bg-[#C7912F]"
                        : "w-2.5 bg-white/30"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[#F2F5F2] border-y border-[#DDE3DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
                  Live Dataset Mapping
                </span>

                <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
                  Dynamic Sector Correlation Matrix
                </h2>
              </div>

              <span className="text-xs font-mono text-[#1E7A5C] bg-[#1E7A5C]/10 border border-[#1E7A5C]/20 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E7A5C] animate-ping" />
                Live API Synchronized
              </span>
            </div>

            <div className="bg-white border border-[#DDE3DE] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse min-w-[600px]">

                  <thead>
                    <tr className="border-b border-[#DDE3DE] text-[#4A5568] uppercase bg-[#E9EFEA]">
                      <th className="p-3.5 sm:p-4">
                        Indicator Metric
                      </th>

                      <th className="p-3.5 sm:p-4">
                        Target Sector
                      </th>

                      <th className="p-3.5 sm:p-4">
                        Correlation
                      </th>

                      <th className="p-3.5 sm:p-4">
                        Status & Trend
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#DDE3DE]">
                    {tableLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-[#4A5568]"
                        >
                          <div className="inline-flex items-center gap-2 text-xs font-mono">
                            <span className="w-4 h-4 border-2 border-[#152238] border-t-transparent rounded-full animate-spin" />
                            Loading dynamic correlation datasets...
                          </div>
                        </td>
                      </tr>
                    ) : correlationTable.length > 0 ? (
                      correlationTable.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-[#F2F5F2]/60 transition-colors"
                        >
                          <td className="p-3.5 sm:p-4 font-semibold text-[#152238]">
                            {row.metric}
                          </td>

                          <td className="p-3.5 sm:p-4 text-[#4A5568]">
                            {row.targetSector}
                          </td>

                          <td className="p-3.5 sm:p-4 font-bold text-[#152238]">
                            {row.correlation}
                          </td>

                          <td className="p-3.5 sm:p-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                                row.trend === "Up"
                                  ? "bg-[#6FD3A5]/20 text-[#1E7A5C]"
                                  : "bg-[#F0A08C]/20 text-[#C0392B]"
                              }`}
                            >
                              {row.trend === "Up" ? "▲" : "▼"}{" "}
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-[#4A5568]"
                        >
                          No correlation datasets available at present.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        </section>

        <section className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                num: "01",
                title: "Quick Research",
                text:
                  "Quick glance through dozens of reports in a few clicks, saving time on endless search engine queries."
              },
              {
                num: "02",
                title: "Tagged Reports",
                text:
                  "Each report is tagged with searchable keywords making it simple to preempt what to expect inside."
              },
              {
                num: "03",
                title: "Support on Request",
                text:
                  "Drop us a line if you are looking for specialized report coverage on any specific sector or sub-sector."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-[#DDE3DE] space-y-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#152238] text-[#C7912F] flex items-center justify-center font-mono font-semibold">
                  {feature.num}
                </div>

                <h4 className="text-base sm:text-lg font-bold text-[#152238]">
                  {feature.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16 max-w-[820px] mx-auto px-4 sm:px-8">
          <div className="mb-6 sm:mb-8 text-center">
            <span className="font-mono text-xs tracking-widest uppercase text-[#C7912F] font-semibold">
              Knowledge Base
            </span>

            <h2 className="text-xl sm:text-3xl font-bold text-[#152238]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#DDE3DE] border-t border-b border-[#DDE3DE]">
            {faqSchema.mainEntity.map((faq, index) => (
              <div
                key={index}
                className="py-4 sm:py-5"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left text-sm sm:text-base font-semibold text-[#152238] hover:text-[#C7912F] transition-colors"
                >
                  <span>{faq.name}</span>

                  <span className="text-lg sm:text-xl font-mono text-[#C7912F] ml-4">
                    {expandedFAQs[index] ? "−" : "+"}
                  </span>
                </button>

                {expandedFAQs[index] && (
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#4A5568] leading-relaxed pr-6">
                    {faq.acceptedAnswer.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="pb-12 sm:pb-16 max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-r from-[#152238] to-[#223353] rounded-2xl p-6 sm:p-12 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">

            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                See the economy before it hits the ticker.
              </h3>

              <p className="text-xs sm:text-sm text-[#B7C1D6]">
                Sign up free to build watchlists across leading indicators and get alerted when real-world data shifts.
              </p>
            </div>

            <Link href="/Register">
              <button className="px-6 py-3 rounded-full bg-[#C7912F] text-[#231602] font-semibold text-xs sm:text-sm hover:shadow-lg transition-transform hover:-translate-y-0.5 shrink-0 cursor-pointer">
                Register with us →
              </button>
            </Link>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}