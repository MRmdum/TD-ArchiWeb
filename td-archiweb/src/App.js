import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Import your page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";


function App() {
  return (
    <div>
      {/* Navigation Menu */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/RecipeDetail">RecipeDetail</Link></li>
          <li><Link to="/Favorites">Favorites</Link></li>
        </ul>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/RecipeDetail" element={<RecipeDetail />} />
        <Route path="/Favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
