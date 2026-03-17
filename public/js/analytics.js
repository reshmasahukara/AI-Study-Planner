/**
 * Advanced Analytics - Chart.js integration
 */
class AnalyticsEngine {
    constructor() {
        this.ctxWeekly = document.getElementById('weekly-chart-canvas')?.getContext('2d');
        this.ctxSubject = document.getElementById('subject-chart-canvas')?.getContext('2d');
        
        this.sessions = storage.getSessions();
        this.schedule = storage.getSchedule();
        
        this.init();
    }

    init() {
        if (!this.ctxWeekly || !this.ctxSubject) return;
        this.renderWeeklyChart();
        this.renderSubjectChart();
    }

    renderWeeklyChart() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [0, 0, 0, 0, 0, 0, 0];
        
        this.sessions.forEach(s => {
            const dayIdx = new Date(s.timestamp).getDay();
            data[dayIdx] += parseFloat(s.duration);
        });

        new Chart(this.ctxWeekly, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Study Hours',
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a1c26',
                        titleColor: '#8b5cf6',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#64748b' }
                    }
                }
            }
        });
    }

    renderSubjectChart() {
        const categories = {};
        this.sessions.forEach(s => {
            const item = this.schedule.find(i => i.id === s.scheduleId);
            const cat = item ? item.category : 'Independent';
            categories[cat] = (categories[cat] || 0) + parseFloat(s.duration);
        });

        if (Object.keys(categories).length === 0) return;

        new Chart(this.ctxSubject, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#64748b', boxWidth: 12, padding: 20, font: { weight: 'bold', size: 10 } }
                    }
                },
                cutout: '70%',
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsEngine();
});
