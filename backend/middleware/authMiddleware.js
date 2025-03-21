const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🚫 No token provided in request headers.");
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("🔑 Received Token:", token); // ✅ Debugging log

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT Payload:", decoded); // ✅ Log entire decoded token

    // Ensure token contains `id`
    if (!decoded.id) {
      console.log("⚠️ JWT payload does not contain `id`.");
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select("_id email");
    if (!user) {
      console.log("❌ User not found in database.");
      return res.status(401).json({ success: false, message: "User not found. Authentication failed." });
    }

    req.user = user; // Attach user data to request object
    console.log("🙋‍♂️ Authenticated User:", user); // ✅ Debugging log

    next();
  } catch (error) {
    console.error("🚫 JWT Verification Error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    res.status(500).json({ success: false, message: "Authentication error. Please try again." });
  }
};

module.exports = authMiddleware;
