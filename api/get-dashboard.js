const db = require('../utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    // Get completion stats
    const statsQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_topics,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_topics
      FROM Study_Topics
      WHERE user_id = $1;
    `;
    const statsResult = await db.query(statsQuery, [user_id]);

    // Get time spent
    const timeQuery = `
      SELECT SUM(time_spent) as total_time_spent
      FROM Progress
      WHERE user_id = $1;
    `;
    const timeResult = await db.query(timeQuery, [user_id]);

    // Get recently added topics
    const recentTopicsQuery = `
      SELECT * FROM Study_Topics
      WHERE user_id = $1
      ORDER BY added_at DESC
      LIMIT 5;
    `;
    const recentTopicsResult = await db.query(recentTopicsQuery, [user_id]);

    return res.status(200).json({ 
      stats: {
        completed: parseInt(statsResult.rows[0].completed_topics) || 0,
        pending: parseInt(statsResult.rows[0].pending_topics) || 0
      },
      total_hours: ((timeResult.rows[0].total_time_spent || 0) / 60).toFixed(1),
      recent_topics: recentTopicsResult.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
