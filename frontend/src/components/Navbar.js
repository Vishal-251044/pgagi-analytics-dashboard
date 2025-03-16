import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../componentsCSS/Navbar.css";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinkStyles = ({ isActive }) => ({
        color: isActive ? "#00eaff" : "#fff",
    });

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/" onClick={toggleMobileMenu}>
                    <span className="logo-part Ai">PGAGI-</span>
                    <span className="logo-part Models">Dashboard</span>
                </NavLink>
            </div>

            <div className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
                {/* Always show Home button */}
                <NavLink to="/" style={navLinkStyles} onClick={toggleMobileMenu}>
                    Home
                </NavLink>

                {isLoggedIn ? (
                    <>
                        <NavLink to="/weather" style={navLinkStyles} onClick={toggleMobileMenu}>
                            Weather
                        </NavLink>
                        <NavLink to="/news" style={navLinkStyles} onClick={toggleMobileMenu}>
                            News
                        </NavLink>
                        <NavLink to="/finance" style={navLinkStyles} onClick={toggleMobileMenu}>
                            Finance
                        </NavLink>
                        <NavLink to="/profile" style={navLinkStyles} onClick={toggleMobileMenu}>
                            <FaUser size={20} />
                        </NavLink>
                    </>
                ) : (
                    <NavLink to="/login" className="login-button" style={navLinkStyles} onClick={toggleMobileMenu}>
                        Login
                    </NavLink>
                )}
            </div>

            <div className="hamburger" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                    <span className="close-icon">&times;</span>
                ) : (
                    <span className="hamburger-icon">&#9776;</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
