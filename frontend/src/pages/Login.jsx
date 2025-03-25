import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://mern-watchlist-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        console.log("Token saved:", data.token);

        setMessage("Login successful! 🎉 Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage(data.error || "Invalid credentials. Try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div style={styles.center}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.forgotPassword}>
          <Link to="/forgot-reset-password" style={styles.link}>
            Forgot Password?
          </Link>
        </p>

        <p>
        <label style={styles.label}></label>
          <Link to="/signup" style={styles.link}>
            Don't have an account? Signup
          </Link>
        </p>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "350px",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    margin:"50px auto",
    display:"flex",
    flexDirection: "column", // Stacks children vertically
    alignItems: "center", // Centers content horizontally
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  forgotPassword: {
    marginTop: "10px",
    fontSize: "14px",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
  },
  message: {
    color: "#d35400",
    fontSize: "14px",
    marginTop: "10px",
  },
  label: {
    color: "#3498db", // Change this to black or any visible color
    fontSize: "14px",
    fontWeight: "bold",
  }
};

export default Login;
