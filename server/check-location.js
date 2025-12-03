require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkLatestResponse() {
  try {
    const result = await pool.query(
      'SELECT id, latitude, longitude, timestamp FROM responses ORDER BY timestamp DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      console.log('Latest Response:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('No responses found in database');
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkLatestResponse();
