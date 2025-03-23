const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register a user
router.post("/register", authController.register);

// Login a user
router.post("/login", authController.login);

// Get user details by ID
router.get("/user/:id", authController.getUserById);

module.exports = router;
