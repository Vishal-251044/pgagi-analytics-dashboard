import React, { useEffect, useState } from "react";
import { FaCloudSun, FaNewspaper, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEdit } from "react-icons/fa";
import "../screensCSS/Profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ name: "", password: "" });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/");
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const getFirstLetter = (name) => name.charAt(0).toUpperCase();

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/user/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: updatedUser.name,
                        password: updatedUser.password,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                const updatedUserData = { ...user, name: updatedUser.name };
                setUser(updatedUserData);
                localStorage.setItem("user", JSON.stringify(updatedUserData));
                setShowModal(false);
                toast.success("User details updated successfully!");
            } else {
                toast.error("Error updating user details");
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
            console.error("Update Error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            <Navbar />
            <div className="profile-page">
                {user ? (
                    <div>
                        <div className="profile-header">
                            <div className="profile-image">{getFirstLetter(user.name)}</div>
                            <div className="profile-info">
                                <p>
                                    <b>Name:</b> {user.name}
                                </p>
                                <p>
                                    <b>Email:</b> {user.email}
                                </p>
                                <button className="logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                            <div>
                                <FaEdit className="edit-icon" onClick={handleEditClick} />
                            </div>
                        </div>
                        <div className="info-buttons">
                            <button className="info-box" onClick={() => navigate("/weather")}>
                                <FaCloudSun className="icon" />
                                <span>Weather</span>
                            </button>
                            <button className="info-box" onClick={() => navigate("/news")}>
                                <FaNewspaper className="icon" />
                                <span>News</span>
                            </button>
                            <button className="info-box" onClick={() => navigate("/finance")}>
                                <FaChartLine className="icon" />
                                <span>Finance</span>
                            </button>
                        </div>

                        {showModal && (
                            <div className="edit-modal">
                                <div className="modal-content">
                                    <h2>Edit Profile</h2>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Update Name"
                                        value={updatedUser.name}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Update Password"
                                        value={updatedUser.password}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                    <div className="modal-buttons">
                                        <button className="primary-button" onClick={handleUpdate}>
                                            Confirm
                                        </button>
                                        <button
                                            className="secondary-button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Profile;
