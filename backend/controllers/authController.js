const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Register user
exports.register = (req, res) => {
    const { name, email, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        User.createUser(name, email, password, (err, newUser) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "User registered successfully", user: newUser });
        });
    });
};

// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token, message: "Login successful" });
        });
    });
};

// Get user by ID
exports.getUserById = (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    });
};
