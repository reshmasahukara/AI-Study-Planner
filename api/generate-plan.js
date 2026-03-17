const db = require('../utils/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, available_hours, start_time, include_breaks } = req.body;

  if (!user_id || !available_hours) {
    return res.status(400).json({ error: 'Missing user_id or available_hours' });
  }

  try {
    // 1. Fetch pending topics for the user prioritizing difficulty and older topics
    const topicsQuery = `
      SELECT * FROM Study_Topics 
      WHERE user_id = $1 AND status = 'pending'
      ORDER BY 
        CASE difficulty
          WHEN 'Hard' THEN 1
          WHEN 'Medium' THEN 2
          WHEN 'Easy' THEN 3
          ELSE 4
        END,
        added_at ASC;
    `;
    const topicsResult = await db.query(topicsQuery, [user_id]);
    const pendingTopics = topicsResult.rows;

    if (pendingTopics.length === 0) {
      return res.status(404).json({ error: 'No pending topics found to schedule' });
    }

    // 2. Simple scheduling algorithm
    // Assume each topic takes ~45 minutes of study, plus 15 minutes break if include_breaks
    const scheduleItems = [];
    let currentHour = start_time ? parseInt(start_time.split(':')[0]) : 8; // Default 8 AM
    let currentMinute = start_time ? parseInt(start_time.split(':')[1]) : 0;
    
    let hoursAllocated = 0;
    let topicIndex = 0;

    // Helper to add minutes
    const addMinutes = (h, m, mins) => {
        let newM = m + mins;
        let newH = h + Math.floor(newM / 60);
        newM = newM % 60;
        return { h: newH % 24, m: newM };
    };

    const formatTime = (h, m) => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const displayM = m.toString().padStart(2, '0');
        return `${displayH}:${displayM} ${ampm}`;
    };

    while (hoursAllocated < available_hours && topicIndex < pendingTopics.length) {
        const topic = pendingTopics[topicIndex];
        
        // Study block
        const studyStartTime = formatTime(currentHour, currentMinute);
        const afterStudy = addMinutes(currentHour, currentMinute, 45); // 45 min study
        const studyEndTime = formatTime(afterStudy.h, afterStudy.m);
        
        scheduleItems.push({
            id: topic.topic_id,
            title: topic.title,
            category: topic.category,
            type: 'study',
            start_time: studyStartTime,
            end_time: studyEndTime,
            completed: false
        });

        currentHour = afterStudy.h;
        currentMinute = afterStudy.m;
        hoursAllocated += 0.75; // 45 mins

        // Break block
        if (include_breaks && hoursAllocated < available_hours) {
            const breakStartTime = formatTime(currentHour, currentMinute);
            const afterBreak = addMinutes(currentHour, currentMinute, 15); // 15 min break
            const breakEndTime = formatTime(afterBreak.h, afterBreak.m);
            
            scheduleItems.push({
                type: 'break',
                title: 'Short Break',
                start_time: breakStartTime,
                end_time: breakEndTime,
                completed: false
            });
            
            currentHour = afterBreak.h;
            currentMinute = afterBreak.m;
            hoursAllocated += 0.25; // 15 mins
        }
        
        topicIndex++;
    }

    // 3. Save to database
    const today = new Date().toISOString().split('T')[0];
    const planQuery = `
      INSERT INTO Study_Plan (user_id, date, schedule_json)
      VALUES ($1, $2, $3)
      ON CONFLICT (plan_id) DO NOTHING
      RETURNING *;
    `;
    const planResult = await db.query(planQuery, [user_id, today, JSON.stringify(scheduleItems)]);

    return res.status(201).json({ success: true, plan: planResult.rows[0] });

  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
