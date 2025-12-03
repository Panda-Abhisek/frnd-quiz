require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to submit answers
app.post('/api/submit', (req, res) => {
  const { answers, location } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'No answers provided' });
  }

  const answersString = JSON.stringify(answers);
  const latitude = location?.latitude || null;
  const longitude = location?.longitude || null;

  const sql = `INSERT INTO responses (answers, latitude, longitude) VALUES ($1, $2, $3) RETURNING id`;
  db.run(sql, [answersString, latitude, longitude], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to save responses' });
    }
    res.json({ message: 'Responses saved successfully', id: this.lastID });
  });
});

// Endpoint to retrieve responses (for verification)
app.get('/api/responses', (req, res) => {
  const sql = `SELECT * FROM responses ORDER BY timestamp DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve responses' });
    }
    res.json({
      message: 'Success',
      data: rows.map(row => ({
        ...row,
        answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers
      }))
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
