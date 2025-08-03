'use client';
import React, { useState, useMemo } from 'react';
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

export default function RenderChartsFromCSVgrid({ headers, rows, description, bucketUrl, heading, units }) {
    const [chartType, setChartType] = useState('line');
    const [transposed, setTransposed] = useState(false);

    const categories = useMemo(() => {
        if (!transposed) {
            return rows.map(row => row[0]);
        }
        return headers.slice(1);
    }, [rows, headers, transposed]);

    const seriesData = useMemo(() => {
        if (!transposed) {
            return headers.slice(1).map((header, colIndex) => ({
                name: header,
                data: rows.map(row => parseIndianNumber(row[colIndex + 1]))
            }));
        }
        return rows.map(row => ({
            name: row[0],
            data: row.slice(1).map(val => parseIndianNumber(val))
        }));
    }, [headers, rows, transposed]);

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
                return this.points.map(point => {
                    let val = point.y;
                    let formatted;
                    if (val >= 10000000) formatted = (val / 10000000).toFixed(1) + ' Cr';
                    else if (val >= 1000000) formatted = (val / 1000000).toFixed(1) + ' Mn';
                    else if (val >= 1000) formatted = (val / 1000).toFixed(1) + ' k';
                    else formatted = val.toLocaleString('en-IN'); // Use Indian number format
                    return `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${formatted}</b><br/>`;
                }).join('');
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
                </div>
            )}
        </div>
    );
}