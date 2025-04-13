const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {};

// Find user by email
User.findByEmail = (email, callback) => {
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    callback(err, row);
  });
};

// Create user with email
User.createUser = (name, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, name, email });
      }
    );
  });
};

// Find user by phone
User.findByPhone = (phone, callback) => {
  db.get("SELECT * FROM users WHERE phone = ?", [phone], (err, row) => {
    callback(err, row);
  });
};

User.getAllData = (callback) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      callback(err, rows);
    });
  };
  

// Create user by phone
User.createUserByPhone = (name, phone, hashedPassword, callback) => {
  db.run(
    "INSERT INTO users (name, phone, password) VALUES (?, ?, ?)",
    [name, phone, hashedPassword],
    function (err) {
      if (err) return callback(err);
      const newUser = { id: this.lastID, name, phone };
      callback(null, newUser);
    }
  );
};

// Find user by ID
User.findById = (id, callback) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    callback(err, row);
  });
};

module.exports = User;
