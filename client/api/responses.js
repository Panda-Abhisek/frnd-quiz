import { query } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await query('SELECT * FROM responses ORDER BY timestamp DESC', []);
    const rows = result.rows || [];

    return res.status(200).json({
      message: 'Success',
      data: rows.map((row) => ({
        ...row,
        answers:
          typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
      })),
    });
  } catch (err) {
    console.error('Error retrieving responses:', err);
    return res.status(500).json({ error: 'Failed to retrieve responses' });
  }
}


