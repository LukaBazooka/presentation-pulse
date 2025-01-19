const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE metrics (id INTEGER PRIMARY KEY, time TEXT, score INTEGER)");

  const stmt = db.prepare("INSERT INTO metrics (time, score) VALUES (?, ?)");
  const sampleData = [
    { time: '0:00', score: 70 },
    { time: '1:00', score: 75 },
    { time: '2:00', score: 80 },
    { time: '3:00', score: 85 },
    { time: '4:00', score: 90 }
  ];

  sampleData.forEach(data => {
    stmt.run(data.time, data.score);
  });

  stmt.finalize();
});

module.exports = db;
