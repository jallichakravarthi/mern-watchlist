import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup Failed:", data);
        setMessage(data.error || "Signup failed.");
        return;
      }

      setMessage("OTP sent. Please check your email. 📩");
      setShowOtpField(true);
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("Server error. Try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Email verified successfully! 🎉 Redirecting...");
        setShowOtpField(false);

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage(data.error || "Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      setMessage("Server error. Try again later.");
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await fetch("http://localhost:5001/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("New OTP sent. Please check your email. 📩");
      } else {
        setMessage(data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setMessage("Server error. Try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <center>
      <div style={styles.container}>
        <h2 style={styles.heading}>Signup</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSignup()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSignup()}
        />

        <button style={styles.button} onClick={handleSignup}>
          Signup
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>

        {showOtpField && (
          <div>
            <h3 style={styles.otpHeading}>Enter OTP</h3>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyOtp()}
            />
            <button style={styles.button} onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            <button
              style={{ ...styles.button, backgroundColor: "#f39c12" }}
              onClick={handleResendOtp}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
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
  link: {
    color: "#3498db",
    textDecoration: "none",
  },
  otpHeading: {
    marginTop: "20px",
    color: "#333",
  },
  message: {
    color: "#d35400",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default Signup;
