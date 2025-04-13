const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/send-otp", authController.sendOtp);

router.get("/database", authController.checkDatabaseHealth);

router.post("/verify-otp", authController.verifyOtp);

// Register a user
router.post("/register", authController.register);

// Login a user
router.post("/login", authController.login);

// Get user details by ID
router.get("/user/:id", authController.getUserById);

module.exports = router;
