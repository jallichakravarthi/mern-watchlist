import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/WatchList.css";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true); // ✅ Ensure loading starts

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://mern-watchlist-backend.onrender.com/api/watchlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("📜 Watchlist Response:", data);

        if (res.ok && data.success) {
          setWatchlist(data.watchlist);
        } else {
          setError(data.message || "Failed to load watchlist.");
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError("Error fetching watchlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleAddMovie = async () => {
    const title = prompt("Enter movie title:");
    if (!title) return;
    const genre = prompt("Enter movie genre:");
    if (!genre) return;

    try {
      const res = await fetch("https://mern-watchlist-backend.onrender.com/api/watchlist/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, genre, status: "watching" }),
      });

      const data = await res.json();
      console.log("Add Movie Response:", data);

      if (res.ok && data.movie) {
        setWatchlist((prevList) => [...prevList, data.movie]);
      } else {
        console.error("Add failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Add Error:", error);
    }
  };

  const handleEdit = async (id, currentTitle, currentGenre) => {
    const newTitle = prompt("Enter new title (leave blank to keep the same):", currentTitle);
    const newGenre = prompt("Enter new genre (leave blank to keep the same):", currentGenre);

    if (!newTitle && !newGenre) return;

    try {
      const res = await fetch(`https://mern-watchlist-backend.onrender.com/api/watchlist/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle || currentTitle, genre: newGenre || currentGenre }),
      });

      const data = await res.json();
      if (res.ok) {
        setWatchlist((prevList) => prevList.map((item) => (item._id === id ? data.updatedMovie : item)));
      } else {
        console.error("Edit failed:", data.message);
      }
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`https://mern-watchlist-backend.onrender.com/api/watchlist/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (res.ok) {
        setWatchlist((prevList) => prevList.map((item) => (item._id === id ? data.updatedMovie : item)));
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`https://mern-watchlist-backend.onrender.com/api/watchlist/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        setWatchlist((prevList) => prevList.filter((item) => item._id !== id));
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div>
      <Navbar />

      <center>
        <h2>My Watchlist</h2>

        <div className="add-movie-container">
          <button className="add-movie-btn" onClick={handleAddMovie}>➕ Add Movie</button>
        </div>

        {loading && <p>Loading watchlist...</p>}
        {error && <p className="error">{error}</p>}

        {watchlist.length > 0 ? (
          <div className="watchlist-container">
            {watchlist.map((item) => (
              <div key={item._id} className="watchlist-item" style={{ backgroundColor: item.status === "completed" ? "#d4edda" : "#f8d7da" }}>
                <p><strong>{item.title}</strong> - {item.genre} ({item.status})</p>
                <div className="button-group">
                  <button onClick={() => handleEdit(item._id, item.title, item.genre)}>✏️ Edit</button>
                  {item.status === "watching" ? (
                    <button onClick={() => handleStatusChange(item._id, "completed")}>✅ Mark Complete</button>
                  ) : (
                    <button onClick={() => handleStatusChange(item._id, "watching")}>🔄 Unmark</button>
                  )}
                  <button onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No movies in your watchlist.</p>
        )}
      </center>
    </div>
  );
};

export default WatchList;
