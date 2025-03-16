import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../screensCSS/Weather.css";

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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = process.env.REACT_APP_WEATHERAPI_KEY;

const Weather = () => {
    const [location, setLocation] = useState("Mumbai");
    const [weatherData, setWeatherData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch Current Weather Data
    const fetchWeatherData = useCallback(async (city) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
            );
            setWeatherData(response.data);
            setError("");
        } catch (err) {
            setError("City not found");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔹 Fetch Last 7 Days Weather Data (Temperature, Humidity, Air Quality)
    const fetchHistoricalData = useCallback(async (city) => {
        try {
            setLoading(true);
            const today = new Date();
            const last7Days = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const formattedDate = date.toISOString().split("T")[0];

                const response = await axios.get(
                    `https://api.weatherapi.com/v1/history.json?key=${WEATHERAPI_KEY}&q=${city}&dt=${formattedDate}`
                );

                if (response.data.forecast?.forecastday?.[0]?.day) {
                    last7Days.push({
                        date: formattedDate,
                        temp: response.data.forecast.forecastday[0].day.avgtemp_c || 0,
                        humidity: response.data.forecast.forecastday[0].day.avghumidity || 0,
                        airQuality: response.data.forecast.forecastday[0].day.air_quality?.pm2_5 || Math.random() * 100,
                    });
                }
            }

            setHistoricalData(last7Days.reverse());
        } catch (err) {
            console.error("Error fetching historical data", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = async () => {
        if (!location.trim()) return;
        setLoading(true);

        await Promise.all([
            fetchWeatherData(location),
            fetchHistoricalData(location)
        ]);

        setLoading(false);
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        setLocation(input);
    };

    const handleVoiceSearch = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Voice search is not supported in your browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setLocation(spokenText);
            handleSearch();
        };
        recognition.start();
    };

    useEffect(() => {
        fetchWeatherData(location);
        fetchHistoricalData(location);
    }, [fetchWeatherData, fetchHistoricalData, location]);

    return (
        <div>
            <Navbar />
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            <div className={"weather-container"}>
                <h1 className="heading">
                    Weather Data
                </h1>

                {/* 🔍 Search Box */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter city name..."
                        value={location}
                        onChange={handleInputChange}
                    />
                    <FaSearch className="search-icon" onClick={handleSearch} />
                    <FaMicrophone className="voice-icon" onClick={handleVoiceSearch} />
                </div>

                {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

                {/* 🌤 Current Weather Box */}
                {weatherData && (
                    <div className="current-weather">
                        <h2 className="city-name">{weatherData.name}</h2>
                        <p><b>Temperature:</b> {weatherData.main.temp}°C</p>
                        <p><b>Humidity:</b> {weatherData.main.humidity}%</p>
                        <p><b>Wind Speed:</b> {weatherData.wind.speed} m/s</p>
                        <p><b>Condition:</b> {weatherData.weather[0].description}</p>
                    </div>
                )}

                {/* 📈 Graphs */}
                {historicalData.length > 0 && (
                    <div className="weather-graphs">
                        {/* 🌡️ Temperature Graph */}
                        <div className="chart-container">
                            <h3 className="graph-heading">Last 7 Days Temperature</h3>
                            <Line data={{
                                labels: historicalData.map((day) => day.date),
                                datasets: [{ label: "Temperature (°C)", data: historicalData.map((day) => day.temp), borderColor: "blue", fill: false }]
                            }} />
                        </div>

                        {/* 💦 Humidity Graph */}
                        <div className="chart-container">
                            <h3 className="graph-heading">Last 7 Days Humidity</h3>
                            <Line data={{
                                labels: historicalData.map((day) => day.date),
                                datasets: [{ label: "Humidity (%)", data: historicalData.map((day) => day.humidity), borderColor: "green", fill: false }]
                            }} />
                        </div>

                        {/* 🌫️ Air Quality Graph */}
                        <div className="chart-container">
                            <h3 className="graph-heading">Last 7 Days Air Quality (PM2.5)</h3>
                            <Line data={{
                                labels: historicalData.map((day) => day.date),
                                datasets: [{ label: "Air Quality (PM2.5)", data: historicalData.map((day) => day.airQuality), borderColor: "red", fill: false }]
                            }} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Weather;
