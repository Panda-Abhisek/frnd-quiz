import { query } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { answers, location } = req.body || {};

  if (!answers) {
    return res.status(400).json({ error: 'No answers provided' });
  }

  const answersString = JSON.stringify(answers);
  const latitude = location?.latitude ?? null;
  const longitude = location?.longitude ?? null;

  try {
    const result = await query(
      `INSERT INTO responses (answers, latitude, longitude) VALUES ($1, $2, $3) RETURNING id`,
      [answersString, latitude, longitude]
    );

    const id = result.rows[0]?.id;
    return res.status(200).json({ message: 'Responses saved successfully', id });
  } catch (err) {
    console.error('Error saving responses:', err);
    return res.status(500).json({ error: 'Failed to save responses' });
  }
}


