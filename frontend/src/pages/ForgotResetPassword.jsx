import React, { useState } from "react";

const ForgotResetPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle sending OTP
  const handleForgotPassword = async () => {
    try {
      const response = await fetch("https://mern-watchlist-backend.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your email.");
        setStep(2); // Move to OTP input step
      } else {
        setMessage(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("Something went wrong. Try again later.",error);
    }
  };

  // Handle resetting the password
  const handleResetPassword = async () => {
    try {
      const response = await fetch("https://mern-watchlist-backend.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! You can now log in.");
        setStep(1); // Reset back to email entry step
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setMessage(data.error || "Failed to reset password.");
      }
    } catch (error) {
      setMessage("Something went wrong. Try again later.",error);
    }
  };

  return (
    <center>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button style={styles.button} onClick={handleForgotPassword}>
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Enter OTP & New Password */}
        {step === 2 && (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button style={styles.button} onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </center>
  );
};

const styles = {
  container: {
    width: "350px",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    marginTop: "50px",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  message: {
    color: "#d35400",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default ForgotResetPassword;
