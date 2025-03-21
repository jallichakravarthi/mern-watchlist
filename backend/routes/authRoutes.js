const express = require("express");
const { register, verifyOTP, login, getUserProfile, resendOTP } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { requestPasswordReset, resetPassword } = require("../controllers/authController");


const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", requestPasswordReset);
router.get("/profile", authMiddleware, getUserProfile); // ✅ Profile route

module.exports = router;
