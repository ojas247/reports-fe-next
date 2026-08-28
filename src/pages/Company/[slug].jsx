'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import NavBar from '../../components/Functionalities/NavBar';
import Footer from '../../components/Website/Footer';
import {
  fetchCompanyIndicators,
  fetchIndicatorTimeSeries,
  fetchDataFromGetApi
} from '../api/Api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const categoryStyles = {
  leadingIndicator: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700'
  },
  rawMaterial: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700'
  },
  outputProduct: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700'
  },
  laggingIndicator: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700'
  }
};

export default function CompanyDashboard() {
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [companyName, setCompanyName] = useState('');
  const [companySymbol, setCompanySymbol] = useState('');
  const [stockPrice, setStockPrice] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [indicatorGroups, setIndicatorGroups] = useState([]);

  const [activeIndicator, setActiveIndicator] = useState(null);
  const [activeIndicatorData, setActiveIndicatorData] = useState([]);

  const [chartLabels, setChartLabels] = useState([]);
  const [indicatorTimeSeries, setIndicatorTimeSeries] = useState({});

  const [tickertapeData, setTickertapeData] = useState([]);
  const [tickertapeLoading, setTickertapeLoading] = useState(true);

  useEffect(() => {
    const getTickertapeData = async () => {
      setTickertapeLoading(true);

      try {
        const response = await fetchDataFromGetApi('tickertape');

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
              'Market Indicator',
            val:
              value !== null && value !== undefined
                ? String(value)
                : null,
            chg: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}%`,
            type: change >= 0 ? 'up' : 'down'
          };
        });

        setTickertapeData(formattedData);
      } catch (err) {
        console.error('Error fetching Tickertape data:', err);
        setTickertapeData([]);
      } finally {
        setTickertapeLoading(false);
      }
    };

    getTickertapeData();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const indicatorsResponse = await fetchCompanyIndicators(slug);

        const {
          company_name,
          companySymbol: sym,
          indicatorDetails,
          stockPrice: sp,
          marketCap: mc
        } = indicatorsResponse;

        setCompanyName(company_name || slug);
        setCompanySymbol(sym || slug);
        setStockPrice(sp || null);
        setMarketCap(mc || null);
        setIndicatorGroups(indicatorDetails || []);

        let defaultIndicator = null;
        let defaultGroup = indicatorDetails?.find(
          g => g.indicatorType === 'leadingIndicator'
        );

        if (defaultGroup && defaultGroup.indicators?.length > 0) {
          defaultIndicator = defaultGroup.indicators[0];
        } else {
          for (const group of indicatorDetails || []) {
            if (group.indicators?.length > 0) {
              defaultIndicator = group.indicators[0];
              defaultGroup = group;
              break;
            }
          }
        }

        if (defaultIndicator) {
          await fetchAndSetTimeSeries(defaultIndicator, defaultGroup);
          setActiveIndicator(defaultIndicator);
        } else {
          setError('No indicators available for this company.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load company data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const fetchAndSetTimeSeries = async (indicator, group) => {
    try {
      const { dataItem, dataSet } = indicator;
      const { sector, subSector } = group;

      const dataName =
        indicator.dataName ||
        dataSet ||
        dataItem;

      const tsData = await fetchIndicatorTimeSeries(
        dataName,
        dataItem,
        sector,
        subSector
      );

      const labels = tsData?.x || [];
      const values = tsData?.y || [];

      setChartLabels(labels);

      setIndicatorTimeSeries(prev => ({
        ...prev,
        [indicator.dataItem]: values
      }));

      setActiveIndicatorData(values);
    } catch (err) {
      console.error('Time series fetch error:', err);
      setError('Failed to load time series data.');
    }
  };

  const handleIndicatorSelect = async (indicator, group) => {
    if (activeIndicator?.dataItem === indicator.dataItem) return;

    setActiveIndicator(indicator);

    if (indicatorTimeSeries[indicator.dataItem]) {
      setActiveIndicatorData(
        indicatorTimeSeries[indicator.dataItem]
      );
    } else {
      await fetchAndSetTimeSeries(indicator, group);
    }
  };

  const renderStage = (type, label) => {
    const groups = indicatorGroups.filter(
      g => g.indicatorType === type
    );

    const style = categoryStyles[type];

    const stepIndex = [
      'leadingIndicator',
      'rawMaterial',
      'outputProduct',
      'laggingIndicator'
    ].indexOf(type);

    if (groups.length === 0) {
      return (
        <div className="bg-white border border-[#DDE3DE] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-[#DDE3DE] pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F2F5F2] text-slate-600 px-2 py-0.5 rounded">
              Stage {stepIndex + 1}
            </span>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {label}
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            No indicators available.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-[#DDE3DE] rounded-xl p-4 shadow-sm hover:shadow-md transition relative">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-[#DDE3DE] pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#F2F5F2] text-slate-600 px-2 py-0.5 rounded">
              Stage {stepIndex + 1}
            </span>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {label}
            </h3>
          </div>

          {groups.map((group, idx) => (
            <div
              key={idx}
              className="mb-3 last:mb-0"
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 truncate">
                {group.sector}
                <span className="text-slate-300"> › </span>
                {group.subSector}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {group.indicators.map(ind => {
                  const isActive =
                    activeIndicator?.dataItem === ind.dataItem;

                  const uniqueKey =
                    `${group.sector}-${group.subSector}-${ind.dataItem}`;

                  return (
                    <button
                      key={uniqueKey}
                      onClick={() =>
                        handleIndicatorSelect(ind, group)
                      }
                      className={`w-full text-left border rounded-xl px-3 py-2 transition-all duration-200 text-sm ${
                        isActive
                          ? `${style.activeBg} font-medium shadow-sm`
                          : `${style.inactiveBg} hover:border-slate-300`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-semibold leading-tight truncate ${
                            isActive
                              ? style.activeText
                              : 'text-slate-800'
                          }`}
                        >
                          {ind.dataItem}
                        </p>

                        {isActive && (
                          <span className="text-[10px] text-[#B7C1D6]">
                            ✓
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[10px] leading-tight truncate mt-1 ${
                          isActive
                            ? style.activeSub
                            : 'text-slate-500'
                        }`}
                      >
                        {ind.dataSet}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {type !== 'laggingIndicator' && (
          <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#DDE3DE] text-slate-400 rounded-full w-5 h-5 items-center justify-center text-xs font-bold shadow-sm">
            →
          </div>
        )}
      </div>
    );
  };

  const hasIndicatorData =
    activeIndicatorData &&
    activeIndicatorData.length > 0 &&
    activeIndicatorData.some(
      v => v !== null && v !== undefined
    );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: activeIndicator
          ? activeIndicator.dataItem
          : 'Indicator',
        data: activeIndicatorData,
        borderColor: '#C7912F',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(203, 213, 225, 0.4)'
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: 'rgba(203, 213, 225, 0.4)'
        },
        ticks: {
          color: '#334155'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F5F2] flex flex-col">
        <div className="bg-[#152238] h-9" />

        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE3DE]">
          <NavBar />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-[#152238] mx-auto mb-4" />

            <p className="text-xs text-slate-500 font-mono">
              LOADING COMPANY DATA...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F5F2] flex flex-col">
        <div className="bg-[#152238] h-9" />

        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE3DE]">
          <NavBar />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-rose-200/80 rounded-xl p-6 max-w-md shadow-sm">
            <h2 className="text-base font-semibold text-rose-600 mb-2">
              Error
            </h2>

            <p className="text-sm text-slate-600">
              {error}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5F2] text-[#0F1A2B] font-sans antialiased">

      <Head>
        <title>
          {companyName
            ? `${companyName} — Macro Indicators`
            : 'Company Macro Dashboard'}
        </title>

        <meta
          name="description"
          content={
            companyName
              ? `${companyName} macro indicators, leading signals, raw materials, output products and financial indicators.`
              : 'Company macro indicator dashboard and correlation analysis.'
          }
        />
      </Head>

      <div className="bg-[#152238] text-white overflow-hidden whitespace-nowrap border-b border-white/10 select-none">
        <div className="flex w-max animate-scroll-left py-2.5 font-mono text-[11px] sm:text-[12px]">
          {tickertapeLoading ? (
            <div className="flex gap-8 items-center px-4">
              <span className="text-slate-400">
                Loading market indicators...
              </span>
            </div>
          ) : tickertapeData.length > 0 ? (
            [1, 2, 3].map(repeatGroup => (
              <div
                key={repeatGroup}
                className="flex gap-6 sm:gap-8 items-center px-4"
              >
                {tickertapeData.map(item => (
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
                        item.type === 'down'
                          ? 'text-[#F0A08C]'
                          : 'text-[#6FD3A5]'
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">

          <header className="bg-white border border-[#DDE3DE] rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[#152238] tracking-tight">
                  {companyName}
                </h1>

                <span className="bg-[#F2F5F2] border border-[#DDE3DE] text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                  {companySymbol}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>
                  Sector: Oil & Gas Exploration
                </span>

                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />

                <span>
                  Macro Alignment Engine
                </span>
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">

              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Stock Price
                </p>

                <p className="text-xl font-bold text-emerald-600">
                  {stockPrice
                    ? `₹${stockPrice}`
                    : '--'}

                  <span className="text-xs font-semibold text-emerald-500 ml-1">
                    (+1.8%)
                  </span>
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Market Cap
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {marketCap
                    ? `₹${marketCap} Cr`
                    : '--'}
                </p>
              </div>
            </div>
          </header>

          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 px-1">
              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#C7912F] font-semibold">
                  Macro Flow
                </span>

                <h2 className="text-sm font-bold tracking-wider text-[#152238] uppercase">
                  Fundamental Macro Flow Chain
                </h2>
              </div>

              <span className="text-[10px] text-slate-500 bg-white px-2.5 py-1 rounded-full border border-[#DDE3DE]">
                Click any indicator to overlay on chart
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {renderStage(
                'leadingIndicator',
                'Leading Signals'
              )}

              {renderStage(
                'rawMaterial',
                'Raw Materials (Costs)'
              )}

              {renderStage(
                'outputProduct',
                'Output (Revenue)'
              )}

              {renderStage(
                'laggingIndicator',
                'Lagging (Financials)'
              )}
            </div>
          </section>

          <section className="bg-white border border-[#DDE3DE] rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#C7912F] font-semibold">
                  Analytics
                </span>

                <h2 className="text-base font-bold text-[#152238] tracking-tight">
                  Macro Overlay & Correlation Analysis
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  <span className="text-[#C7912F] font-semibold underline underline-offset-2 decoration-[#C7912F]/40">
                    {activeIndicator
                      ? activeIndicator.dataItem
                      : 'Select an indicator'}
                  </span>
                </p>
              </div>

              <div className="bg-[#F2F5F2] border border-[#DDE3DE] px-3 py-1.5 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span>
                  Correlation:{' '}
                  <strong className="text-emerald-600 font-bold">
                    r = 0.86
                  </strong>
                </span>
              </div>
            </div>

            <div className="relative h-72 w-full">
              {hasIndicatorData ? (
                <Line
                  data={chartData}
                  options={chartOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No time series data available for this indicator.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-[#DDE3DE] rounded-xl p-5 shadow-sm space-y-4">

            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#C7912F] font-semibold">
                Signal Summary
              </span>

              <h2 className="text-base font-bold text-[#152238] tracking-tight">
                Associated Macro Signals Summary
              </h2>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#DDE3DE]">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-[#F2F5F2] text-slate-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="p-3">
                      Indicator
                    </th>

                    <th className="p-3">
                      Category Stage
                    </th>

                    <th className="p-3">
                      Latest Value
                    </th>

                    <th className="p-3">
                      Impact Signal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {indicatorGroups.flatMap(group =>
                    group.indicators.map(ind => {
                      const series =
                        indicatorTimeSeries[ind.dataItem] || [];

                      const latest =
                        series.length > 0
                          ? series[series.length - 1]
                          : '--';

                      const stageMap = {
                        leadingIndicator: {
                          label: 'Leading',
                          classes:
                            'bg-blue-50 text-blue-700 border-blue-200/60'
                        },
                        rawMaterial: {
                          label: 'Raw Material',
                          classes:
                            'bg-amber-50 text-amber-700 border-amber-200/60'
                        },
                        outputProduct: {
                          label: 'Output Product',
                          classes:
                            'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        },
                        laggingIndicator: {
                          label: 'Lagging',
                          classes:
                            'bg-purple-50 text-purple-700 border-purple-200/60'
                        }
                      };

                      const stage =
                        stageMap[group.indicatorType] || {
                          label: 'Unknown',
                          classes:
                            'bg-slate-50 text-slate-700 border-slate-200'
                        };

                      const rowKey =
                        `${group.sector}-${group.subSector}-${ind.dataItem}`;

                      return (
                        <tr
                          key={rowKey}
                          className="hover:bg-[#F2F5F2]/70 transition-colors"
                        >
                          <td className="p-3 font-medium text-slate-800">
                            {ind.dataItem}
                          </td>

                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${stage.classes}`}
                            >
                              {stage.label}
                            </span>
                          </td>

                          <td className="p-3 font-mono text-xs">
                            {String(latest)}
                          </td>

                          <td className="p-3 text-emerald-600 font-medium">
                            Bullish
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-[#152238] rounded-2xl p-5 sm:p-7 text-white shadow-xl border border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

              <div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#C7912F] font-semibold">
                  Macro Intelligence
                </span>

                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Track how the economy flows into {companyName}
                </h2>

                <p className="text-xs sm:text-sm text-[#B7C1D6] mt-2 max-w-2xl leading-relaxed">
                  Analyze leading indicators, input costs, output products
                  and lagging financial signals through one connected
                  macroeconomic flow.
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] text-[#6FD3A5] uppercase tracking-wider bg-[#6FD3A5]/10 px-3 py-1.5 rounded-full border border-[#6FD3A5]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FD3A5] animate-pulse" />
                  Live API
                </span>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />

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
    </div>
  );
}