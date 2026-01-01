import React, { useEffect, useState } from "react";
import Sparkline from "../UtilityComponents/Tools/Sparkline";
import { fetchDataFromGetApi, fetchDataFromPostApi } from "../../pages/api/Api";
import { Construction, Factory, FlaskConical, Leaf, Fuel, Gem } from 'lucide-react';


const data = [
    {
        title: "NIFTY 50",
        price: "26,033.75",
        change: "+0.18%",
        up: true,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "USD/INR",
        price: "90.12",
        change: "-0.26%",
        up: false,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "Gold",
        price: "13,037.30",
        change: "-0.35%",
        up: false,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "NIFTY 100 Largecap",
        price: "26,557.00",
        change: "+0.19%",
        up: true,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "NIFTY 100 Midcap",
        price: "60,299.80",
        change: "-0.03%",
        up: false,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "NIFTY 100 Smallcap",
        price: "17,607.85",
        change: "-0.24%",
        up: false,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "NIFTY Bank",
        price: "59,288.70",
        change: "-0.10%",
        up: false,
        data: [112, 114, 113, 115, 114, 116, 118, 117]
    },
    {
        title: "NIFTY IT",
        price: "38,360.25",
        change: "+1.41%",
        up: true,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
    {
        title: "NIFTY Pharma",
        price: "22,958.95",
        change: "+0.22%",
        up: true,
        data: [12, 14, 13, 15, 14, 16, 18, 17]
    },
];

const listOfMarkets = [
    { value: "Cement", icon: <Construction className="w-4 h-4 text-gray-500" /> },
    { value: "Textile", icon: <Factory className="w-4 h-4 text-gray-500" /> },
    { value: "Chemicals", icon: <FlaskConical className="w-4 h-4 text-gray-500" /> },
    { value: "Spices", icon: <Leaf className="w-4 h-4 text-gray-500" /> },
    { value: "Oil & Gas", icon: <Fuel className="w-4 h-4 text-gray-500" /> },
    { value: "Iron-Steel", icon: <Construction className="w-4 h-4 text-gray-500" /> },
    { value: "Mining and Jewels", icon: <Gem className="w-4 h-4 text-gray-500" /> },
];


export default function MarketUpdate() {
    const [sparkData, setSparkData] = useState([]);
    // State to track which market is currently open and should display data
    const [openMarket, setOpenMarket] = useState(listOfMarkets[0].value); // Default to the first market

    // --- API Fetching Logic ---
    useEffect(() => {
        const fetchData = async () => {
            // Use the openMarket state variable for the API payload
            const payload = { "market": openMarket };
            const data = await fetchDataFromPostApi(payload, "marketSparkLines");
            // Only update state if the returned data is for the currently open market (prevents race conditions)
            if (payload.market === openMarket) {
                setSparkData(data);
            }
        };

        // Fetch only if a market is selected/open
        if (openMarket) {
            setSparkData([]); // Clear previous data while loading new
            fetchData();
        }
    }, [openMarket]); // Dependency array: Re-run API call whenever openMarket changes


    return (
        <div className="bg-white shadow rounded-xl p-6">
            {/* Markets List (Collapsible Sections) */}
            <div className="mb-8 space-y-2">
                {listOfMarkets.map((market) => (
                    <div key={market.value} className="border border-gray-200 rounded-lg overflow-hidden">

                        {/* Collapse Button (Header) */}
                        <button
                            className="w-full text-left p-4 flex justify-between bg-[#27406D] items-center transition-colors duration-200"
                            // Toggle the openMarket state to trigger the API call
                            onClick={() => setOpenMarket(
                                openMarket === market.value ? null : market.value // Close if already open, otherwise open this one
                            )}
                        >
                            <span className="inline-flex items-center gap-2 font-semibold text-blue-50  text-xl">
                                {market.icon}
                                {market.value}
                            </span>


                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${openMarket === market.value ? 'rotate-180' : 'rotate-0'}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Collapsible Content (The Market Data Grid) */}
                        {openMarket === market.value && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50 animate-fade-in">

                                {sparkData.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {sparkData.map((item, idx) => (
                                           <a href={item.url} key={item.id || idx}>
                                                <div
                                                    // key={idx}
                                                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                                                >
                                                    {/* Left Side: Metadata & Chart */}
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-gray-500 text-[10px] uppercase tracking-wider mr-2">{item.displayTitle}</p>
                                                        <p className="text-gray-800 text-sm font-bold leading-tight">{item.displayItem}</p>

                                                        {/* Sparkline Container */}
                                                        <div className={`mt-1 w-32 h-10 relative overflow-hidden border rounded-md ${item.up ? "border-green-200" : "border-red-200"}`}>
                                                            <Sparkline data={item.data} up={item.up} />
                                                        </div>

                                                        {/* Granularity Label */}
                                                        <span className="text-[10px] text-gray-400 italic">
                                                            {item.granularity || 'Yearly'}
                                                        </span>
                                                    </div>

                                                    {/* Right Side: Price, Units & Change */}
                                                    <div className="text-right flex flex-col justify-between h-full">
                                                        <div>
                                                            <div className="flex items-baseline justify-end gap-1">
                                                                <span className="text-gray-900 font-bold text-lg">
                                                                    {new Number(item.price).toLocaleString('en-IN', {
                                                                        maximumFractionDigits: 1,
                                                                        minimumFractionDigits: 1
                                                                    })}
                                                                </span>
                                                                <span className="text-gray-500 text-xs">{item.units || 'tonnes'}</span>
                                                            </div>

                                                            {/* Price Change with Arrow */}
                                                            <p className={`flex items-center justify-end text-sm font-bold ${item.up ? "text-green-600" : "text-red-600"}`}>
                                                                {item.up ? '▲' : '▼'}
                                                                <span className="ml-1">{Math.abs(item.change)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>


                                ) : (
                                    <p className="text-center text-gray-500 py-4">Loading market data...</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Note: The sparkData display logic has been moved inside the collapsible section */}

        </div>
    );
}