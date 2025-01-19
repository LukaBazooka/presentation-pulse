const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbFile = './engagement.db';
const dbExists = fs.existsSync(dbFile);

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
    if (!dbExists) {
        db.run(`CREATE TABLE engagement (
            time TEXT NOT NULL,
            engagement_score INTEGER NOT NULL
        )`);
        console.log('Database and table created.');
    } else {
        console.log('Database already exists.');
    }
});

// CRUD operations

// Create
function createEngagement(time, engagement_score) {
    db.run(`INSERT INTO engagement (time, engagement_score) VALUES (?, ?)`, [time, engagement_score], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

// Read
function readEngagements(callback) {
    db.all(`SELECT * FROM engagement`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });
}

// Update
function updateEngagement(id, engagement_score) {
    db.run(`UPDATE engagement SET engagement_score = ? WHERE rowid = ?`, [engagement_score, id], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
    });
}

// Delete
function deleteEngagement(id) {
    db.run(`DELETE FROM engagement WHERE rowid = ?`, id, function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
    });
}

db.close();
