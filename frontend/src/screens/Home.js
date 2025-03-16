import React, { useState, useEffect } from "react";
import { GrIntegration } from "react-icons/gr";
import { GoGraph } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import home1img from "../assets/home1.jpg";
import process from "../assets/home2.jpg";
import "../screensCSS/Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const text = "Advanced Interactive Data Analytics Dashboard...";
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            const cursorTimeout = setTimeout(() => {
                setCursorVisible(false);
            }, 500);
            return () => clearTimeout(cursorTimeout);
        }
    }, [index]);

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(blinkInterval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/contact`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Message sent successfully!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(data.error || "Failed to send message.", {
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            toast.error("Backend not working! Please try again later.", {
                autoClose: 3000,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <Navbar />
            <div className="home1container">
                <div className="home1text">
                    <h1>
                        {displayText.split("").map((char, i) => (
                            <span
                                key={i}
                                style={{
                                    color: i < index ? "#FFD700" : "#0b79c3",
                                    transition: "color 0.5s",
                                }}
                            >
                                {char}
                            </span>
                        ))}
                        <span className="cursor" style={{ opacity: cursorVisible ? 1 : 0 }}>
                            |
                        </span>
                    </h1>
                    <p>
                        PGAGI Analytics Dashboard provides real-time data insights, enhances decision-making, ensures high performance, improves user experience, supports authentication, and offers seamless accessibility with interactive visualizations and advanced animations.
                    </p>
                    <div className="m">
                        Turning data into powerful insights.
                    </div>
                </div>
                <div className="home1image">
                    <img src={home1img} alt="Sustainability" />
                </div>
            </div>

            <div className="features-section">
                <h1>Key Benefits Of This Application</h1>
                <div className="features-grid">
                    {[
                        {
                            icon: <GrIntegration />,
                            title: "Real-Time Data Integration",
                            description:
                                "Seamlessly integrates APIs for live weather, news, and financial data, ensuring users access the latest updates instantly.",
                        },
                        {
                            icon: <GoGraph />,
                            title: "Interactive Data Visualizations",
                            description:
                                "Offers dynamic charts and graphs, allowing users to analyze and interpret complex datasets effortlessly.",
                        },
                        {
                            icon: <FaLocationDot />,
                            title: "Location-Based Data",
                            description:
                                "Provides personalized weather and news updates based on the user's location for a more relevant experience.",
                        },
                        {
                            icon: <FaMobileAlt />,
                            title: "Responsive Design",
                            description:
                                "Ensures a seamless user experience across desktops, tablets, and smartphones with adaptive layouts.",
                        },
                        {
                            icon: <MdKeyboardVoice />,
                            title: "Voice Search Integration",
                            description:
                                "Enables users to search for weather, news, and financial data using voice commands for a hands-free experience.",
                        },
                        {
                            icon: <FaUserLock />,
                            title: "Secure User Authentication",
                            description:
                                "Implements strong authentication measures to protect user data and ensure privacy.",
                        },
                    ].map(({ icon, title, description }, index) => (
                        <div className="feature" key={index}>
                            <div className="feature-icon">{icon}</div>
                            <h2>{title}</h2>
                            <p>{description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="process">
                <div>
                    <img src={process} alt="Carbon Trading Process" />
                </div>
                <div>
                    <h1>How to Use?</h1>
                    <p>
                        To access this platform, first, log in using Google authentication. Once logged in, you can explore real-time weather, news, and financial data. By default, the location is set to Pune, but you can change it to view personalized data for any city. The platform provides interactive visualizations for weather trends, including temperature, humidity, and wind speed. Additionally, it displays the latest news and financial market insights relevant to the selected location. With an intuitive interface and seamless navigation, users can stay updated with accurate, real-time information, making informed decisions effortlessly. Enjoy a smart, data-driven experience with this platform!
                    </p>
                </div>
            </div>

            <div className="contact-us">
                <h2>Contact Us</h2>
                <div>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label>Message:</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Submit"}{" "}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
