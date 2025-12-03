import { Pool } from 'pg';

console.log('Using PostgreSQL from Vercel serverless, URL set:', !!process.env.DATABASE_URL);

const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

let initialized = false;

async function init() {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS responses (
      id SERIAL PRIMARY KEY,
      answers JSONB,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  initialized = true;
}

export async function query(sql, params = []) {
  await init();
  return pool.query(sql, params);
}


