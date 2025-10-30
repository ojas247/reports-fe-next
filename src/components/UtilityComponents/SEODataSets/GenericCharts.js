'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartTypes = ['line', 'column', 'bar', 'area'];
const chartTypeIcons = {
    line: 'bi bi-graph-up',
    column: 'bi bi-columns-gap',
    bar: 'bi bi-bar-chart',
    area: 'bi bi-stack'
};

// Helper function to parse Indian number format (e.g., "53,63,089" -> 5363089)
const parseIndianNumber = (value) => {
    if (typeof value !== 'string') return parseFloat(value) || 0;
    // Remove commas and parse as float
    return parseFloat(value.replace(/,/g, '')) || 0;
};

// Converts "dd-mm-yyyy" → "Qn-FY'yy" or "FY'yy" based on granularity (Indian FY)
const formatToFYQuarterOrYear = (dateStr, granularity) => {
    if (!dateStr) return dateStr;

    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr; // Fallback if format is wrong

    const month = parseInt(parts[1], 10); // 1–12
    const year = parseInt(parts[2], 10);

    const fyYear = (month >= 4) ? year + 1 : year;

    if (granularity === "Quarterly") {
        let quarter;
        if (month >= 4 && month <= 6) quarter = 1;
        else if (month >= 7 && month <= 9) quarter = 2;
        else if (month >= 10 && month <= 12) quarter = 3;
        else quarter = 4; // Jan–Mar
        return `Q${quarter}-FY'${String(fyYear).slice(-2)}`;
    } else if (granularity === "Yearly") {
        return `FY'${String(fyYear).slice(-2)}`;
    } else if (granularity === "Calendar Year") {
        return `${String(year)}`;
    }
    return dateStr; // Default to original string for Monthly or other cases
};

export default function RenderChartsFromCSVgrid({ headers, rows, description, bucketUrl, heading, units, granularity }) {
    const [chartType, setChartType] = useState('line');
    const [transposed, setTransposed] = useState(false);
    const [granularityText, setGranularityText] = useState('');

    useEffect(() => {
        if (granularity === "Yearly") {
            setGranularityText("Financial YoY");
        } else if (granularity === "Quarterly") {
            setGranularityText("Financial QoQ");
        } else if (granularity === "Monthly") {
            setGranularityText("Monthly");
        } else if (granularity === "Calendar Year") {
            setGranularityText("Calendar Year");
        }
    }, [granularity]);

    const categories = useMemo(() => {
        const rawCategories = !transposed
            ? rows.map(row => row[0])
            : headers.slice(1);

        if (granularity === "Quarterly" || granularity === "Yearly" || granularity === "Calendar Year") {
            return rawCategories.map(date => formatToFYQuarterOrYear(date, granularity));
        }
        return rawCategories;
    }, [rows, headers, transposed, granularity]);

    const seriesData = useMemo(() => {
        if (!transposed) {
            return headers.slice(1).map((header, colIndex) => ({
                name: granularity === "Quarterly" || granularity === "Yearly" || granularity === "Calendar Year" ? formatToFYQuarterOrYear(header, granularity) : header,
                data: rows.map(row => parseIndianNumber(row[colIndex + 1]))
            }));
        }
        return rows.map(row => ({
            name: row[0],
            data: row.slice(1).map(val => parseIndianNumber(val))
        }));
    }, [headers, rows, transposed, granularity]);

    Highcharts.setOptions({
        lang: {
            numericSymbols: null // Disables default ["k", "M", "B", "T"] so we control it fully
        }
    });

    const chartOptions = useMemo(() => ({
        credits: { enabled: false },
        chart: {
            type: chartType,
        },
        title: {
            text: heading,
        },
        yAxis: {
            title: {
                text: units || null,
            },
            tickPixelInterval: 40,
            labels: {
                useHTML: true,
                formatter: function () {
                    const val = this.value;
                    if (val >= 10000000) return (val / 10000000).toFixed(1) + ' Cr';
                    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' Mn';
                    if (val >= 1000) return (val / 1000).toFixed(1) + ' k';
                    return val.toLocaleString('en-IN'); // Use Indian number format for small values
                }
            }
        },
        xAxis: {
            categories: categories,
        },
        tooltip: {
            shared: true,
            formatter: function () {
                const categoryLabel = categories[this.points[0].point.index];
                let tooltipHTML = `<b>${categoryLabel}</b><br/>`; // Formatted date/quarter/year on top

                this.points.forEach(point => {
                    let val = point.y;
                    let formatted;
                    if (val >= 10000000) formatted = (val / 10000000).toFixed(1) + ' Cr';
                    else if (val >= 1000000) formatted = (val / 1000000).toFixed(1) + ' Mn';
                    else if (val >= 1000) formatted = (val / 1000).toFixed(1) + ' k';
                    else formatted = val.toLocaleString('en-IN');
                    tooltipHTML += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${formatted}</b><br/>`;
                });

                return tooltipHTML;
            }
        },
        series: seriesData,
    }), [chartType, categories, seriesData, heading, description, units]);

    return (
        <div className="p-4 border rounded-xl shadow bg-white">
            <div className="mb-4 flex gap-2 flex-wrap">
                {chartTypes.map(type => (
                    <button
                        key={type}
                        className={`px-4 py-1 rounded text-sm font-medium border ${chartType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border-blue-600'
                            }`}
                        onClick={() => setChartType(type)}
                    >
                        <i className={`${chartTypeIcons[type]} mr-1`}></i>
                        {type}
                    </button>
                ))}
                <button
                    className="px-4 py-1 rounded text-sm font-medium border bg-green-600 text-white"
                    onClick={() => setTransposed(prev => !prev)}
                >
                    {transposed ? 'Rotate Back' : 'Swap Axes'}
                </button>
            </div>

            <HighchartsReact highcharts={Highcharts} options={chartOptions} />

            {bucketUrl && (
                <div className="mt-4">
                    <a
                        href={bucketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                    >
                        Download Raw Data
                    </a>
                    <div className="text-xs text-gray-500">
                        {granularityText && `Granularity: ${granularityText}`}
                    </div>
                </div>
            )}
        </div>
    );
}