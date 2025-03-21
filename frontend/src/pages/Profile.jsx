import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        console.log("Fetching profile...");
        const res = await fetch("http://localhost:5001/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", res.status, res.statusText);

        if (!res.ok) {
          let errorMessage = "Failed to fetch profile.";
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("Failed to parse error response:", jsonError);
          }

          if (res.status === 401) {
            setError("Session expired. Redirecting to login...");
            localStorage.removeItem("token");
            setTimeout(() => navigate("/login"), 1500);
          } else {
            setError(errorMessage);
          }
          return;
        }

        const data = await res.json();
        console.log("Profile data:", data);
        setUser(data.user || null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Error loading profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Profile</h2>

        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : user ? (
          <div className="profile-details">
            <img
              src={
                user.profilePic && user.profilePic.startsWith("http")
                  ? user.profilePic
                  : "data:image/png;base64,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"
              }
              alt="Profile"
              className="profile-img"
            />
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <p>No user data found.</p>
        )}
      </div>

      <style>{`
       
        .profile-container {
          display: flex;
          width:130%;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f0f2f5;
        }

        .profile-box {
          background: white;
          padding: 20px;
          width: 90%;
          max-width: 400px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 1px solid #ddd;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: black;
        }

        .profile-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid #4a90e2;
          object-fit: cover;
        }

        h2 {
          color: black;
          margin-bottom: 15px;
          font-size: 22px;
        }

        p {
          color: black;
          font-size: 16px;
          margin: 5px 0;
        }

        .error {
          color: red;
          font-weight: bold;
          font-size: 14px;
        }

        .loading {
          font-size: 16px;
          color: #555;
        }

        .logout-btn {
          background-color: #ff4d4d;
          color: white;
          border: none;
          padding: 8px 15px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .logout-btn:hover {
          background-color: #d63030;
        }
      `}</style>
    </div>
  );
};

export default Profile;
