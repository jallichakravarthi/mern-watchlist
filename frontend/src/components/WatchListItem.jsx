import React, { useState } from "react";

const WatchListItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [genre, setGenre] = useState(item.genre);
  const [status, setStatus] = useState(item.status);

  const handleSave = () => {
    onUpdate(item._id, { title, genre, status });
    setIsEditing(false);
  };

  return (
    <div className="watchlist-item">
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3>{item.title}</h3>
          <p>Genre: {item.genre}</p>
          <p>Status: {item.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default WatchListItem;
