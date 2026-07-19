'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from '../../styles/Pages/reports.module.css';

// Components
import DashboardLayout from "@/components/Layout/DashboardLayout";

// Utils / API
import { fetchDataFromPostApi } from '../../pages/api/Api';
import { isSessionTokenValid } from "../../pages/api/UtilFunctions";

export default function AIInsights() {
    const router = useRouter();

    // UI State
    const [SecSubdata, setSecSubdata] = useState([]);
    const [listOfDatasets, setListOfDatasets] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Chat & A2UI State
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [a2uiMessages, setA2uiMessages] = useState([]);
    const backendAPI = process.env.NEXT_PUBLIC_backendAPI;

    const chatEndRef = useRef(null);


    const handleSendMessage = async () => {
        const text = (inputValue || "").trim();
        if (!text || isLoading) return;

        const userMessage = { role: "user", content: text };
        setChatMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);
        // A2UIProvider expects an array of ServerToClientMessage; clear for new turn
        setA2uiMessages([]);

        try {
            const requestBody = {
                jsonrpc: "2.0",
                id: `req-${Date.now()}`,
                method: "sendMessage",
                params: {
                    message: {
                        role: "user",
                        parts: [{ text: text }]
                    }
                }
            };

            const response = await fetch(`${backendAPI}/a2a`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            const accumulatedMessages = [];

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const a2uiEvent = JSON.parse(line);
                        // Build one ServerToClientMessage per event (one of: surfaceUpdate, beginRendering, dataModelUpdate, deleteSurface)
                        if (a2uiEvent.beginRendering) {
                            accumulatedMessages.push({ beginRendering: a2uiEvent.beginRendering });
                        } else if (a2uiEvent.surfaceUpdate) {
                            accumulatedMessages.push({ surfaceUpdate: a2uiEvent.surfaceUpdate });
                        } else if (a2uiEvent.dataModelUpdate) {
                            accumulatedMessages.push({ dataModelUpdate: a2uiEvent.dataModelUpdate });
                        } else if (a2uiEvent.deleteSurface) {
                            accumulatedMessages.push({ deleteSurface: a2uiEvent.deleteSurface });
                        }
                    } catch (parseErr) {
                        console.error("Error parsing JSON line:", line, parseErr);
                    }
                }
                setA2uiMessages([...accumulatedMessages]);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            setChatMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Failed to connect to AI service." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <DashboardLayout>
            <div className={styles.resultBodyContainer}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col py-1">

                    {/* Chatbot area */}
                    <div className="my-8 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden" style={{ minHeight: "480px" }}>
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-700">Agent-to-Agent Chat</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Responses are rendered using A2UI Atomic protocol.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "400px" }}>
                                {chatMessages.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-8">Ask for a statistical summary to begin.</p>
                                )}

                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === "user"
                                                ? "bg-[#27406d] text-white rounded-br-md"
                                                : "bg-gray-100 text-gray-800 rounded-bl-md"
                                            }`}>
                                            {/* Render Text Content */}
                                            {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}

                                            {/* Render Inline A2UI (Optional) */}
                                            {msg.role === "assistant" && msg.a2uiData && (
                                                <div className="mt-2 pt-2 border-t border-gray-200 italic text-xs text-blue-600">
                                                    Interactive insight attached below.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-600 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm animate-pulse">
                                            AI is calculating...
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="e.g. Compare agricultural output vs GDP"
                                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#27406d]"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="bg-[#27406d] text-white px-5 py-2.5 rounded-xl hover:bg-[#1e3257] disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* A2UI Component Display (Full Width) */}
                    {a2uiMessages.length > 0 && (
                        <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-md animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <i className="bi bi-graph-up"></i>
                                Dynamic Insights View
                            </h3>
                    
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}