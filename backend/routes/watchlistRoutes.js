const express = require("express");
const { addItem, removeItem, getWatchlist, updateItem } = require("../controllers/watchlistController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addItem);
router.get("/", authMiddleware, getWatchlist);
router.put("/update/:id", authMiddleware, updateItem);
router.delete("/remove/:id", authMiddleware, removeItem);
router.get("/watchlist", authMiddleware, getWatchlist);

module.exports = router;
