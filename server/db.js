require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL for both development and production
console.log('Using PostgreSQL database');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

// Create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    answers JSONB,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log('PostgreSQL table ready');
}).catch(err => {
  console.error('Error creating PostgreSQL table:', err);
});

// Wrapper to match the expected API
const db = {
  run: (sql, params, callback) => {
    // Convert INSERT to PostgreSQL format
    if (sql.includes('INSERT INTO responses')) {
      pool.query(
        sql,
        params,
        (err, result) => {
          if (callback) {
            if (err) {
              callback.call({ lastID: null }, err);
            } else {
              callback.call({ lastID: result.rows[0].id }, null);
            }
          }
        }
      );
    } else {
      pool.query(sql, params, callback);
    }
  },
  all: (sql, params, callback) => {
    pool.query(sql, params, (err, result) => {
      if (callback) {
        callback(err, result ? result.rows : null);
      }
    });
  }
};

module.exports = db;
