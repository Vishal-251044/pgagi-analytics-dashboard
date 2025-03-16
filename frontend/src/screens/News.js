import React, { useState, useEffect } from "react";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../screensCSS/News.css";
import React, { useState, useEffect } from "react";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../screensCSS/News.css";

const News = () => {
    const [city, setCity] = useState("Mumbai");
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNews("Mumbai"); // Load default news
    }, []);

    // Fetch News from GNews API
    const fetchNews = async (query) => {
        if (!query) return;
        setLoading(true);
    
        try {
            const apiKey = process.env.REACT_APP_GNEWS_API_KEY;
            let url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=6&token=${apiKey}`;
    
            let response = await fetch(url);
            let data = await response.json();
    
            console.log("API Response:", data); // Debugging
    
            if (data.articles && data.articles.length > 0) {
                setNews(data.articles);
            } else if (data.errors) {
                console.error("API Error:", data.errors);
                console.warn("Switching to top-headlines...");
                
                // Try getting top headlines instead
                response = await fetch(
                    `https://gnews.io/api/v4/top-headlines?lang=en&max=6&token=${apiKey}`
                );
                data = await response.json();
                
                if (data.articles && data.articles.length > 0) {
                    setNews(data.articles);
                } else {
                    setNews([]);
                }
            } else {
                setNews([]);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setNews([]);
        }
    
        setLoading(false);
    };    

    // Handle search button click
    const handleSearch = () => {
        fetchNews(city);
    };

    // Handle voice search
    const handleVoiceSearch = () => {
        const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setCity(spokenText);
            fetchNews(spokenText);
        };
    };

    return (
        <div>
            <Navbar />
            <div className="news-container">
                <h1 className="heading">Latest News</h1>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <FaSearch className="search-icon" style={{ color: "white" }} onClick={handleSearch} />
                <FaMicrophone className="voice-icon" style={{ color: "white" }} onClick={handleVoiceSearch} />
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}

            {/* News List */}
            <div className="news-container">
                {news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index} className="news-card">
                            <img
                                src={article.image || "https://via.placeholder.com/300"}
                                alt={article.title}
                            />
                            <h3>{article.title}</h3>
                            <p>{article.description || "No description available."}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read More
                            </a>
                        </div>
                    ))
                ) : (
                    <p className="no-news">No news found for "{city}". Try a different search.</p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default News;

const News = () => {
    const [city, setCity] = useState("Mumbai");
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNews("Mumbai");
    }, []);

    const fetchNews = async (query) => {
        if (!query) return;
        setLoading(true);

        try {
            const apiKey = process.env.REACT_APP_NEWS_API_KEY;
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${query}&pageSize=6&apiKey=${apiKey}`
            );
            const data = await response.json();
            setNews(data.articles || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        }

        setLoading(false);
    };

    const handleSearch = () => {
        fetchNews(city);
    };

    const handleVoiceSearch = () => {
        const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setCity(spokenText);
            fetchNews(spokenText);
        };
    };

    return (
        <div>
            <Navbar />
            <div className="news-container">
                <h1 className="heading">Latest News</h1>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <FaSearch className="search-icon" style={{ color: "white" }} onClick={handleSearch} />
                <FaMicrophone className="voice-icon" style={{ color: "white" }} onClick={handleVoiceSearch} />

            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}

            {/* News List */}
            <div className="news-container">
                {news.map((article, index) => (
                    <div key={index} className="news-card">
                        <img src={article.urlToImage || "https://via.placeholder.com/300"} alt={article.title} />
                        <h3>{article.title}</h3>
                        <p>{article.description || "No description available."}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            Read More
                        </a>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default News;
