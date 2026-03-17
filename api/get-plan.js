const db = require('../utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, date } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const queryDate = date || new Date().toISOString().split('T')[0];

  try {
    const query = `
      SELECT * FROM Study_Plan
      WHERE user_id = $1 AND date = $2
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await db.query(query, [user_id, queryDate]);

    if (result.rows.length === 0) {
      return res.status(200).json({ plan: null });
    }

    return res.status(200).json({ plan: result.rows[0] });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
