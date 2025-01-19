const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS engagement (
    time TEXT NOT NULL,
    engagement_score INTEGER NOT NULL
  )`);
});

module.exports = db;
