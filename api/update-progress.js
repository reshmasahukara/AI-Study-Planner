const db = require('../utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, topic_id, time_spent, plan_id, schedule_index } = req.body;

  if (!user_id && schedule_index === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Record progress if it's a topic
    if (topic_id) {
        const progressQuery = `
          INSERT INTO Progress (user_id, topic_id, completed, time_spent)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
        await db.query(progressQuery, [user_id, topic_id, true, time_spent || 45]);

        // 2. Mark topic as completed
        const topicQuery = `
          UPDATE Study_Topics
          SET status = 'completed'
          WHERE topic_id = $1;
        `;
        await db.query(topicQuery, [topic_id]);
    }

    // 3. Update the JSON schedule to reflect completion in the plan
    if (plan_id && schedule_index !== undefined) {
      const planQuery = `SELECT schedule_json FROM Study_Plan WHERE plan_id = $1`;
      const planRes = await db.query(planQuery, [plan_id]);
      
      if (planRes.rows.length > 0) {
        let schedule = planRes.rows[0].schedule_json;
        if (schedule[schedule_index]) {
            schedule[schedule_index].completed = true;
            
            const updatePlanQuery = `
              UPDATE Study_Plan
              SET schedule_json = $1
              WHERE plan_id = $2;
            `;
            await db.query(updatePlanQuery, [JSON.stringify(schedule), plan_id]);
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
