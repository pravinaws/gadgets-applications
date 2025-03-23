const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path
const dbPath = path.resolve(__dirname, "./gadgets.db");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// Create gadgets table if not exists
db.run(
    `CREATE TABLE IF NOT EXISTS gadgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        secretInfo TEXT NOT NULL
    )`
);

// ✅ Create users table if not exists
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`
);

module.exports = db;
