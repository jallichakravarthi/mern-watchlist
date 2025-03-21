const mongoose = require("mongoose");
const Watchlist = require("../models/watchlist");

// ✅ Add item to watchlist
exports.addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, genre, status } = req.body;

        if (!title || !genre) {
            return res.status(400).json({ message: "Title and genre are required" });
        }

        const newItem = new Watchlist({
            userId,
            title,
            genre,
            status: status || "watching"
        });

        await newItem.save();
        res.status(201).json({ message: "Movie added to watchlist!", movie: newItem });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Remove item from watchlist (with validation)
exports.removeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const itemToDelete = await Watchlist.findOne({ _id: id, userId });

        if (!itemToDelete) {
            return res.status(404).json({ message: "Movie not found or unauthorized" });
        }

        await itemToDelete.deleteOne();
        res.json({ message: "Movie removed from watchlist!", deletedMovie: itemToDelete });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get all watchlist items for a user (handle empty case)
exports.getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id; // Extract from token
        
        console.log("🔍 User ID from token:", userId); // ✅ Debugging Log

        const watchlist = await Watchlist.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();

        console.log("🎬 Retrieved Watchlist:", watchlist); // ✅ Debugging Log

        if (!watchlist.length) {
            return res.json({ success: true, message: "No movies in your watchlist yet.", watchlist: [] });
        }

        res.json({ success: true, message: "Watchlist retrieved", watchlist });
    } catch (error) {
        console.error("❌ Watchlist Fetch Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch watchlist" });
    }
};


// ✅ Update movie (validate input & ID)
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, genre, status } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        if (status && !["watching", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedItem = await Watchlist.findOneAndUpdate(
            { _id: id, userId },
            { title, genre, status },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Movie not found or unauthorized" });
        }

        res.json({ message: "Movie updated!", updatedMovie: updatedItem });
    } catch (error) {
        console.error("Error updating watchlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
