import React, { useEffect, useState } from "react";
import Sparkline from "../UtilityComponents/Tools/Sparkline";
import { fetchDataFromGetApi, fetchDataFromPostApi } from "../../pages/api/Api";


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
    { value: "Infra & Utilities", label: "Infra & Utilities" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Energy", label: "Energy Index" },
    { value: "Technology", label: "Tech Stocks" },
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
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Market and sectors</h2>
            </div>
            
            {/* Markets List (Collapsible Sections) */}
            <div className="mb-8 space-y-2">
                {listOfMarkets.map((market) => (
                    <div key={market.value} className="border border-gray-200 rounded-lg overflow-hidden">
                        
                        {/* Collapse Button (Header) */}
                        <button 
                            className="w-full text-left p-4 flex justify-between items-center transition-colors duration-200"
                            // Toggle the openMarket state to trigger the API call
                            onClick={() => setOpenMarket(
                                openMarket === market.value ? null : market.value // Close if already open, otherwise open this one
                            )}
                        >
                            <span className="font-semibold text-gray-800">{market.label}</span>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sparkData.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                                            >
                                                {/* Left: Title & Chart */}
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-gray-700 font-medium">{item.title}</p>
                                                    <div className={`w-32 h-10 relative overflow-hidden border rounded-md ${item.up ? "border-green-400" : "border-red-400"}`}>
                                                        <Sparkline data={item.data} up={item.up} />
                                                    </div>
                                                </div>
                                                
                                                {/* Right: Price & Change */}
                                                <div className="text-right">
                                                    <p className="text-gray-900 font-semibold">{item.price}</p>
                                                    <p className={`font-medium ${item.up ? "text-green-600" : "text-red-600"}`}>
                                                        {item.change}
                                                    </p>
                                                </div>
                                            </div>
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