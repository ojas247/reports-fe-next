// pages/Company/[slug].js

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
import { fetchCompanyIndicators, fetchIndicatorTimeSeries } from '../api/Api';

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
    activeBg: 'bg-slate-800 border-slate-700 text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-slate-300',
    inactiveBg: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
  },
  rawMaterial: {
    activeBg: 'bg-slate-800 border-slate-700 text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-slate-300',
    inactiveBg: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
  },
  outputProduct: {
    activeBg: 'bg-slate-800 border-slate-700 text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-slate-300',
    inactiveBg: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
  },
  laggingIndicator: {
    activeBg: 'bg-slate-800 border-slate-700 text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-slate-300',
    inactiveBg: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
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

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const indicatorsResponse = await fetchCompanyIndicators(slug);
        const { company_name, companySymbol: sym, indicatorDetails, stockPrice: sp, marketCap: mc } = indicatorsResponse;

        setCompanyName(company_name || slug);
        setCompanySymbol(sym || slug);
        setStockPrice(sp || null);
        setMarketCap(mc || null);
        setIndicatorGroups(indicatorDetails || []);

        let defaultIndicator = null;
        let defaultGroup = indicatorDetails?.find(g => g.indicatorType === 'leadingIndicator');
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
          console.log('Default indicator set:', indicatorsResponse);
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
      const dataName = indicator.dataName || dataSet || dataItem;

      const tsData = await fetchIndicatorTimeSeries(dataName, dataItem, sector, subSector);

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
      setActiveIndicatorData(indicatorTimeSeries[indicator.dataItem]);
    } else {
      await fetchAndSetTimeSeries(indicator, group);
    }
  };

  const renderStage = (type, label) => {
    const groups = indicatorGroups.filter(g => g.indicatorType === type);
    const style = categoryStyles[type];
    const stepIndex = ['leadingIndicator', 'rawMaterial', 'outputProduct', 'laggingIndicator'].indexOf(type);

    if (groups.length === 0) {
      return (
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Stage {stepIndex + 1}
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {label}
            </h3>
          </div>
          <p className="text-xs text-slate-400">No indicators available.</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:shadow-md transition relative">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Stage {stepIndex + 1}
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {label}
            </h3>
          </div>
          {groups.map((group, idx) => (
            <div key={idx} className="mb-3 last:mb-0">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 truncate">
                {group.sector} <span className="text-slate-300">›</span> {group.subSector}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.indicators.map(ind => {
                  const isActive = activeIndicator?.dataItem === ind.dataItem;
                  // Use composite key to ensure uniqueness
                  const uniqueKey = `${group.sector}-${group.subSector}-${ind.dataItem}`;
                  return (
                    <button
                      key={uniqueKey}
                      onClick={() => handleIndicatorSelect(ind, group)}
                      className={`w-full text-left border rounded-xl px-3 py-2 transition-all duration-200 text-sm ${
                        isActive
                          ? `${style.activeBg} font-medium shadow-sm`
                          : `${style.inactiveBg} hover:border-slate-300`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold leading-tight truncate ${isActive ? style.activeText : 'text-slate-800'}`}>
                          {ind.dataItem}
                        </p>
                        {isActive && <span className="text-[10px] text-slate-300">✓</span>}
                      </div>
                      <p className={`text-[10px] leading-tight truncate mt-1 ${isActive ? style.activeSub : 'text-slate-500'}`}>
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
          <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-200 text-slate-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
            →
          </div>
        )}
      </div>
    );
  };

  const hasIndicatorData = activeIndicatorData && activeIndicatorData.length > 0;

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: activeIndicator ? activeIndicator.dataItem : 'Indicator',
        data: activeIndicatorData,
        borderColor: '#d97706',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2,
        fill: false,
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
          font: { family: 'Inter, sans-serif', size: 11 },
          usePointStyle: true,
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(203, 213, 225, 0.4)' },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: 'rgba(203, 213, 225, 0.4)' },
        ticks: { color: '#334155' }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-800 mx-auto mb-4"></div>
          <p className="text-xs text-slate-500 font-mono">LOADING COMPANY DATA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-rose-200/80 rounded-xl p-6 max-w-md shadow-2xs">
          <h2 className="text-base font-semibold text-rose-600 mb-2">Error</h2>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{companyName}</h1>
              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {companySymbol}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Sector: Oil & Gas Exploration</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              <span>Macro Alignment Engine</span>
            </p>
          </div>
          <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Stock Price</p>
              <p className="text-xl font-bold text-emerald-600">
                {stockPrice ? `₹${stockPrice}` : '--'}
                <span className="text-xs font-semibold text-emerald-500 ml-1">(+1.8%)</span>
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Market Cap</p>
              <p className="text-lg font-bold text-slate-800">
                {marketCap ? `₹${marketCap} Cr` : '--'}
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold tracking-wider text-slate-600 uppercase">
              Fundamental Macro Flow Chain
            </h2>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
              Click any indicator to overlay on chart
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {renderStage('leadingIndicator', 'Leading Signals')}
            {renderStage('rawMaterial', 'Raw Materials (Costs)')}
            {renderStage('outputProduct', 'Output (Revenue)')}
            {renderStage('laggingIndicator', 'Lagging (Financials)')}
          </div>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Macro Overlay & Correlation Analysis</h2>
              <p className="text-xs text-slate-500">
                <span className="text-amber-600 font-semibold underline underline-offset-2 decoration-amber-400/50">
                  {activeIndicator ? activeIndicator.dataItem : 'Select an indicator'}
                </span>
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Correlation: <strong className="text-emerald-600 font-bold">r = 0.86</strong></span>
            </div>
          </div>
          <div className="relative h-72 w-full">
            {hasIndicatorData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No time series data available for this indicator.
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Associated Macro Signals Summary</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200/80">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Indicator</th>
                  <th className="p-3">Category Stage</th>
                  <th className="p-3">Latest Value</th>
                  <th className="p-3">Impact Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {indicatorGroups.flatMap(group =>
                  group.indicators.map(ind => {
                    const series = indicatorTimeSeries[ind.dataItem] || [];
                    const latest = series.length > 0 ? series[series.length - 1] : '--';
                    const stageMap = {
                      leadingIndicator: { label: 'Leading', color: 'blue' },
                      rawMaterial: { label: 'Raw Material', color: 'amber' },
                      outputProduct: { label: 'Output Product', color: 'emerald' },
                      laggingIndicator: { label: 'Lagging', color: 'purple' }
                    };
                    const stage = stageMap[group.indicatorType] || { label: 'Unknown', color: 'slate' };
                    // Use composite key for table row as well
                    const rowKey = `${group.sector}-${group.subSector}-${ind.dataItem}`;
                    return (
                      <tr key={rowKey} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-medium text-slate-800">{ind.dataItem}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-${stage.color}-50 text-${stage.color}-700 border border-${stage.color}-200/60`}>
                            {stage.label}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-xs">{String(latest)}</td>
                        <td className="p-3 text-emerald-600 font-medium">Bullish</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}