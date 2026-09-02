'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  TrendingUp,
  Boxes,
  PackageOpen,
  Activity,
} from 'lucide-react';
import NavBar from '../../components/Functionalities/NavBar';
import Footer from '../../components/Website/Footer';

import {
  fetchCompanyIndicators,
  fetchIndicatorTimeSeries,
  fetchIndicatorStockChart,
  fetchLTP,
  fetchStockHistory,
  fetchDataFromGetApi,
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
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700',
  },
  rawMaterial: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700',
  },
  outputProduct: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700',
  },
  laggingIndicator: {
    activeBg: 'bg-[#152238] border-[#152238] text-white shadow-slate-200/50',
    activeText: 'text-white',
    activeSub: 'text-[#B7C1D6]',
    inactiveBg: 'bg-white border-[#DDE3DE] hover:bg-[#F2F5F2] text-slate-700',
  },
};

const unwrapApiData = (response) => {
  let current = response;
  for (let i = 0; i < 8; i += 1) {
    if (
      current &&
      !Array.isArray(current) &&
      typeof current === 'object' &&
      current.data !== undefined
    ) {
      current = current.data;
    } else {
      break;
    }
  }
  return current;
};

const normalizeDateKey = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value).trim();
  if (!text) return '';
  if (/^\d{4}-\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toISOString().slice(0, 10);
};

const extractDate = (item) => {
  if (!item || typeof item !== 'object') return null;
  return (
    item.date ??
    item.Date ??
    item.datetime ??
    item.dateTime ??
    item.time ??
    item.timestamp ??
    item.period ??
    item.month ??
    item.yearMonth ??
    item.x ??
    item.label ??
    null
  );
};

const extractIndicatorValue = (item) => {
  if (!item || typeof item !== 'object') return null;
  const candidates = [
    item.indicatorValue,
    item.indicator_value,
    item.indicator,
    item.value,
    item.val,
    item.y,
    item.dataValue,
    item.data_value,
    item.amount,
    item.count,
  ];
  for (const c of candidates) {
    if (c !== null && c !== undefined && c !== '' && Number.isFinite(Number(c))) {
      return Number(c);
    }
  }
  return null;
};

const extractStockValue = (item) => {
  if (!item || typeof item !== 'object') return null;
  const candidates = [
    item.stockPrice,
    item.stock_price,
    item.sharePrice,
    item.share_price,
    item.close,
    item.Close,
    item.ltp,
    item.LTP,
    item.price,
    item.currentPrice,
    item.current_price,
    item.y,
  ];
  for (const c of candidates) {
    if (c !== null && c !== undefined && c !== '' && Number.isFinite(Number(c))) {
      return Number(c);
    }
  }
  return null;
};

const findArrayByKeys = (object, keys) => {
  if (!object || typeof object !== 'object') return null;
  for (const key of keys) {
    if (Array.isArray(object[key])) return object[key];
  }
  return null;
};

const parseSimpleSeries = (value, valueType = 'indicator') => {
  if (!value) return { labels: [], values: [] };
  if (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    Array.isArray(value.x) &&
    Array.isArray(value.y)
  ) {
    return {
      labels: value.x,
      values: value.y.map((v) => (Number.isFinite(Number(v)) ? Number(v) : null)),
    };
  }
  if (
    !Array.isArray(value) &&
    typeof value === 'object' &&
    Array.isArray(value.labels) &&
    Array.isArray(value.values)
  ) {
    return {
      labels: value.labels,
      values: value.values.map((v) => (Number.isFinite(Number(v)) ? Number(v) : null)),
    };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return { labels: [], values: [] };
    if (Array.isArray(value[0])) {
      const labels = [];
      const values = [];
      value.forEach((item) => {
        if (item.length < 2) return;
        const label = item[0];
        const num = Number(item[1]);
        if (label !== null && label !== undefined && Number.isFinite(num)) {
          labels.push(label);
          values.push(num);
        }
      });
      return { labels, values };
    }
    if (typeof value[0] === 'object') {
      const labels = [];
      const values = [];
      value.forEach((item) => {
        const label = extractDate(item);
        const num =
          valueType === 'stock'
            ? extractStockValue(item)
            : extractIndicatorValue(item);
        if (label !== null && label !== undefined && num !== null && Number.isFinite(num)) {
          labels.push(label);
          values.push(num);
        }
      });
      return { labels, values };
    }
  }
  return { labels: [], values: [] };
};

