const db = require("../utils/sqldb");

module.exports = class User {
  constructor(first_name, last_name, email, password, role) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  save() {
    // Check if email already exists
    return db
      .execute("SELECT * FROM users WHERE email = ?", [this.email])
      .then(([rows]) => {
        if (rows.length > 0) {
          // Email exists → reject promise
          throw new Error("Email already registered");
        }

        // Insert new user
        return db.execute(
          `INSERT INTO users (first_name, last_name, email, password, role)
           VALUES (?, ?, ?, ?, ?)`,
          [this.first_name, this.last_name, this.email, this.password, this.role]
        );
      })
      .then(() => {
        console.log("✅ User inserted successfully");
      })
      .catch((err) => {
        console.error("❌ Error in User.save:", err.message);
        throw err;
      });
  }
};
