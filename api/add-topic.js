const db = require('../utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, title, category, difficulty } = req.body;

  if (!user_id || !title || !category || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO Study_Topics (user_id, title, category, difficulty)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user_id, title, category, difficulty];
    const result = await db.query(query, values);

    return res.status(201).json({ success: true, topic: result.rows[0] });
  } catch (error) {
    console.error('Error adding topic:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