const findSeriesObject = (source, type) => {
  if (!source || typeof source !== 'object') return null;
  const indicatorKeys = [
    'indicator',
    'indicatorSeries',
    'indicatorData',
    'indicatorTS',
    'indicatorTimeSeries',
    'macro',
    'macroSeries',
    'macroData',
    'series',
  ];
  const stockKeys = [
    'stock',
    'stockSeries',
    'stockData',
    'sharePrice',
    'sharePriceSeries',
    'price',
    'priceSeries',
    'stockPrice',
  ];
  const keys = type === 'stock' ? stockKeys : indicatorKeys;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return null;
};

const parseCombinedChartResponse = (response) => {
  const source = unwrapApiData(response);
  const result = {
    labels: [],
    indicatorValues: [],
    stockValues: [],
    correlation: null,
  };

  if (!source) return result;

  const corrCandidates = [
    source?.correlation,
    source?.correlationCoefficient,
    source?.pearsonCorrelation,
    source?.pearson,
    source?.r,
  ];
  for (const c of corrCandidates) {
    const num = Number(c);
    if (Number.isFinite(num)) {
      result.correlation = num;
      break;
    }
  }

  let labels = [];
  let indicatorValues = [];
  let stockValues = [];

  if (Array.isArray(source.labels)) {
    labels = source.labels;
  } else if (Array.isArray(source.x)) {
    labels = source.x;
  } else if (Array.isArray(source.dates)) {
    labels = source.dates;
  } else if (Array.isArray(source.date)) {
    labels = source.date;
  }

  if (source.datasets && typeof source.datasets === 'object') {
    const ds = source.datasets;
    if (ds.indicator && Array.isArray(ds.indicator.data)) {
      indicatorValues = ds.indicator.data.map((v) =>
        Number.isFinite(Number(v)) ? Number(v) : null
      );
    }
    if (ds.stockPrice && Array.isArray(ds.stockPrice.data)) {
      stockValues = ds.stockPrice.data.map((v) =>
        Number.isFinite(Number(v)) ? Number(v) : null
      );
    }
    if (stockValues.length === 0 && ds.stock && Array.isArray(ds.stock.data)) {
      stockValues = ds.stock.data.map((v) =>
        Number.isFinite(Number(v)) ? Number(v) : null
      );
    }
  }

  if (indicatorValues.length === 0) {
    const indCandidates = [
      source.y,
      source.indicatorData,
      source.indicatorValues,
      source.values,
      source.data,
    ];
    for (const cand of indCandidates) {
      if (Array.isArray(cand)) {
        indicatorValues = cand.map((v) =>
          Number.isFinite(Number(v)) ? Number(v) : null
        );
        break;
      }
    }
  }

  if (stockValues.length === 0) {
    const stockCandidates = [
      source.stockData,
      source.stockValues,
      source.sharePrice,
      source.sharePrices,
      source.stockPrice,
      source.price,
      source.close,
      source.ltp,
      source.LTP,
      source.currentPrice,
      source.current_price,
    ];
    for (const cand of stockCandidates) {
      if (Array.isArray(cand)) {
        stockValues = cand.map((v) =>
          Number.isFinite(Number(v)) ? Number(v) : null
        );
        break;
      }
    }
  }

  if (stockValues.length === 0) {
    const stockSeries = findSeriesObject(source, 'stock');
    if (stockSeries) {
      const parsed = parseSimpleSeries(stockSeries, 'stock');
      stockValues = parsed.values;
      if (labels.length === 0) labels = parsed.labels;
    }
  }

  if (labels.length === 0 && indicatorValues.length > 0) {
    labels = indicatorValues.map((_, i) => `Point ${i + 1}`);
  }

  const maxLen = Math.max(labels.length, indicatorValues.length, stockValues.length);
  while (labels.length < maxLen) labels.push(`Point ${labels.length + 1}`);
  while (indicatorValues.length < maxLen) indicatorValues.push(null);
  while (stockValues.length < maxLen) stockValues.push(null);

  result.labels = labels;
  result.indicatorValues = indicatorValues;
  result.stockValues = stockValues;

  if (result.correlation === null && indicatorValues.length > 1 && stockValues.length > 1) {
    result.correlation = calculateCorrelation(indicatorValues, stockValues);
  }

  return result;
};

