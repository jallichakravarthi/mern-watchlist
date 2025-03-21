import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user icon

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link style={styles.link} to="/home">Home</Link>
        <Link style={styles.link} to="/watchlist">Watchlist</Link>
        <Link to="/profile" style={styles.profileIcon}>
          <FaUserCircle size={28} />
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#1c1c1c", // Dark background
    padding: "15px 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  profileIcon: {
    color: "#fff",
    cursor: "pointer",
    transition: "color 0.3s ease",
  },
};

export default Navbar;
