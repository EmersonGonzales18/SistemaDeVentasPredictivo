const sqlite3 = require('sqlite3').verbose();

class Connection {
  constructor(database) {
    this.database = database;
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.database, (err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          reject(err);
        } else {
          console.log('Connected to the database.');
          resolve();
        }
      });
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  exec(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing the database connection:', err);
          reject(err);
        } else {
          console.log('Database connection closed.');
          resolve();
        }
      });
    });
  }
}

module.exports = Connection;