const calculateCorrelation = (indicatorValues, stockValues) => {
  const pairs = [];
  const len = Math.min(indicatorValues.length, stockValues.length);
  for (let i = 0; i < len; i += 1) {
    const x = Number(indicatorValues[i]);
    const y = Number(stockValues[i]);
    if (Number.isFinite(x) && Number.isFinite(y)) pairs.push([x, y]);
  }
  if (pairs.length < 2) return null;
  const xVals = pairs.map((p) => p[0]);
  const yVals = pairs.map((p) => p[1]);
  const xMean = xVals.reduce((s, v) => s + v, 0) / xVals.length;
  const yMean = yVals.reduce((s, v) => s + v, 0) / yVals.length;
  let numerator = 0;
  let xVar = 0;
  let yVar = 0;
  for (let i = 0; i < pairs.length; i += 1) {
    const xd = xVals[i] - xMean;
    const yd = yVals[i] - yMean;
    numerator += xd * yd;
    xVar += xd * xd;
    yVar += yd * yd;
  }
  if (xVar === 0 || yVar === 0) return null;
  return numerator / Math.sqrt(xVar * yVar);
};

const getLatestNumericValue = (values) => {
  for (let i = values.length - 1; i >= 0; i -= 1) {
    const v = Number(values[i]);
    if (Number.isFinite(v)) return v;
  }
  return null;
};

const formatNumber = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const formatCorrelation = (value) => {
  if (!Number.isFinite(Number(value))) return '--';
  return Number(value).toFixed(2);
};

const getChangePercentage = (values) => {
  const numeric = values.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  if (numeric.length < 2) return null;
  const prev = numeric[numeric.length - 2];
  const latest = numeric[numeric.length - 1];
  if (prev === 0) return null;
  return ((latest - prev) / prev) * 100;
};

