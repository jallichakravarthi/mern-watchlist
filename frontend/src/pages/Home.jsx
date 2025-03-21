import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css"; // Importing CSS file

const Home = () => {
  return (
    <>
      <Navbar /> {/* Keep Navbar at the top */}
      <div className="home-content">
        <h2>🎬 Welcome to Movie Watchlist</h2>
        <p>Discover, track, and organize your favorite movies & shows! 🍿</p>
        
        <Link style={{height:350}} to="/watchlist">
          <button className="explore-btn">Explore Watchlist</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
