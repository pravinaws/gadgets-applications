require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const twilio = require("twilio");
const db = require("../config/database");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// 👉 Send OTP via SMS/WhatsApp
exports.sendOtp = (req, res) => {
    console.log("▶️ [sendOtp] Request received:", req.body);

    const { phone, channel } = req.body;

    if (!phone || !channel) {
        console.warn("⚠️ [sendOtp] Missing phone or channel");
        return res.status(400).json({ message: "Phone and channel are required." });
    }

    client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: phone, channel : channel })
        .then(verification => {
            console.log("✅ [sendOtp] OTP sent:", verification.sid);
            res.json({ success: true, message: `OTP sent via ${channel}`, sid: verification.sid });
        })
        .catch(err => {
            console.error("❌ [sendOtp] Error sending OTP:", err.message);
            res.status(500).json({ success: false, error: err.message });
        });
};

// 👉 Verify OTP and login/register
exports.verifyOtp = (req, res) => {
    console.log("▶️ [verifyOtp] Request received:", req.body);

    const { phone, code, name } = req.body;

    if (!phone || !code) {
        console.warn("⚠️ [verifyOtp] Missing phone or code");
        return res.status(400).json({ message: "Phone and OTP code are required." });
    }

    client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: phone, code : code })
        .then(result => {
            console.log("🔍 [verifyOtp] OTP verification result:", result.status);

            if (result.status !== "approved") {
                return res.status(401).json({ message: "Invalid or expired OTP." });
            }

            User.findByPhone(phone, (err, user) => {
                if (err) {
                    console.error("❌ [verifyOtp] DB error:", err.message);
                    return res.status(500).json({ error: err.message });
                }

                if (user) {
                    console.log("✅ [verifyOtp] Existing user found:", user.phone);
                    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return res.json({ token, message: "Login successful", user });
                }

                // Register new user
                const dummyPassword = bcrypt.hashSync(Math.random().toString(36).slice(-8), 10);
                console.log("🆕 [verifyOtp] Registering new user:", name || "New User");

                User.createUserByPhone(name || "New User", phone, dummyPassword, (err, newUser) => {
                    if (err) {
                        console.error("❌ [verifyOtp] Error creating user:", err.message);
                        return res.status(500).json({ error: err.message });
                    }

                    const token = jwt.sign({ id: newUser.id, phone: newUser.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return res.status(201).json({ token, message: "User registered via phone", user: newUser });
                });
            });
        })
        .catch(err => {
            console.error("❌ [verifyOtp] OTP verification error:", err.message);
            res.status(500).json({ error: err.message });
        });
};

// 👉 Email-based Register
exports.register = (req, res) => {
    console.log("▶️ [register] Request received:", req.body);

    const { name, email, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            console.error("❌ [register] DB error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (existingUser) {
            console.warn("⚠️ [register] Email already exists:", email);
            return res.status(400).json({ message: "Email already exists" });
        }

        User.createUser(name, email, password, (err, newUser) => {
            if (err) {
                console.error("❌ [register] User creation error:", err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log("✅ [register] User registered:", newUser.email);
            res.status(201).json({ message: "User registered successfully", user: newUser });
        });
    });
};

// 👉 Email-based Login
exports.login = (req, res) => {
    console.log("▶️ [login] Request received:", req.body);

    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error("❌ [login] DB error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            console.warn("⚠️ [login] User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("❌ [login] Bcrypt error:", err.message);
                return res.status(500).json({ error: err.message });
            }

            if (!isMatch) {
                console.warn("⚠️ [login] Incorrect password for:", email);
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log("✅ [login] Login successful:", user.email);
            res.json({ token, message: "Login successful" });
        });
    });
};

// 👉 Get user by ID
exports.getUserById = (req, res) => {
    const userId = req.params.id;
    console.log("▶️ [getUserById] Fetching user with ID:", userId);

    User.findById(userId, (err, user) => {
        if (err) {
            console.error("❌ [getUserById] DB error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            console.warn("⚠️ [getUserById] User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ [getUserById] User found:", user);
        res.json(user);
    });
};

// 👉 Check if DB and 'users' table exists
exports.checkDatabaseHealth = (req, res) => {
    console.log("▶️ [checkDatabaseHealth] Checking if 'users' table exists...");

    db.get("SELECT * FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) {
            console.error("❌ [checkDatabaseHealth] DB error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        if (row) {
            console.log("✅ [checkDatabaseHealth] 'users' table exists.");
            res.json({ success: true, message: "Database and 'users' table exist." });
        } else {
            console.warn("⚠️ [checkDatabaseHealth] 'users' table does NOT exist.");
            res.status(404).json({ success: false, message: "'users' table does not exist." });
        }
    });
};