const formatChartDate = (value) => {
  if (!value) return '';
  const text = String(value);
  if (/^\d{4}-\d{2}$/.test(text)) {
    const d = new Date(`${text}-01T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    }
  }
  const d = new Date(text);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  }
  return text;
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
  const [stockChange, setStockChange] = useState(null);

  const [indicatorGroups, setIndicatorGroups] = useState([]);
  const [activeIndicator, setActiveIndicator] = useState(null);

  const [chartLabels, setChartLabels] = useState([]);
  const [activeIndicatorData, setActiveIndicatorData] = useState([]);
  const [stockPriceData, setStockPriceData] = useState([]);

  const [indicatorTimeSeries, setIndicatorTimeSeries] = useState({});
  const [correlation, setCorrelation] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  const [tickertapeData, setTickertapeData] = useState([]);
  const [tickertapeLoading, setTickertapeLoading] = useState(true);

  const [isZoomLoaded, setIsZoomLoaded] = useState(false);

  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((mod) => {
        ChartJS.register(mod.default);
        setIsZoomLoaded(true);
      });
    }
  }, []);

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
        const formatted = data.map((item, index) => {
          const change = Number(
            item.perChange ??
            item.percentChange ??
            item.changePercent ??
            item.percentageChange ??
            0,
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
            name: item.displayName ?? item.item ?? item.name ?? 'Market Indicator',
            val: value !== null && value !== undefined ? String(value) : null,
            chg: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}%`,
            type: change >= 0 ? 'up' : 'down',
          };
        });
        setTickertapeData(formatted);
      } catch (err) {
        console.error('Tickertape error:', err);
        setTickertapeData([]);
      } finally {
        setTickertapeLoading(false);
      }
    };
    getTickertapeData();
  }, []);

  const fetchLtpData = async (symbol) => {
    try {
      const response = await fetchLTP(symbol);
      if (!response) return;
      const price = response.sharePrice ?? response.ltp ?? response.LTP ?? response.price ?? null;
      const cap = response.marketCap ?? response.market_cap ?? response.marketCapitalisation ?? response.marketCapitalization ?? null;
      const change = response.percentChange ?? response.percent_change ?? response.changePercent ?? null;
      if (price !== null && price !== undefined && price !== '') setStockPrice(Number(price));
      if (cap !== null && cap !== undefined && cap !== '') setMarketCap(cap);
      if (change !== null && change !== undefined && change !== '') setStockChange(Number(change));
    } catch (err) {
      console.error('LTP fetch error:', err);
    }
  };

  const fetchChartData = async (indicator, group, symbol) => {
    if (!indicator || !group || !symbol) return;
    setChartLoading(true);
    setError(null);

    try {
      const dataName = indicator.dataName || indicator.dataSet || indicator.dataItem;
      const request = {
        dataName,
        dataItem: indicator.dataItem,
        sector: group.sector,
        subSector: group.subSector,
        company: symbol,
      };

      const chartResponse = await fetchIndicatorStockChart(request);
      let combined = parseCombinedChartResponse(chartResponse);

      let labels = combined.labels || [];
      let indicatorValues = combined.indicatorValues || [];
      let stockValues = combined.stockValues || [];

      if (labels.length === 0 || indicatorValues.length === 0) {
        const tsResponse = await fetchIndicatorTimeSeries({
          dataName,
          dataItem: indicator.dataItem,
          sector: group.sector,
          subSector: group.subSector,
        });
        const tsParsed = parseCombinedChartResponse(tsResponse);
        if (labels.length === 0) labels = tsParsed.labels || [];
        if (indicatorValues.length === 0) indicatorValues = tsParsed.indicatorValues || [];
        if (combined.correlation === null) combined.correlation = tsParsed.correlation;
      }

      if (stockValues.length === 0 || stockValues.every((v) => v === null || v === 0)) {
        try {
          const stockHistory = await fetchStockHistory(symbol, 5);
          const historyData = unwrapApiData(stockHistory);
          let historyLabels = [];
          let historyValues = [];
          if (Array.isArray(historyData)) {
            historyData.forEach((item) => {
              const date = extractDate(item);
              const val = extractStockValue(item);
              if (date && val !== null && Number.isFinite(Number(val))) {
                historyLabels.push(normalizeDateKey(date));
                historyValues.push(Number(val));
              }
            });
          } else if (historyData && typeof historyData === 'object') {
            const hLabels = historyData.date ?? historyData.dates ?? historyData.x ?? historyData.labels;
            const hVals = historyData.close ?? historyData.price ?? historyData.stockPrice ?? historyData.sharePrice ?? historyData.values;
            if (Array.isArray(hLabels) && Array.isArray(hVals)) {
              historyLabels = hLabels.map(normalizeDateKey);
              historyValues = hVals.map((v) => Number.isFinite(Number(v)) ? Number(v) : null);
            }
          }
          if (historyLabels.length > 0 && historyValues.length > 0) {
            const stockMap = new Map();
            historyLabels.forEach((k, i) => {
              if (k && Number.isFinite(Number(historyValues[i]))) {
                stockMap.set(k, Number(historyValues[i]));
              }
            });
            stockValues = labels.map((l) => {
              const key = normalizeDateKey(l);
              return stockMap.has(key) ? stockMap.get(key) : null;
            });
          }
        } catch (err) {
          console.warn('Stock history fallback failed:', err);
        }
      }

      const indicatorMap = new Map();
      const stockMap = new Map();
      labels.forEach((label, idx) => {
        const key = normalizeDateKey(label);
        if (!key) return;
        const iv = Number(indicatorValues[idx]);
        if (Number.isFinite(iv)) indicatorMap.set(key, iv);
        const sv = Number(stockValues[idx]);
        if (Number.isFinite(sv)) stockMap.set(key, sv);
      });

      const allKeys = Array.from(new Set([...indicatorMap.keys(), ...stockMap.keys()])).sort();
      const cleanedLabels = allKeys;
      const cleanedIndicator = allKeys.map((k) => (indicatorMap.has(k) ? indicatorMap.get(k) : null));
      const cleanedStock = allKeys.map((k) => (stockMap.has(k) ? stockMap.get(k) : null));

      let finalCorrelation = combined.correlation;
      if (finalCorrelation === null || finalCorrelation === undefined) {
        finalCorrelation = calculateCorrelation(cleanedIndicator, cleanedStock);
      }

      setChartLabels(cleanedLabels);
      setActiveIndicatorData(cleanedIndicator);
      setStockPriceData(cleanedStock);
      setCorrelation(finalCorrelation);

      const cacheKey = `${group.sector}|${group.subSector}|${dataName}|${indicator.dataItem}`;
      setIndicatorTimeSeries((prev) => ({
        ...prev,
        [cacheKey]: cleanedIndicator,
      }));

      const latestStock = getLatestNumericValue(cleanedStock);
      if (latestStock !== null) setStockPrice(latestStock);

      const change = getChangePercentage(cleanedStock);
      if (change !== null) setStockChange(change);
    } catch (err) {
      console.error('Indicator stock chart error:', err);
      setChartLabels([]);
      setActiveIndicatorData([]);
      setStockPriceData([]);
      setCorrelation(null);
      setError('Failed to load chart data.');
    } finally {
      setChartLoading(false);
    }
  };

  const handleIndicatorSelect = async (indicator, group) => {
    if (!indicator || !group) return;
    setActiveIndicator(indicator);
    await fetchChartData(indicator, group, companySymbol || slug);
  };

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
          marketCap: mc,
          market_cap,
          marketCapitalisation,
          marketCapitalization,
          marketCapValue,
        } = indicatorsResponse;

        const resolvedSymbol = sym || slug;
        const resolvedMarketCap =
          mc ?? market_cap ?? marketCapitalisation ?? marketCapitalization ?? marketCapValue ?? null;

        setCompanyName(company_name || slug);
        setCompanySymbol(resolvedSymbol);
        if (sp !== undefined && sp !== null && sp !== '') setStockPrice(Number(sp));
        if (resolvedMarketCap !== null) setMarketCap(resolvedMarketCap);

        const groups = Array.isArray(indicatorDetails) ? indicatorDetails : [];
        setIndicatorGroups(groups);

        await fetchLtpData(resolvedSymbol);

        let defaultIndicator = null;
        let defaultGroup = null;

        const leadingGroup = groups.find(
          (g) => g.indicatorType === 'leadingIndicator' && Array.isArray(g.indicators) && g.indicators.length > 0,
        );
        if (leadingGroup) {
          defaultGroup = leadingGroup;
          defaultIndicator = leadingGroup.indicators[0];
        } else {
          for (const g of groups) {
            if (Array.isArray(g.indicators) && g.indicators.length > 0) {
              defaultGroup = g;
              defaultIndicator = g.indicators[0];
              break;
            }
          }
        }

        if (defaultIndicator && defaultGroup) {
          setActiveIndicator(defaultIndicator);
          await fetchChartData(defaultIndicator, defaultGroup, resolvedSymbol);
        } else {
          setError('No indicators available for this company.');
        }
      } catch (err) {
        console.error('Company dashboard error:', err);
        setError(err.message || 'Failed to load company data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);
const stageConfig = {
  leadingIndicator: {
    label: 'Leading Signals',
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  rawMaterial: {
    label: 'Input Resources',
    icon: Boxes,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  outputProduct: {
    label: 'Output Resources',
    icon: PackageOpen,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  laggingIndicator: {
    label: 'Lagging Signals',
    icon: Activity,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
};
 const renderStage = (type) => {
  const groups = indicatorGroups.filter(
    (g) => g.indicatorType === type
  );

  const style = categoryStyles[type];
  const config = stageConfig[type];

  if (!config) return null;

  const Icon = config.icon;

  if (groups.length === 0) {
    return (
      <div className="bg-white border border-[#DDE3DE] rounded-xl p-4 shadow-sm">
        {/* Prominent Stage Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#DDE3DE]">
          <div
            className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon
              size={18}
              strokeWidth={2}
              className={config.iconColor}
            />
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-tight text-[#152238]">
              {config.label}
            </h3>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              Macro Flow Stage
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          No indicators available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DDE3DE] rounded-xl p-4 shadow-sm hover:shadow-md transition relative">
      
      {/* Prominent Stage Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#DDE3DE]">
        <div
          className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon
            size={19}
            strokeWidth={2.2}
            className={config.iconColor}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-[#152238]">
            {config.label}
          </h3>

          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            Macro Flow Stage
          </p>
        </div>
      </div>

      {groups.map((group, groupIndex) => (
        <div
          key={`${type}-${group.sector || 'sector'}-${group.subSector || 'subsector'}-${groupIndex}`}
          className="mb-3 last:mb-0"
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 truncate">
            {group.sector}
            <span className="text-slate-300"> › </span>
            {group.subSector}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(group.indicators || []).map((ind, indIndex) => {
              const isActive =
                activeIndicator?.dataItem === ind.dataItem &&
                activeIndicator?.dataName === ind.dataName &&
                activeIndicator?.dataSet === ind.dataSet;

              const uniqueKey = `${type}-${group.sector || 'sector'}-${group.subSector || 'subsector'}-${ind.dataItem || 'indicator'}-${ind.dataSet || 'dataset'}-${indIndex}`;

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

      {/* Flow Arrow */}
      {type !== 'laggingIndicator' && (
        <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#DDE3DE] text-slate-400 rounded-full w-5 h-5 items-center justify-center text-xs font-bold shadow-sm">
          →
        </div>
      )}
    </div>
  );
};

  const hasIndicatorData = activeIndicatorData.some((v) => v !== null && v !== undefined && Number.isFinite(Number(v)));
  const hasStockData = stockPriceData.some((v) => v !== null && v !== undefined && Number.isFinite(Number(v)));

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: activeIndicator ? activeIndicator.dataItem : 'Indicator',
        data: activeIndicatorData,
        borderColor: '#C7912F',
        backgroundColor: '#C7912F',
        yAxisID: 'yIndicator',
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#C7912F',
        pointBorderColor: '#C7912F',
        fill: false,
        spanGaps: true,
      },
      {
        label: `${companySymbol || 'Company'} Share Price`,
        data: stockPriceData,
        borderColor: '#152238',
        backgroundColor: '#152238',
        yAxisID: 'yStock',
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#152238',
        pointBorderColor: '#152238',
        fill: false,
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: { family: 'Inter, sans-serif', size: 11 },
          usePointStyle: true,
          padding: 12,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items) => (items && items.length ? formatChartDate(items[0].label) : ''),
          label: (context) => {
            const value = context.parsed?.y;
            if (value === null || value === undefined || !Number.isFinite(Number(value))) {
              return `${context.dataset.label}: --`;
            }
            if (context.dataset.yAxisID === 'yStock') {
              return `${context.dataset.label}: ₹${formatNumber(value)}`;
            }
            return `${context.dataset.label}: ${formatNumber(value)}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true, speed: 0.05, modifierKey: 'ctrl' },
          pinch: { enabled: true },
          drag: { enabled: true, threshold: 10 },
          mode: 'x',
          onZoomComplete: ({ chart }) => chart.update(),
        },
        pan: { enabled: true, mode: 'x', modifierKey: 'shift' },
        limits: { x: { minRange: 5 } },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(203, 213, 225, 0.4)' },
        ticks: {
          color: '#64748b',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 15,
          callback: function (value) {
            return formatChartDate(this.getLabelForValue(value));
          },
        },
      },
      yIndicator: {
        type: 'linear',
        position: 'left',
        beginAtZero: false,
        grid: { color: 'rgba(203, 213, 225, 0.4)' },
        ticks: { color: '#C7912F', callback: (v) => formatNumber(v) },
        title: {
          display: true,
          text: activeIndicator ? activeIndicator.dataItem : 'Indicator',
          color: '#C7912F',
          font: { size: 10, weight: '600' },
        },
      },
      yStock: {
        type: 'linear',
        position: 'right',
        beginAtZero: false,
        grid: { drawOnChartArea: false },
        ticks: { color: '#152238', callback: (v) => `₹${formatNumber(v)}` },
        title: {
          display: true,
          text: `${companySymbol || 'Company'} Share Price`,
          color: '#152238',
          font: { size: 10, weight: '600' },
        },
      },
    },
  };

  const resetZoom = () => {
    if (chartRef.current && typeof chartRef.current.resetZoom === 'function') {
      chartRef.current.resetZoom();
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
            <p className="text-xs text-slate-500 font-mono">LOADING COMPANY DATA...</p>
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
            <h2 className="text-base font-semibold text-rose-600 mb-2">Error</h2>
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F5F2] text-[#0F1A2B] font-sans antialiased">
      <Head>
        <title>{companyName ? `${companyName} — Macro Indicators` : 'Company Macro Dashboard'}</title>
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
              <span className="text-slate-400">Loading market indicators...</span>
            </div>
          ) : tickertapeData.length > 0 ? (
            [1, 2, 3].map((repeatGroup) => (
              <div key={repeatGroup} className="flex gap-6 sm:gap-8 items-center px-4">
                {tickertapeData.map((item) => (
                  <span key={`${item.id}-${repeatGroup}`} className="inline-flex items-center gap-1.5 text-slate-200">
                    <span>{item.name}</span>
                    {item.val !== null && <b className="text-white">{item.val}</b>}
                    <span className={item.type === 'down' ? 'text-[#F0A08C]' : 'text-[#6FD3A5]'}>
                      {item.chg}
                    </span>
                  </span>
                ))}
              </div>
            ))
          ) : (
            <div className="flex gap-8 items-center px-4">
              <span className="text-slate-400">Market data unavailable</span>
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
                <h1 className="text-xl font-bold text-[#152238] tracking-tight">{companyName}</h1>
                <span className="bg-[#F2F5F2] border border-[#DDE3DE] text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                  {companySymbol}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Sector: Oil & Gas Exploration</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                <span>Macro Alignment Engine</span>
              </p>
            </div>
            <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Stock Price</p>
                <p className="text-xl font-bold text-emerald-600">
                  {stockPrice !== null ? `₹${formatNumber(stockPrice)}` : '--'}
                  {stockChange !== null && (
                    <span className={`text-xs font-semibold ml-1 ${stockChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ({stockChange >= 0 ? '+' : ''}{Number(stockChange).toFixed(2)}%)
                    </span>
                  )}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Market Cap</p>
                <p className="text-lg font-bold text-slate-800">
                  {marketCap !== null && marketCap !== undefined && marketCap !== ''
                    ? `₹${formatNumber(marketCap)} Cr`
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
{renderStage('leadingIndicator')}
{renderStage('rawMaterial')}
{renderStage('outputProduct')}
{renderStage('laggingIndicator')}
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
                    {activeIndicator ? activeIndicator.dataItem : 'Select an indicator'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-[#F2F5F2] border border-[#DDE3DE] px-3 py-1.5 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Correlation:{' '}
                    <strong className="text-emerald-600 font-bold">
                      {formatCorrelation(correlation) !== '--'
                        ? `r = ${formatCorrelation(correlation)}`
                        : '--'}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={resetZoom}
                  className="text-xs bg-[#F2F5F2] border border-[#DDE3DE] px-3 py-1.5 rounded-lg hover:bg-slate-200 transition"
                >
                  Reset Zoom
                </button>
              </div>
            </div>
            <div className="relative h-80 w-full">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Loading chart data...
                </div>
              ) : hasIndicatorData || hasStockData ? (
                <Line
                  key={isZoomLoaded ? 'zoom-enabled' : 'zoom-disabled'}
                  data={chartData}
                  options={chartOptions}
                  ref={chartRef}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No time series data available for this indicator.
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-400 text-center">
              <span>🖱️ Scroll to zoom (Ctrl+Scroll) • Drag to pan (Shift+Drag)</span>
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
                    <th className="p-3">Indicator</th>
                    <th className="p-3">Category Stage</th>
                    <th className="p-3">Latest Value</th>
                    <th className="p-3">Impact Signal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {indicatorGroups.flatMap((group, groupIndex) =>
                    (group.indicators || []).map((ind, indIndex) => {
                      const cacheKey =
                        `${group.sector || 'sector'}|${group.subSector || 'subsector'}|${ind.dataName || ind.dataSet || 'dataset'}|${ind.dataItem}`;
                      const series = indicatorTimeSeries[cacheKey] || [];
                      const latest = series.length > 0 ? series[series.length - 1] : '--';
                      const stageMap = {
                        leadingIndicator: { label: 'Leading', classes: 'bg-blue-50 text-blue-700 border-blue-200/60' },
                        rawMaterial: { label: 'Raw Material', classes: 'bg-amber-50 text-amber-700 border-amber-200/60' },
                        outputProduct: { label: 'Output Product', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
                        laggingIndicator: { label: 'Lagging', classes: 'bg-purple-50 text-purple-700 border-purple-200/60' },
                      };
                      const stage = stageMap[group.indicatorType] || {
                        label: 'Unknown',
                        classes: 'bg-slate-50 text-slate-700 border-slate-200',
                      };
                      const rowKey = `${group.indicatorType || 'stage'}-${group.sector || 'sector'}-${group.subSector || 'subsector'}-${ind.dataItem || 'indicator'}-${ind.dataSet || 'dataset'}-${groupIndex}-${indIndex}`;
                      return (
                        <tr key={rowKey} className="hover:bg-[#F2F5F2]/70 transition-colors">
                          <td className="p-3 font-medium text-slate-800">{ind.dataItem}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${stage.classes}`}>
                              {stage.label}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-xs">{String(latest)}</td>
                          <td className="p-3 text-emerald-600 font-medium">Bullish</td>
                        </tr>
                      );
                    }),
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
                  Analyze leading indicators, input costs, output products and lagging financial signals
                  through one connected macroeconomic flow.
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
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
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