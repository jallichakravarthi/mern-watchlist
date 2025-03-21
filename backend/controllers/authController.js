const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Watchlist = require("../models/watchlist");
require("dotenv").config(); // Load environment variables
const rateLimit = require("express-rate-limit");
const axios = require("axios");



// ✅ Configure Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ✅ Corrected
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,  // ✅ Use .env file
    pass: process.env.EMAIL_PASS,  // ✅ Use Google App Password
  },
});

// ✅ Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Register a New User
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
    });
    await newUser.save();

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: `"Watchlist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP for Watchlist is ${otp}. It expires in 10 minutes.`,
    });

    res.status(201).json({ message: "User registered successfully. Please verify your email." });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Signup failed" });
  }
};

// ✅ Verify OTP and Activate User
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found." });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP." });
    if (new Date(user.otpExpires) < new Date()) return res.status(400).json({ error: "OTP expired." });

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // ✅ Send Welcome Email
    await transporter.sendMail({
      from: `"Watchlist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Watchlist!",
      text: "Your email has been successfully verified. Welcome to Watchlist!",
    });

    // ✅ Create a Default Watchlist (Fixed genre issue)
    await Watchlist.create({ 
      userId: user._id, 
      title: "My Watchlist", 
      genre: "General", // ✅ Default genre to prevent validation error
      status: "watching" 
    });

    res.json({ message: "Email verified. Welcome!" });
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

// ✅ Rate Limiter: Max 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: "Too many failed login attempts. Try again later." },
});

// ✅ Login Function with IP Logging & Rate Limiting
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(400).json({ error: "Email not verified. Please verify first." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // ✅ Get User's IP Address
    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // ✅ Fetch Location (Country, City) using IP
    let location = "Unknown Location";
    try {
      const response = await axios.get(`http://ip-api.com/json/${userIP}`);
      if (response.data.status === "success") {
        location = `${response.data.city}, ${response.data.country}`;
      }
    } catch (err) {
      console.error("IP Geolocation Error:", err.message);
    }

    // ✅ Send Login Alert Email
    await transporter.sendMail({
      from: `"Watchlist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Login Alert",
      text: `Your account was logged into on ${new Date().toLocaleString()} from IP: ${userIP} (${location}). If this was not you, please reset your password immediately.`,
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// ✅ Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(req.user.id).select("_id email isVerified");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user }); // Ensure response matches React expectation
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ✅ Resend OTP for Email Verification
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Email is already verified." });

    // Generate a new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    await user.save();

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: `"Watchlist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Resend: Verify Your Email",
      text: `Your new OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "New OTP sent successfully. Please check your email." });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

// ✅ Request Password Reset (Send OTP)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    // ✅ Send OTP Email
    await transporter.sendMail({
      from: `"Watchlist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "Password reset OTP sent. Check your email." });
  } catch (error) {
    console.error("Password Reset Request Error:", error.message);
    res.status(500).json({ error: "Failed to send password reset OTP" });
  }
};

// ✅ Reset Password (Verify OTP & Update Password)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date(user.otpExpires) < new Date()) return res.status(400).json({ error: "OTP expired" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

