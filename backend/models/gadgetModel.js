const db = require("../config/database");

class Gadget {
    static getAll(callback) {
        db.all("SELECT id, name, description, price FROM gadgets", [], callback);
    }

    static getById(id, callback) {
        db.get("SELECT * FROM gadgets WHERE id = ?", [id], callback);
    }

    static create(gadget, callback) {
        const { name, description, price, secretInfo } = gadget;
        db.run(
            `INSERT INTO gadgets (name, description, price, secretInfo) VALUES (?, ?, ?, ?)`,
            [name, description, price, secretInfo],
            function (err) {
                callback(err, { id: this.lastID });
            }
        );
    }

    static update(id, gadget, callback) {
        const { name, description, price, secretInfo } = gadget;
        db.run(
            `UPDATE gadgets SET name = ?, description = ?, price = ?, secretInfo = ? WHERE id = ?`,
            [name, description, price, secretInfo, id],
            callback
        );
    }

    static delete(id, callback) {
        db.run("DELETE FROM gadgets WHERE id = ?", [id], callback);
    }
}

module.exports = Gadget;
