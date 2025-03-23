const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const gadgetRoutes = require("./routes/gadgetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);

// Test connection endpoint
app.get("/api/connection", (req, res) => {
    console.log("Connection successful");
    res.status(200).json({ message: "Connection successful" });
});

// Routes
app.use("/api/gadgets", gadgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
