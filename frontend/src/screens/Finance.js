import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../screensCSS/Finance.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

const SYMBOLS = [
    { label: "Apple (AAPL)", value: "AAPL" },
    { label: "Microsoft (MSFT)", value: "MSFT" },
    { label: "Google (GOOGL)", value: "GOOGL" },
    { label: "Tesla (TSLA)", value: "TSLA" },
    { label: "Amazon (AMZN)", value: "AMZN" },
    { label: "Nvidia (NVDA)", value: "NVDA" },
    { label: "Meta (META)", value: "META" },
    { label: "Netflix (NFLX)", value: "NFLX" },
    { label: "Adobe (ADBE)", value: "ADBE" },
    { label: "IBM (IBM)", value: "IBM" }
];

const Finance = () => {
    const [symbol, setSymbol] = useState(SYMBOLS[0]);
    const [interval, setInterval] = useState("5min");
    const [stockData, setStockData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStockData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching data for ${symbol.value} with API Key: ${API_KEY}`);

            const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol.value}&interval=${interval}&outputsize=full&apikey=${API_KEY}`
            );

            console.log("API Response:", response.data);

            if (!response.data || response.data["Error Message"]) {
                setError("Invalid stock symbol or API error. Try again.");
                setLoading(false);
                return;
            }

            if (response.data["Note"]) {
                setError("API limit reached. Please try again later.");
                setLoading(false);
                return;
            }

            const timeSeries = response.data[`Time Series (${interval})`];
            if (!timeSeries) {
                setError("Unexpected API response. Please try again.");
                setLoading(false);
                return;
            }

            const chartLabels = Object.keys(timeSeries).reverse();
            const chartPrices = chartLabels.map((time) => parseFloat(timeSeries[time]["1. open"]));

            const latestData = timeSeries[chartLabels[0]];

            setStockData({
                currentPrice: parseFloat(latestData["1. open"]),
                dailyHigh: Math.max(...chartPrices),
                dailyLow: Math.min(...chartPrices),
                volume: latestData["5. volume"],
                percentageChange:
                    (((chartPrices[0] - chartPrices[chartLabels.length - 1]) / chartPrices[chartLabels.length - 1]) * 100).toFixed(2),
            });

            setChartData({
                labels: chartLabels,
                datasets: [
                    {
                        label: `${symbol.value} Stock Price (${interval})`,
                        data: chartPrices,
                        borderColor: chartPrices[0] > chartPrices[chartLabels.length - 1] ? "green" : "red",
                        backgroundColor: "rgba(0, 128, 0, 0.1)",
                        tension: 0.3,
                    },
                ],
            });
        } catch (error) {
            setError("Error fetching stock data. Try again later.");
        }

        setLoading(false);
    }, [symbol, interval]);

    useEffect(() => {
        fetchStockData();
    }, [fetchStockData]);

    return (
        <div>
            <Navbar />
            <div className="finance-dashboard-container-dark-theme">
                <h1 className="finance-dashboard-heading-dark">Stock Market Tracker</h1>

                <div className="finance-dashboard-search-container">
                    <Select
                        options={SYMBOLS}
                        value={symbol}
                        onChange={setSymbol}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "#000",
                                border: "2px solid #000", 
                                color: "#fff", 
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                color: "#fff", 
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: "#000", 
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? "#222" : "#000", 
                                border: "1px solid aqua",
                                color: "#fff",
                            }),
                        }}
                    />

                    <select
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        className="finance-dashboard-interval-select"
                    >
                        <option value="1min">1 Min</option>
                        <option value="5min">5 Min</option>
                        <option value="15min">15 Min</option>
                        <option value="30min">30 Min</option>
                        <option value="60min">60 Min</option>
                    </select>
                    <button
                        onClick={fetchStockData}
                        disabled={loading}
                        className="finance-dashboard-fetch-button"
                    >
                        {loading ? "Fetching..." : "Get Data"}
                    </button>
                </div>

                {error && <p className="finance-dashboard-error-message">{error}</p>}

                {loading && (
                    <div className="finance-dashboard-loading-indicator">
                        <div className="loading-spinner"></div>
                        <span>Fetching Data</span>
                        <span className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                )}

                {stockData && !loading && (
                    <div className="finance-dashboard-stock-info">
                        <h2>{symbol.label} Stock Data</h2>
                        <p>Current Price: <b>${stockData.currentPrice}</b></p>
                        <p>Daily High: <b>${stockData.dailyHigh}</b></p>
                        <p>Daily Low: <b>${stockData.dailyLow}</b></p>
                        <p>Volume: <b>{stockData.volume}</b></p>
                        <p>
                            Change:
                            <b style={{ color: stockData.percentageChange >= 0 ? "green" : "red" }}>
                                {stockData.percentageChange}%
                            </b>
                        </p>
                    </div>
                )}

                {chartData && !loading && (
                    <div className="finance-dashboard-chart-container">
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Finance;
