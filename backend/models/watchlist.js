const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  genre: { type: String, required: true }, 
  status: { type: String, enum: ["watching", "completed"], default: "watching" } 
}, { collection: "watchlists" });  // ✅ Explicitly set the collection name

module.exports = mongoose.model("Watchlist", watchlistSchema);
