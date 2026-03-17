/**
 * StorageEngine - Handles persistence and dynamic data calculations
 */
class StorageEngine {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('userTopics')) localStorage.setItem('userTopics', JSON.stringify([]));
        if (!localStorage.getItem('userSchedule')) localStorage.setItem('userSchedule', JSON.stringify([]));
        if (!localStorage.getItem('userGoals')) localStorage.setItem('userGoals', JSON.stringify([]));
        if (!localStorage.getItem('completedSessions')) localStorage.setItem('completedSessions', JSON.stringify([]));
    }

    // --- Topics ---
    getTopics() {
        try {
            return JSON.parse(localStorage.getItem('userTopics')) || [];
        } catch (e) {
            return [];
        }
    }

    addTopic(topic) {
        const topics = this.getTopics();
        const newTopic = { id: Date.now(), ...topic };
        topics.push(newTopic);
        localStorage.setItem('userTopics', JSON.stringify(topics));
        return newTopic;
    }

    clearTopics() {
        localStorage.setItem('userTopics', JSON.stringify([]));
    }

    // --- Schedule ---
    getSchedule() {
        try {
            return JSON.parse(localStorage.getItem('userSchedule')) || [];
        } catch (e) {
            return [];
        }
    }

    saveSchedule(schedule) {
        localStorage.setItem('userSchedule', JSON.stringify(schedule));
    }

    // --- Goals ---
    getGoals() {
        try {
            return JSON.parse(localStorage.getItem('userGoals')) || [];
        } catch (e) {
            return [];
        }
    }

    addGoal(goal) {
        const goals = this.getGoals();
        const newGoal = { id: Date.now(), progress: 0, ...goal };
        goals.push(newGoal);
        localStorage.setItem('userGoals', JSON.stringify(goals));
        return newGoal;
    }

    updateGoalProgress(id, progress) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === id);
        if (goal) {
            goal.progress = progress;
            localStorage.setItem('userGoals', JSON.stringify(goals));
        }
    }

    // --- Sessions & Stats ---
    getSessions() {
        try {
            return JSON.parse(localStorage.getItem('completedSessions')) || [];
        } catch (e) {
            return [];
        }
    }

    addSession(session) {
        const sessions = this.getSessions();
        sessions.push({ id: Date.now(), timestamp: new Date().toISOString(), ...session });
        localStorage.setItem('completedSessions', JSON.stringify(sessions));
        
        // Update schedule item status if linked
        if (session.scheduleId) {
            const schedule = this.getSchedule();
            const item = schedule.find(i => i.id === session.scheduleId);
            if (item) item.status = 'completed';
            this.saveSchedule(schedule);
        }
    }

    getStats() {
        const sessions = this.getSessions();
        const schedule = this.getSchedule();
        
        const totalHours = sessions.reduce((acc, s) => acc + (parseFloat(s.duration) || 0), 0);
        const tasksCompleted = schedule.filter(i => i.status === 'completed').length;
        
        // Focus time today
        const today = new Date().toDateString();
        const todayHours = sessions
            .filter(s => new Date(s.timestamp).toDateString() === today)
            .reduce((acc, s) => acc + (parseFloat(s.duration) || 0), 0);

        // Simple Streak Calculation
        const streak = this.calculateStreak(sessions);

        return {
            totalHours,
            tasksCompleted,
            todayHours,
            streak
        };
    }

    calculateStreak(sessions) {
        if (sessions.length === 0) return 0;
        
        const dates = [...new Set(sessions.map(s => new Date(s.timestamp).toDateString()))]
            .map(d => new Date(d))
            .sort((a, b) => b - a); // Sort descending

        let streak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        // Check if the most recent session was today or yesterday
        const lastSessionDate = dates[0];
        lastSessionDate.setHours(0, 0, 0, 0);
        
        const diffToToday = Math.floor((checkDate - lastSessionDate) / (1000 * 60 * 60 * 24));
        
        if (diffToToday > 1) return 0; // Streak broken

        for (let i = 0; i < dates.length; i++) {
            const sessionDate = dates[i];
            sessionDate.setHours(0, 0, 0, 0);
            
            const diff = Math.floor((checkDate - sessionDate) / (1000 * 60 * 60 * 24));
            
            if (diff === streak) {
                streak++;
            } else if (diff > streak) {
                break;
            }
        }
        return streak;
    }
}

const storage = new StorageEngine();
window.storage = storage; // Global access
