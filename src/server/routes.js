const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/api/metrics', (req, res) => {
  db.all("SELECT time, score FROM metrics", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const graphData = rows;
    const rating = Math.round(rows.reduce((acc, row) => acc + row.score, 0) / rows.length);
    res.json({ graphData, rating });
  });
});

module.exports = router;
