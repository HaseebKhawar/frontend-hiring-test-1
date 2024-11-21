import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";     // Corrected import
import CallList from "./components/CallList"; // Corrected import


const App = () => {
  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("accessToken");

  console.log(Login, CallList);  // Log the components to check if they are imported correctly

return (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/calls" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/calls" element={isAuthenticated ? <CallList /> : <Navigate to="/login" />} />
    </Routes>
  </Router>
);
};

export default App;



