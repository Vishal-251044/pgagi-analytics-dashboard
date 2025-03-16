import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Weather from "./screens/Weather";
import News from "./screens/News";
import Finance from "./screens/Finance";
import Profile from "./screens/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

// 🔒 Protected Route Component
const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem("user");
  return user ? element : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = userAgent.includes("chrome") && !userAgent.includes("brave");
    const isBrave = userAgent.includes("brave");

    if (isChrome) {
      document.body.style.zoom = "110%";
    } else if (isBrave) {
      document.body.style.zoom = "90%";
    }
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/weather" element={<ProtectedRoute element={<Weather />} />} />
          <Route path="/news" element={<ProtectedRoute element={<News />} />} />
          <Route path="/finance" element={<ProtectedRoute element={<Finance />} />} />
          {/* 🔒 Protected route for profile */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        </Routes>

        {/* ✅ Toastify for global notifications */}
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
  );
}

export default App;
