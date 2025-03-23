const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
    findByEmail: (email, callback) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            callback(err, row);
        });
    },

    createUser: (name, email, password, callback) => {
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
    },

    findById: (id, callback) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = User;
